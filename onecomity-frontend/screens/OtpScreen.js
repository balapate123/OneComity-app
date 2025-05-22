import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'; // Removed Button
import { sendOtp, verifyOtp } from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';

export default function OtpScreen({ navigation, route }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme); // Get styles dynamically

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const mobile = route.params?.mobile || '';

  const sendOtpHandler = async () => {
    setError('');
    try {
      await sendOtp(mobile);
      setOtpSent(true);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.msg || err?.message || 'Failed to send OTP.';
      setError(errorMessage);
    }
  };

  const verifyOtpHandler = async () => {
    setError('');
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    try {
      await verifyOtp(mobile, otp);
      navigation.navigate('Home');
    } catch (err) {
      const errorMessage =
        err?.response?.data?.msg || err?.message || 'Invalid or expired OTP.';
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.infoText}>Mobile Number:</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]} // Apply disabled styles
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        editable={false}
        value={mobile}
        placeholderTextColor={theme.secondaryText} 
      />

      {otpSent && (
        <>
          <Text style={styles.infoText}>Enter OTP:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            onChangeText={setOtp}
            value={otp}
            placeholderTextColor={theme.secondaryText}
            keyboardAppearance="dark"
            maxLength={6} // Assuming OTP is 6 digits
          />
        </>
      )}

      {!otpSent ? (
        <TouchableOpacity style={styles.button} onPress={sendOtpHandler}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={verifyOtpHandler}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      )}

      <View style={styles.spacer} />
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back to Login</Text>
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
  infoText: {
    fontSize: 16,
    color: theme.secondaryText,
    marginBottom: 5,
    marginLeft: 2, // Align with input field roughly
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
  disabledInput: {
    backgroundColor: theme.tertiaryBackground, // Darker for disabled state
    color: theme.secondaryText, // Lighter text for disabled
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
});
