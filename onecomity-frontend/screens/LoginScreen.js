import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { loginUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
import Constants from 'expo-constants'; // <--- Add this


export default function LoginScreen({ navigation }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme); // Get styles dynamically

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    await AsyncStorage.clear();
    if (!email || !password) {
        setError('Please enter both email and password.');
        return;
    }

    try {
        const res = await loginUser({ email, password });

        // Save token in AsyncStorage
        await AsyncStorage.setItem('token', res.data.token);
        console.log('Token after login:', res.data.token);

         // NEW: Save your userId!
        if (res.data.userId) {
        await AsyncStorage.setItem('myUserId', res.data.userId);
        }
        if (res.data.username) {
          await AsyncStorage.setItem('username', res.data.username);
        }
        if (res.data.name) {
            await AsyncStorage.setItem('name', res.data.name);
        }

        navigation.navigate('Home');
    } catch (err) {
        // Get the most detailed error message possible
        const errorMessage =
            err?.response?.data?.msg ||
            err?.response?.data?.error ||
            err?.message ||
            JSON.stringify(err) ||
            'Login failed. Please try again.';

        // Log it to the console for emulators/devices with logs
        console.log('LOGIN ERROR:', errorMessage, err);
        

        // Show alert box with the full error message
        alert('Login Error:\n' + err);
        console.log('API_URL in build:', Constants.expoConfig.extra.API_URL);

        setError(errorMessage); // Still update UI for normal cases
        }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        placeholderTextColor={theme.secondaryText}
        keyboardAppearance="dark" 
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholderTextColor={theme.secondaryText}
        keyboardAppearance="dark"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go to Register</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

// Styles are now a function that accepts theme
const getStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: theme.primaryBackground 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: theme.primaryText 
  },
  input: {
    borderWidth: 1,
    borderColor: theme.inputBorderColor,
    backgroundColor: theme.inputBackground,
    color: theme.inputTextColor,
    borderRadius: 6,
    padding: 12, // Increased padding slightly
    marginBottom: 15,
    fontSize: 16, // Added font size
  },
  button: {
    backgroundColor: theme.accentGreen,
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: theme.buttonDefaultText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: theme.tertiaryBackground,
    borderColor: theme.accentGreen,
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: theme.accentGreen,
  },
  spacer: { height: 10 }, // Kept for spacing between buttons
  error: { 
    marginTop: 20, 
    color: theme.accentRed, 
    fontSize: 16, 
    textAlign: 'center' 
  },
});
