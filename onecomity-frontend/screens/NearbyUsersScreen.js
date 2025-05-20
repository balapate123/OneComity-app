import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getNearbyUsers } from '../services/api';

export default function NearbyUsersScreen({ route, navigation }) {
  const { activity } = route.params;
  const [location, setLocation] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location is required to find nearby users.');
          return;
        }

        const locResult = await Location.getCurrentPositionAsync({});
        setLocation(locResult.coords);

        const res = await getNearbyUsers(activity, locResult.coords.latitude, locResult.coords.longitude);
        setUsers(res.data || []);
      } catch (err) {
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
    <View style={{ flex: 1 }}>
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
          return (
            <Marker
              key={idx}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => {
                setSelectedUser(user);
                console.log('📌 Pin tapped for user:', user.username, user._id);
              }}
            >
              <Image
                source={require('../assets/user-pin.png')}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            </Marker>
          );
        })}
      </MapView>
      {/* Persistent Chat Panel */}
      {selectedUser && (
        <View style={styles.chatPanel}>
          <Text style={styles.chatPanelTitle}>{selectedUser.username}</Text>
          <Text style={styles.chatPanelActivity}>Activity: {selectedUser.activity}</Text>
          <TouchableOpacity
            style={styles.chatPanelButton}
            onPress={() => {
              console.log('💬 Open Chat for user:', selectedUser.username, selectedUser._id);
              setSelectedUser(null);
              console.log(selectedUser.activity);
              navigation.navigate('ChatScreen', {
                userId: selectedUser._id,
                username: selectedUser.username,
                activity: selectedUser.activity,
              });
            }}
          >
            <Text style={styles.chatPanelButtonText}>💬 Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatPanelClose}
            onPress={() => setSelectedUser(null)}
          >
            <Text style={{ color: '#888', marginTop: 8 }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chatPanel: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 99,
  },
  chatPanelTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 6, color: '#344' },
  chatPanelActivity: { fontSize: 15, color: '#222', marginBottom: 10 },
  chatPanelButton: {
    marginTop: 6,
    backgroundColor: '#1e90ff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  chatPanelButtonText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
  chatPanelClose: { marginTop: 10 },
});

