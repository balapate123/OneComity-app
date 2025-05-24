import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { ThemeProvider } from './contexts/ThemeProvider';
import { darkThemeColors } from './contexts/ThemeContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OtpScreen from './screens/OtpScreen';
import HomeScreen from './screens/HomeScreen';
import ActivitySelectorScreen from './screens/ActivitySelectorScreen';
import NearbyUsersScreen from './screens/NearbyUsersScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';


const Stack = createNativeStackNavigator();

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={darkThemeColors.statusBarColor} 
      />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: darkThemeColors.headerBackground,
            },
            headerTintColor: darkThemeColors.headerTintColor,
            headerTitleStyle: {
              fontWeight: 'bold', // Optional: if you want bold titles
            },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Activity" component={ActivitySelectorScreen} />
        <Stack.Screen 
          name="NearbyScreen" 
          component={NearbyUsersScreen}
          options={({ route }) => ({ 
            title: route.params?.activity 
              ? `Nearby ${capitalizeFirstLetter(route.params.activity)} Users` 
              : 'Nearby Users' 
          })}
        />
        <Stack.Screen name="Chats" component={ChatListScreen} />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({ route }) => ({
            title: route.params?.username || 'Chat',
            // Potentially override header styles per screen if needed
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}
