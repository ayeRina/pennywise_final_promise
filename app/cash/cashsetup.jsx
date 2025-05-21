import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../firebase/firebase';

export default function CashSetupScreen() {
  const [value, setValue] = useState('');
  const router = useRouter();
  const db = getFirestore();

  const handlePress = (input) => {
    if (input === 'del') {
      setValue(value.slice(0, -1));
    } else {
      setValue((prev) => prev + input);
    }
  };

  const handleEnter = async () => {
    if (!value) {
      Alert.alert('Please enter a valid amount.');
      return;
    }
    
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Invalid amount. Please enter a positive number.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No user logged in.');
        return;
      }

      await setDoc(doc(db, 'users', user.uid, 'balances', 'currentBalance'), {
        amount,
        updatedAt: new Date(),
      });

      Alert.alert('Success', 'Balance saved!');
      router.replace('/tabs/home');
    } catch (error) {
      console.error('Firestore save error:', error);
      Alert.alert('Error', 'Failed to save balance.');
    }
  };

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/image/penny.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Set up your cash balance</Text>

      <View style={styles.displayContainer}>
        <Text style={styles.display}>{value || '0.00'}</Text>
        <TouchableOpacity style={[styles.key, styles.enterKey]} onPress={handleEnter}>
          <Text style={styles.keyText}>✔️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.keypad}>
        {buttons.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.key}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.keyText}>{item === 'del' ? '⌫' : item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#176A2F',
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  logo: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  display: {
    backgroundColor: 'white',
    color: '#176A2F',
    fontSize: 32,
    padding: 10,
    borderRadius: 10,
    width: 160,
    textAlign: 'center',
    marginRight: 10,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 250,
  },
  key: {
    backgroundColor: '#9CD98B',
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterKey: {
    backgroundColor: '#FFD700',
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
