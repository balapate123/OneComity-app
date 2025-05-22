import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'; // Removed Button
import * as Location from 'expo-location';
import { updateActivity } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ActivitySelectorScreen({ navigation }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme); // Get styles dynamically

  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is required to find nearby users.');
        return;
      }
      setLocationGranted(true);
    })();
  }, []);

  const handleSelect = async (activity) => {
    console.log('⚡ Selected activity:', activity);
    console.log('Hii');
    console.log('locationGranted:', locationGranted);
    if (!locationGranted) {
        Alert.alert('No location access', 'We need your location to continue.');
        return;
    }

    try {
        const token = await AsyncStorage.getItem('token');
        console.log('Current token:', token);
        console.log('Changng Activity from FrontEnd');
        
        const response = await updateActivity(activity);
        console.log('Update activity response:', response.data);

        navigation.navigate('NearbyScreen', { activity });
    } catch (e) {
        Alert.alert('Error', 'Could not update activity.');
        return;
    }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you up to?</Text>

      <TouchableOpacity style={styles.card} onPress={() => handleSelect('weed')}>
        <Text style={styles.emoji}>🌿</Text>
        <Text style={styles.label}>Smoking Weed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => handleSelect('wine')}>
        <Text style={styles.emoji}>🍷</Text>
        <Text style={styles.label}>Sipping Wine</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => handleSelect('water')}>
        <Text style={styles.emoji}>💧</Text>
        <Text style={styles.label}>Sharing Water</Text>
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
    backgroundColor: theme.primaryBackground, 
    padding: 20 
  },
  title: { 
    fontSize: 28, // Slightly larger title
    marginBottom: 40, // Increased spacing
    fontWeight: 'bold', 
    color: theme.primaryText,
    textAlign: 'center',
  },
  card: {
    width: '85%', // Slightly wider cards
    paddingVertical: 25, // Increased vertical padding
    paddingHorizontal: 20,
    marginVertical: 12, // Increased margin
    backgroundColor: theme.secondaryBackground, // Use secondary background for cards
    borderRadius: 12, // Slightly more rounded corners
    alignItems: 'center',
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: theme.borderColor, // Add subtle border
    borderWidth: 1,
  },
  emoji: { 
    fontSize: 40, // Larger emoji
    marginBottom: 5, // Added margin below emoji
  },
  label: { 
    fontSize: 20, // Larger label
    marginTop: 10, 
    color: theme.primaryText, // Use primary text for labels
    fontWeight: '500', // Medium weight for labels
  },
});
