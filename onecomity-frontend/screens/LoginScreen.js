import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { loginUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
        setError('Please enter both email and password.');
        return;
    }

    try {
        const res = await loginUser({ email, password });

        // Save token in AsyncStorage
        await AsyncStorage.setItem('token', res.data.token);

        navigation.navigate('Activity');
    } catch (err) {
        const errorMessage =
        err?.response?.data?.msg || err?.message || 'Login failed. Please try again.';
        setError(errorMessage);
    }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Login" onPress={handleLogin} />
      <View style={styles.spacer} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
});
