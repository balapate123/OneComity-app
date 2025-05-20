import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import api, { getChatMessages } from '../services/api';

const SOCKET_URL = 'http://192.168.2.34:5000'; // Your backend Socket.IO URL

// Helper for bubble color by activity
const getBubbleColor = (activity) => {
  if (activity === 'weed') return '#b1e5c6';
  if (activity === 'wine') return '#ffb3b3';
  if (activity === 'water') return '#b3d1ff';
  return '#daf1ff'; // fallback (for 'my' messages or unknown)
};

export default function ChatScreen({ route }) {
  const { userId, username, activity } = route.params; // activity comes from navigation
  const [myId, setMyId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  // 1. Get my own userId from storage (must be set at login)
  useEffect(() => {
    (async () => {
      const myUserId = await AsyncStorage.getItem('myUserId');
      setMyId(myUserId);
      // Log for debugging
      console.log('🟢 My userId:', myUserId, 'Chatting with:', userId);
    })();
  }, [userId]);

  // 2. Load chat history from REST
  useEffect(() => {
    (async () => {
      try {
        if (!userId) return;
        const res = await getChatMessages(userId);
        setMessages(res.data.messages || []);
        // Log for debugging
        console.log('💬 Chat history loaded:', res.data.messages?.length ?? 0);
      } catch (err) {
        console.log('❌ Failed to load chat history', err);
      }
    })();
  }, [userId]);

  // 3. Connect to Socket.IO and join my room
  useEffect(() => {
    if (!myId) return;
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('join', myId);
    console.log('⚡ Joined room:', myId);

    // Listen for real-time messages
    socketRef.current.on('newMessage', (msg) => {
      // Show only if relevant to this chat
      if (
        (msg.sender === myId && msg.receiver === userId) ||
        (msg.sender === userId && msg.receiver === myId)
      ) {
        setMessages((prev) => [...prev, msg]);
        console.log('💬 New real-time message:', msg.text);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [myId, userId]);

  // 4. Send message
  const handleSend = () => {
    if (text.trim() === '' || !myId || !userId) {
      console.log('⛔️ Missing info to send:', { myId, userId, text });
      return;
    }
    socketRef.current.emit('sendMessage', {
      sender: myId,
      receiver: userId,
      text,
      activity // pass the activity for color
    });
    setText('');
    console.log('🚀 Sent message:', text);
  };

  // 5. Render messages (oldest at top, newest at bottom)
  const renderItem = ({ item }) => {
    const isMine = item.sender === myId;
    return (
      <View style={[
        styles.messageBubble,
        isMine ? styles.myMessage : styles.otherMessage,
        !isMine && { backgroundColor: getBubbleColor(activity) } // Only for other user's messages
      ]}>
        <Text style={styles.msgText}>{item.text}</Text>
        <Text style={styles.msgMeta}>
          {isMine ? 'You' : username} · {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <FlatList
        data={messages} // natural order: oldest to newest
        renderItem={renderItem}
        keyExtractor={(item, idx) => item._id || String(idx)}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!text.trim()}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageBubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: { backgroundColor: '#daf1ff', alignSelf: 'flex-end' },
  otherMessage: { alignSelf: 'flex-start' },
  msgText: { fontSize: 16 },
  msgMeta: { fontSize: 11, color: '#888', marginTop: 3 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
  },
  input: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, marginRight: 10 },
  sendBtn: { backgroundColor: '#1e90ff', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 18 },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
