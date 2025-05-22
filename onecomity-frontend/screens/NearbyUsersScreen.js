import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getNearbyUsers } from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';
import { darkMapStyle } from '../constants/mapStyles'; // Will create this file

export default function NearbyUsersScreen({ route, navigation }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme); // Get styles dynamically

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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.accentGreen} />
        <Text style={styles.loaderText}>Loading nearby users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE} // Important for custom styles on Android
        customMapStyle={darkMapStyle} // Apply dark map style
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
          pinColor={theme.accentGreen} // Use theme accent for user's pin
        />

        {/* Nearby Users */}
        {/* Note: The user-pin.png is light-colored, it should be visible on a dark map. 
            If not, it would need to be replaced with a dark-theme-friendly asset. */}
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
            <Text style={styles.chatPanelCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Styles are now a function that accepts theme
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryBackground, // Ensure container has theme background
  },
  map: { 
    flex: 1 
  },
  loaderContainer: { // Renamed from loader to be more specific
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.primaryBackground 
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.secondaryText,
  },
  chatPanel: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: theme.secondaryBackground, // Use theme secondary background
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000', // Shadow might be less visible but good for depth
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 99,
    borderColor: theme.borderColor, // Add border for definition
    borderWidth: 1,
  },
  chatPanelTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 6, 
    color: theme.primaryText 
  },
  chatPanelActivity: { 
    fontSize: 15, 
    color: theme.secondaryText, // Use secondary text
    marginBottom: 12, // Increased margin
  },
  chatPanelButton: {
    marginTop: 6,
    backgroundColor: theme.accentGreen, // Use theme accent for button
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  chatPanelButtonText: { 
    color: theme.buttonDefaultText, // Use theme button text color
    fontWeight: 'bold', 
    fontSize: 17 
  },
  chatPanelClose: { 
    marginTop: 10 
  },
  chatPanelCloseText: {
    color: theme.secondaryText, // Use secondary text for close
    marginTop: 8,
    fontSize: 14,
  }
});

