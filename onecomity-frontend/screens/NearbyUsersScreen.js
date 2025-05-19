import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getNearbyUsers } from '../services/api';

export default function NearbyUsersScreen({ route }) {
  const { activity } = route.params;
  const [location, setLocation] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location is required to find nearby users.');
          return;
        }

        const locResult = await Location.getCurrentPositionAsync({});
        console.log('📍 Captain’s location:', locResult.coords);
        setLocation(locResult.coords); // must only set coords, not entire object

        const res = await getNearbyUsers(activity, locResult.coords.latitude, locResult.coords.longitude);
        console.log('📤 Calling Nearby API with:', {
          activity,
          lat: locResult.coords.latitude,
          lng: locResult.coords.longitude,
        });
        console.log('✅ Nearby Users:', res.data);

        setUsers(res.data || []);
      } catch (err) {
        console.error('❌ Nearby API error:', err);
        Alert.alert('Error', 'Could not fetch nearby users.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading nearby users...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {/* You */}
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title="You"
        pinColor="green"
      />

      {/* Nearby Users */}
      {users.map((user, idx) => {
        if (!user.location || !user.location.coordinates) return null;

        const [lng, lat] = user.location.coordinates;
        console.log(`📍 Marker for ${user.email}:`, { lat, lng });

        return (
          <Marker
            key={idx}
            coordinate={{ latitude: lat, longitude: lng }}
            title={user.email}
            description={`Activity: ${user.activity}`}
          >
            <Image
              source={require('../assets/user-pin.png')}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              onError={() => console.warn(`🖼️ Failed to load pin for ${user.email}`)}
            />
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
