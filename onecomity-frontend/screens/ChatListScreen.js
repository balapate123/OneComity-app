import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getChatList, hardDeleteChat } from '../services/api'; // Added hideChat
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

  const confirmDeleteChat = async (chatItemToDelete) => {
    try {
        const partnerId = chatItemToDelete._id;
        await hardDeleteChat(partnerId); // <--- Use the new hard delete!
        setChats(prevChats =>
        prevChats.filter(chat => chat._id !== chatItemToDelete._id)
        );
        console.log(`Chat with ${chatItemToDelete.username} deleted.`);

    } catch (error) {
      console.error('Failed to delete chat:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.msg || 'Failed to hide chat. Please try again later.'
      );
    }
  };

  const handleDeletePress = (chatItem) => {
    Alert.alert(
      "Delete Chat?",
      `Are you sure you want to delete this chat with ${chatItem.username}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => console.log('Delete cancelled') },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDeleteChat(chatItem) }
      ]
    );
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
        style={styles.chatItem}
        activeOpacity={1}
        onPress={() =>
        navigation.navigate('ChatScreen', {
            userId: item._id,
            username: item.username,
            activity: item.activity,
            name: item.name,
        })
        }
    >
        <Text style={styles.chatName}>{item.username}</Text>
        <Text style={styles.chatSub}>Display Name: {item.name}</Text>
        {/* Show the last message, truncated to one line */}
        <Text
        style={styles.lastMsg}
        numberOfLines={1}
        ellipsizeMode="tail"
        >
        {item.lastMessage || "No messages yet."}
        </Text>
    </TouchableOpacity>
  );

  const renderDeleteButtonView = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePress(data.item)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

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
      <SwipeListView
        data={chats}
        renderItem={renderChatItem}
        renderHiddenItem={renderDeleteButtonView}
        keyExtractor={(item) => item._id}
        rightOpenValue={-85} // Width of the delete button + some margin
        previewRowKey={chats[0]?._id.toString()} // Optional: preview swipe on first item
        previewOpenValue={-70}
        previewOpenDelay={1000}
        disableRightSwipe={true}
        ListEmptyComponent={<Text style={styles.emptyListText}>No chats yet. Start chatting!</Text>}
        contentContainerStyle={chats.length === 0 ? styles.emptyListContainer : {}}
        closeOnRowPress={true}
        closeOnScroll={true}
        closeOnRowBeginSwipe={true}
      />
    </View>
  );
}

// Styles are now a function that accepts theme
const getStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20, // Use horizontal padding to allow full-width swipe items
    paddingTop: 20,
    backgroundColor: theme.primaryBackground,
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 25, 
    color: theme.primaryText,
    paddingHorizontal: 0, // Ensure header doesn't get extra padding if container has it
  },
  chatItem: { // This is the visible row
    padding: 18, 
    backgroundColor: theme.secondaryBackground, 
    borderRadius: 10, 
    marginBottom: 12, 
    borderColor: theme.borderColor, 
    borderWidth: 1,
    // Keep shadows if desired, but ensure they don't interfere with swipe
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    // Important: Ensure the visible item has a solid background
    // so the hidden item doesn't peek through during swipe.
  },
  chatName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: theme.primaryText 
  },
  chatSub: { 
    fontSize: 14, 
    color: theme.secondaryText, 
    marginTop: 4, 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.primaryBackground, 
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
  },
  emptyListContainer: { // Added to help center the empty list text
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Styles for the hidden delete button
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.primaryBackground, // Or a slightly different shade if preferred
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 0, // No padding on the right of the hidden view itself
    marginBottom: 12, // Match chatItem's marginBottom
    borderRadius: 10, // Match chatItem's borderRadius
  },
  deleteButton: {
    backgroundColor: theme.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
    width: 85, // Width of the delete button
    height: '100%', // Make the button fill the height of the row
    // borderRadius: 10, // Can apply borderRadius here too if rowBack doesn't have one
  },
  deleteButtonText: {
    color: theme.buttonDefaultText, // Usually white or light gray
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMsg: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

});
