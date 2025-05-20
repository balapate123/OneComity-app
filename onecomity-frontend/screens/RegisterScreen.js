import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { registerUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showUsername, setShowUsername] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!email || !mobile || !password || !name) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Call backend registration
      const res = await registerUser({ email, mobile, password, name });
      // Show the username modal before OTP
      setGeneratedUsername(res.data.username);
      setShowUsername(true);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.msg || err?.message || 'Registration failed.';
      setError(errorMessage);
    }
  };

  // When user closes username modal, move to OTP
  const handleContinueToOtp = async () => {
    setShowUsername(false);
    // Save to AsyncStorage
    try {
        await AsyncStorage.setItem('username', generatedUsername);
        await AsyncStorage.setItem('name', name); // save display name as well if needed
    } catch (e) {
        console.warn("Could not save username to storage", e);
    }
    navigation.navigate('Otp', { mobile, username: generatedUsername });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Name" onChangeText={setName} value={name} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        keyboardType="phone-pad"
        onChangeText={setMobile}
        value={mobile}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Register" onPress={handleRegister} />
      <View style={styles.spacer} />
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Modal to show generated username */}
      <Modal visible={showUsername} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Welcome, {name}!</Text>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              Your unique username is:
            </Text>
            <Text style={styles.username}>{generatedUsername}</Text>
            <Text style={{ color: '#666', marginVertical: 8 }}>
              You can use this name in chats, and no one will see your email!
            </Text>
            <TouchableOpacity style={styles.continueBtn} onPress={handleContinueToOtp}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Continue to OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  spacer: { height: 10 },
  error: { marginTop: 20, color: 'red', fontSize: 16, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    width: 310,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 7,
  },
  username: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#2b5fff',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  continueBtn: {
    marginTop: 14,
    backgroundColor: '#2b5fff',
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
});

