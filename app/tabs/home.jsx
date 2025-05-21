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
import { getFirestore, collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
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
        setCashBalance(userSnap.exists() ? userSnap.data().cashBalance || 0 : 0);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const unsubscribeExpenses = onSnapshot(expensesRef, async (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        const income = userSnap.exists() ? userSnap.data().cashBalance || 0 : 0;
        const totalExpenses = data.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const recalculatedBalance = income - totalExpenses;
        setCashBalance(recalculatedBalance);
        await updateDoc(userDocRef, { cashBalance: recalculatedBalance });
      } catch (err) {
        console.error('Error updating balance:', err);
      }

      setLoading(false);
    });

    fetchCashBalance();
    return () => unsubscribeExpenses();
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
    legendFontColor: '#000',
    legendFontSize: 14,
  }));

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>Home</Text>
        <View style={styles.cashCard}>
          <Text style={styles.cashLabel}>Total Cash:</Text>
          <Text style={styles.cashAmount}>₱ {cashBalance?.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.chartSection}>
  <Text style={styles.sectionTitle}>Budget Tracker</Text>

  {expenses.length > 0 ? (
    <View style={{ alignItems: 'center' }}>
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => `#000`,
          labelColor: () => '#000',
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="40" // better centering
        absolute
        hasLegend={false} // optional to explicitly disable legend
      />
    </View>
  ) : (
    <Text style={styles.noData}>No data yet.</Text>
  )}

  {/* Add Budget List title below chart */}
  <Text style={styles.sectionTitle}>Budget List</Text>
</View>

<View style={styles.budgetList}>
  {Object.keys(categoryTotals).map((cat, index) => (
    <View style={styles.budgetItem} key={index}>
      <View style={[styles.colorDot, { backgroundColor: categories[cat] || '#777' }]} />
      <Text style={styles.budgetText}>{cat}</Text>
      <Text style={styles.budgetAmount}>₱ {categoryTotals[cat].toLocaleString()}</Text>
    </View>
  ))}
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    backgroundColor: '#2e7d32',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  cashCard: {
    backgroundColor: '#FFC107',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  cashLabel: {
    fontSize: 16,
    color: '#000',
  },
  cashAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  chartSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  chartWrapper: {
  alignItems: 'center',
  justifyContent: 'center',
},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
  },
  budgetList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  budgetText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  budgetAmount: {
    fontWeight: 'bold',
    color: '#000',
  },
});
