import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

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

  const handleSelect = (activity) => {
    console.log('⚡ Selected activity:', activity);
    if (!locationGranted) {
      Alert.alert('No location access', 'We need your location to continue.');
      return;
    }

    navigation.navigate('NearbyScreen', { activity }); // Will build Nearby screen next
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
