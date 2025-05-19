import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { registerUser } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!email || !mobile || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await registerUser({ email, mobile, password });
      navigation.navigate('Otp', { mobile });
    } catch (err) {
      const errorMessage =
        err?.response?.data?.msg || err?.message || 'Registration failed.';
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

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
