import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth } from '../../firebase/firebase';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const transRef = collection(db, 'users', user.uid, 'transactions');
      const snapshot = await getDocs(transRef);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); // newest first
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id, amount, type, linkedDocId) => {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the transaction
              await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));

              // Optionally delete linked income/expense document
              if (linkedDocId && type === 'income') {
                const incomeDocRef = doc(db, 'users', user.uid, 'income', linkedDocId);
                await deleteDoc(incomeDocRef);
              }

              // Adjust cash balance
              const userRef = doc(db, 'users', user.uid);
              const userSnap = await getDoc(userRef);
              const currentBalance = userSnap.data()?.cashBalance || 0;

              const newBalance =
                type === 'income' ? currentBalance - amount : currentBalance + amount;

              await updateDoc(userRef, { cashBalance: newBalance });

              // Remove from local state
              setTransactions(prev => prev.filter(item => item.id !== id));
            } catch (err) {
              console.error('Delete failed', err);
              Alert.alert('Error', 'Failed to delete transaction.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={{ fontWeight: 'bold', color: item.type === 'income' ? 'green' : 'red' }}>
        {item.name} - ${item.amount}
      </Text>
      <TouchableOpacity
        onPress={() => handleDelete(item.id, item.amount, item.type, item.linkedDocId)}
      >
        <Text style={{ color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: 'white' }}>No transactions yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2e7d32',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: '#f0d9a2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TransactionsList;
