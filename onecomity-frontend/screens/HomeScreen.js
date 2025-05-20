import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {username ? `Welcome, ${username}!` : 'Welcome!'}
      </Text>
      <Text style={styles.text}>🎉 Welcome to OneComity!</Text>
      <Text style={styles.subtext}>Let’s find you some good company 🌿🍷💧</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Activity')}
      >
        <Text style={styles.buttonText}>Find Buddies</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonAlt}
        onPress={() => navigation.navigate('Chats')}
      >
        <Text style={styles.buttonTextAlt}>All Chats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  welcome: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 25,
  },
  text: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtext: { fontSize: 18, color: '#555', marginBottom: 35 },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 12,
    width: 250,
    alignItems: 'center',
  },
  buttonAlt: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 12,
    width: 250,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextAlt: {
    color: '#1e90ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
