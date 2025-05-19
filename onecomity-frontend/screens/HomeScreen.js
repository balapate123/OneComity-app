import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 Welcome to OneComity!</Text>
      <Text style={styles.subtext}>Let’s find you some good company 🌿🍷💧</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtext: { fontSize: 18, color: '#555' },
});
