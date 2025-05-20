import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatScreen({ route }) {
  const { userId, name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {name}</Text>
      <Text style={styles.text}>💬 Chat feature coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#666' },
});
