import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { updateActivity } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActivitySelectorScreen({ navigation }) {
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, marginBottom: 30, fontWeight: 'bold' },
  card: {
    width: '80%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
  },
  emoji: { fontSize: 36 },
  label: { fontSize: 18, marginTop: 10 },
});
