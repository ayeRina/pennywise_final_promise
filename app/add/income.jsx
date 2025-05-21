import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebase/firebase'; // 🔁 Adjust path as needed
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';

const AddIncomeScreen = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');

  const handleAddIncome = async () => {
    if (!name || !amount || !date) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    const incomeAmount = parseFloat(amount);

    try {
      // ✅ Add to transactions collection
      await addDoc(collection(db, 'transactions'), {
        name,
        amount: incomeAmount,
        notes,
        date,
        type: 'income',
        createdAt: new Date(),
      });

      // ✅ Update cash balance
      const balanceRef = doc(db, 'meta', 'balance');
      const balanceSnap = await getDoc(balanceRef);
      let currentBalance = 0;

      if (balanceSnap.exists()) {
        currentBalance = balanceSnap.data().cash || 0;
      }

      await updateDoc(balanceRef, {
        cash: currentBalance + incomeAmount,
      });

      Alert.alert('Success', 'Income added successfully!');
      router.replace('/tabs/home');

    } catch (error) {
      console.error('Error adding income:', error);
      Alert.alert('Error', 'Something went wrong while adding income.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />

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
