import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { sendOtp, verifyOtp } from '../services/api';

export default function OtpScreen({ navigation, route }) {
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
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        editable={false}
        value={mobile}
      />

      {otpSent && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="numeric"
          onChangeText={setOtp}
          value={otp}
        />
      )}

      {!otpSent ? (
        <Button title="Send OTP" onPress={sendOtpHandler} />
      ) : (
        <Button title="Verify OTP" onPress={verifyOtpHandler} />
      )}

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
