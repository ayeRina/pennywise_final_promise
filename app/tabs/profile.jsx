import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleLogout = () => {
    // Add logout logic here (e.g., clear session)
    router.replace('/'); // Redirect to login screen
  };

  const handleDeleteUserData = () => {
    // Clear user data fields
    setUsername('');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Image
        source={{ uri: 'https://i.imgur.com/fHyEMsl.png' }} // Placeholder avatar
        style={styles.avatar}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#555"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteUserData}>
        <Text style={styles.deleteText}>DELETE USER DATA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0d9a2',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#a5d6a7',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#1b5e20',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#ffcccb',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
