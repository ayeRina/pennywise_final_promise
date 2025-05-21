import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const Home = () => {
  const [cash, setCash] = useState(null);

  useEffect(() => {
    const fetchCash = async () => {
      if (!auth.currentUser) return;

      try {
        const balancesRef = collection(firestore, 'users', auth.currentUser.uid, 'balances');
        const q = query(balancesRef, orderBy('timestamp', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const latest = snapshot.docs[0].data();
          setCash(latest.cash);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchCash();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.cashText}>
        Balance: ₱{cash !== null ? cash.toFixed(2) : '...'}
      </Text>
      <Text style={styles.bodyText}>This is Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  cashText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 16,
  },
});
