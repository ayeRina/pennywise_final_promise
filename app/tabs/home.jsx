import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
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

    // OPTION 1: Try to fetch "currentBalance" doc first (one doc approach)
    const fetchCurrentBalance = async () => {
      try {
        const balanceDocRef = doc(db, 'users', user.uid, 'balances', 'currentBalance');
        const balanceSnap = await getDoc(balanceDocRef);
        if (balanceSnap.exists()) {
          setCashBalance(balanceSnap.data().amount);
          setLoading(false);
        } else {
          // If no currentBalance doc, fallback to listen to balances collection
          listenToBalances();
        }
      } catch (error) {
        console.error('Error fetching currentBalance doc:', error);
        // fallback to listener
        listenToBalances();
      }
    };

    // OPTION 2: Listen to latest balance if currentBalance doc not found
    const listenToBalances = () => {
      const balancesRef = collection(db, 'users', user.uid, 'balances');
      const balancesQuery = query(balancesRef, orderBy('createdAt', 'desc'), limit(1));
      const unsubscribeBalance = onSnapshot(
        balancesQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const latestBalance = snapshot.docs[0].data().amount;
            setCashBalance(latestBalance);
          } else {
            setCashBalance(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching balances collection:', error);
          setLoading(false);
        }
      );

      return unsubscribeBalance;
    };

    // Expenses listener
    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const unsubscribeExpenses = onSnapshot(
      expensesRef,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    );

    // Start fetching balance first
    let unsubscribeBalance = null;
    fetchCurrentBalance().then(() => {
      // If fallback was called, unsubscribeBalance is returned
      // If not, it remains null
    });

    // If fallback used, unsubscribeBalance set, otherwise null

    return () => {
      if (unsubscribeBalance) unsubscribeBalance();
      unsubscribeExpenses();
    };
  }, [user]);

  // Aggregate expenses by category
  const categoryTotals = {};
  expenses.forEach(exp => {
    const cat = exp.category || 'Others';
    if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    categoryTotals[cat] += exp.amount || 0;
  });

  // Prepare data for PieChart
  const chartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    amount: categoryTotals[cat],
    color: categories[cat] || '#777',
    legendFontColor: '#fff',
    legendFontSize: 14,
  }));

  // Total expenses amount
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
