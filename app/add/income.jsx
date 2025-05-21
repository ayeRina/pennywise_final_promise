import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // ✅ Import router

const AddIncomeScreen = () => {
  const router = useRouter(); // ✅ Initialize router

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');

  const handleAddIncome = () => {
    // You can add validation or saving logic here
    router.replace('/tabs/home'); // ✅ Replace current screen with Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryBox}>
        <Text style={styles.categoryText}>Income</Text>
      </View>

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
  categoryBox: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginTop: 5,
  },
  categoryText: {
    color: '#2e7d32',
    fontWeight: 'bold',
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
