import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getChatList } from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ChatListScreen({ navigation }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme); // Get styles dynamically

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
        <ActivityIndicator size="large" color={theme.accentGreen} />
        <Text style={styles.loadingText}>Loading chats...</Text>
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
                activity: item.activity, // Pass activity to ChatScreen
                name: item.name, // Pass name to ChatScreen if needed for title
              })
            }
          >
            <Text style={styles.chatName}>{item.username}</Text>
            <Text style={styles.chatSub}>Display Name: {item.name}</Text>
            {/* You could add last message preview here if available */}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>No chats yet. Start chatting!</Text>}
      />
    </View>
  );
}

// Styles are now a function that accepts theme
const getStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: theme.primaryBackground,
  },
  header: { 
    fontSize: 28, // Slightly larger header
    fontWeight: 'bold', 
    marginBottom: 25, // Increased margin
    color: theme.primaryText,
  },
  chatItem: {
    padding: 18, // Increased padding
    backgroundColor: theme.secondaryBackground, // Use theme secondary background
    borderRadius: 10, // Slightly more rounded
    marginBottom: 12, // Increased margin
    borderColor: theme.borderColor, // Add border
    borderWidth: 1,
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  chatName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: theme.primaryText 
  },
  chatSub: { 
    fontSize: 14, 
    color: theme.secondaryText, // Use theme secondary text
    marginTop: 4, // Added margin for spacing
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.primaryBackground, // Theme background for loader screen
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.secondaryText,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: theme.secondaryText,
  }
});
