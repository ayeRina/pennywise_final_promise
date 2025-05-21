import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Ionicons } from '@expo/vector-icons'; // For icons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    Alert.alert('Success', 'Logged in successfully');
    
    // ✅ Navigate to cash setup screen
    router.replace('/cash/cashsetup');
    
  } catch (error) {
    Alert.alert('Login Failed', error.message);
  }
};


  return (
    <View style={styles.container}>
     <Image
        source={require('../../assets/image/penny.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to PennyWise</Text>
      <Text style={styles.subtitle}>Log In</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => router.push('/auth/forgotpass')} style={styles.forgotLink}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <Text style={styles.registerText}>
        Not registered?{' '}
        <Text style={styles.createAccount} onPress={() => router.push('/auth/signup')}>
          Create an account?
        </Text>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32', // dark green
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 4,
    width: '50%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginVertical: 5,
  },
  forgotText: {
    color: '#ddd',
    fontSize: 12,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#81c784',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    color: '#ccc',
  },
  createAccount: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});