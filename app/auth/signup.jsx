import React, { useState } from 'react';
import {
  View, TextInput, Button, Alert, StyleSheet, Text,
  TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebase/firebase';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Email, username, and password are required');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        username: username,
      });
      Alert.alert('Success', 'Account created!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <Image source={require('../../assets/image/penny.png')} style={styles.logo} />

        <Text style={styles.title}>Welcome to PennyWise</Text>
        <Text style={styles.subtitle}>Sign Up</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={setUsername}
          value={username}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="#666"
        />

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('/auth/login')}>
            Login?
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32', // dark green
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#81c784', // light green
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#ccc',
    marginTop: 20,
  },
  loginLink: {
    color: '#fff',
    fontWeight: 'bold',
  },
});