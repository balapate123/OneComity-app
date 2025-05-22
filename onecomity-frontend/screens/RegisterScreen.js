import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native'; // Removed Button
import { registerUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';


export default function RegisterScreen({ navigation }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme); // Get styles dynamically

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showUsername, setShowUsername] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState('');

  const handleRegister = async () => {
    await AsyncStorage.clear();
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
      <TextInput 
        style={styles.input} 
        placeholder="Name" 
        onChangeText={setName} 
        value={name} 
        placeholderTextColor={theme.secondaryText}
        keyboardAppearance="dark"
      />
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
        placeholder="Mobile"
        keyboardType="phone-pad"
        onChangeText={setMobile}
        value={mobile}
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back to Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Modal to show generated username */}
      <Modal visible={showUsername} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Welcome, {name}!</Text>
            <Text style={styles.modalText}>
              Your unique username is:
            </Text>
            <Text style={styles.usernameText}>{generatedUsername}</Text>
            <Text style={styles.modalSubText}>
              You can use this name in chats, and no one will see your email!
            </Text>
            <TouchableOpacity style={styles.continueBtn} onPress={handleContinueToOtp}>
              <Text style={styles.continueBtnText}>Continue to OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
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
  spacer: { height: 10 },
  error: { 
    marginTop: 20, 
    color: theme.accentRed, 
    fontSize: 16, 
    textAlign: 'center' 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay for better contrast with dark theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: theme.secondaryBackground, // Use a theme background for the modal
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    width: 320, // Slightly wider
    shadowColor: '#000', // Shadow might be less visible in dark theme but keep for depth
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10, // Higher elevation for dark theme
    borderColor: theme.borderColor,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.primaryText,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: theme.primaryText,
    textAlign: 'center',
  },
  usernameText: { // Renamed from 'username' to avoid conflict if any top-level style named 'username'
    fontSize: 21,
    fontWeight: 'bold',
    color: theme.accentGreen, // Use accent color for username
    letterSpacing: 1.2,
    marginBottom: 15,
  },
  modalSubText: {
    color: theme.secondaryText,
    marginVertical: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  continueBtn: {
    marginTop: 20,
    backgroundColor: theme.accentGreen, // Consistent button styling
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  continueBtnText: {
    color: theme.buttonDefaultText, // Consistent button text styling
    fontWeight: 'bold',
    fontSize: 16,
  },
});

