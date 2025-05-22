import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme); // Get styles dynamically

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
      <Text style={styles.text}>🎉 Welcome to १comity!</Text>
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

// Styles are now a function that accepts theme
const getStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.primaryBackground 
  },
  welcome: {
    fontSize: 22, // Slightly larger for welcome
    color: theme.primaryText,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 25,
  },
  text: { 
    fontSize: 28, // Slightly larger title
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: theme.primaryText 
  },
  subtext: { 
    fontSize: 18, 
    color: theme.secondaryText, // Use secondary text for less emphasis
    marginBottom: 40, // Increased spacing
    textAlign: 'center',
    paddingHorizontal: 20, // Added padding for better text flow
  },
  button: {
    backgroundColor: theme.accentGreen, // Use accent color for primary button
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 12,
    width: 280, // Slightly wider buttons
    alignItems: 'center',
    shadowColor: '#000', // Add shadow for depth in dark theme
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonAlt: {
    backgroundColor: theme.tertiaryBackground, // Use tertiary for alternative button
    borderWidth: 1,
    borderColor: theme.accentGreen, // Border with accent color
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 12,
    width: 280, // Slightly wider buttons
    alignItems: 'center',
  },
  buttonText: {
    color: theme.buttonDefaultText, // White or very light text for accentGreen background
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextAlt: {
    color: theme.accentGreen, // Accent color for text on tertiary background
    fontSize: 18,
    fontWeight: 'bold',
  },
});
