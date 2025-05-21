import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth } from '../../firebase/firebase';

const screenWidth = Dimensions.get('window').width;

const categories = {
  Medical: '#FF6F00',
  Housing: '#F500A2',
  Foods: '#03A9F4',
  Transportation: '#D50000',
  Entertainment: '#EC407A',
  Bills: '#FFEB3B',
  Others: '#795548',
};

export default function HomeScreen() {
  const [expenses, setExpenses] = useState([]);
  const [cashBalance, setCashBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchCashBalance = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setCashBalance(userSnap.data().cashBalance || 0);
        } else {
          setCashBalance(0);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cash balance:', error);
        setCashBalance(null);
        setLoading(false);
      }
    };

    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const unsubscribeExpenses = onSnapshot(
      expensesRef,
      async (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(data);

        // Optional: Recalculate balance by subtracting expenses
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          let income = userSnap.exists() ? userSnap.data().cashBalance || 0 : 0;
          const totalExpenses = data.reduce((sum, exp) => sum + (exp.amount || 0), 0);
          const recalculatedBalance = income - totalExpenses;
          setCashBalance(recalculatedBalance);

          // Optional: Persist corrected balance to Firestore
          await updateDoc(userDocRef, {
            cashBalance: recalculatedBalance,
          });
        } catch (error) {
          console.error('Error recalculating balance:', error);
        }

        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    );

    fetchCashBalance();

    return () => {
      unsubscribeExpenses();
    };
  }, [user]);

  const categoryTotals = {};
  expenses.forEach(exp => {
    const cat = exp.category || 'Others';
    if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    categoryTotals[cat] += exp.amount || 0;
  });

  const chartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    amount: categoryTotals[cat],
    color: categories[cat] || '#777',
    legendFontColor: '#fff',
    legendFontSize: 14,
  }));

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Your Dashboard</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Cash Balance:</Text>
        <Text style={styles.balanceAmount}>
          {cashBalance !== null ? `$${cashBalance.toFixed(2)}` : 'Not set'}
        </Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Spent:</Text>
        <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
      </View>

      {expenses.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: '#2e7d32',
            backgroundGradientFrom: '#2e7d32',
            backgroundGradientTo: '#2e7d32',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noExpensesText}>No expenses added yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    alignSelf: 'center',
  },
  balanceContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 18,
    color: '#a5d6a7',
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  totalContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: '#a5d6a7',
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  noExpensesText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
});
