import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../../firebase/firebase';

const AddIncomeScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');

  const handleAddIncome = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    if (!name || !amount) {
      Alert.alert('Missing Info', 'Please provide at least a name and amount.');
      return;
    }

    const incomeAmount = parseFloat(amount);
    if (isNaN(incomeAmount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }

    try {
      const db = getFirestore();

      // Add income record
      const incomeRef = collection(db, 'users', user.uid, 'income');
      await addDoc(incomeRef, {
        name,
        amount: incomeAmount,
        notes,
        date,
        createdAt: serverTimestamp(),
      });

      // Get current user document
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let currentBalance = 0;
      if (userDocSnap.exists()) {
        currentBalance = userDocSnap.data().cashBalance || 0;
      }

      // Update cash balance
      await updateDoc(userDocRef, {
        cashBalance: currentBalance + incomeAmount,
      });

      router.replace('/tabs/home');
    } catch (error) {
      console.error('Error adding income:', error);
      Alert.alert('Error', 'Something went wrong while saving your income.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 20,
  },
  label: {
    color: 'white',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f0d9a2',
    borderRadius: 8,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#a5d6a7',
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#1b5e20',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddIncomeScreen;
