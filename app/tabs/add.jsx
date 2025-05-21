import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ✅ Import router

export default function App() {
  const router = useRouter(); // ✅ Get router instance

  return (
    <LinearGradient
      colors={['#2e7d32', '#388e3c']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/add/income')} // ✅ Navigate to add/income 
      >
        <Text style={styles.buttonText}>Income</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/add/expense')} // ✅ Navigate to add/income 
     >
        <Text style={styles.buttonText}>Expense</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#a5d6a7',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
});