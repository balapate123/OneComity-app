import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getChatList } from '../services/api';

export default function ChatListScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getChatList();
        setChats(res.data.chats || []);
      } catch (err) {
        console.log('❌ Failed to load chat list:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💬 Your Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate('ChatScreen', {
                userId: item._id,
                username: item.username,
                activity: item.activity,
                name: item.name
              })
            }
          >
            <Text style={styles.chatName}>{item.username}</Text>
            <Text style={styles.chatSub}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No chats yet. Start chatting!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  chatItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  chatName: { fontSize: 18, fontWeight: 'bold' },
  chatSub: { fontSize: 14, color: '#666' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
