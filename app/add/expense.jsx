import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
  { name: 'Medical', color: '#FF6F00' },
  { name: 'Housing', color: '#F500A2' },
  { name: 'Foods', color: '#03A9F4' },
  { name: 'Transportation', color: '#D50000' },
  { name: 'Entertainment', color: '#EC407A' },
  { name: 'Bills', color: '#FFEB3B' },
  { name: 'Others', color: '#795548' },
];

const AddExpenseScreen = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [notification, setNotification] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddExpense = () => {
    // You could add logic to save data here
    router.replace('/tabs/home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Add Expense</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryCircle,
              {
                backgroundColor: cat.color,
                borderWidth: selectedCategory === cat.name ? 3 : 0,
                borderColor: '#fff',
              },
            ]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Notes here..."
        value={notes}
        onChangeText={setNotes}
      />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Notification</Text>
          <TextInput
            style={styles.input}
            placeholder=" "
            value={notification}
            onChangeText={setNotification}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  label: {
    color: 'white',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0d9a2',
    borderRadius: 8,
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  categoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
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

export default AddExpenseScreen;
