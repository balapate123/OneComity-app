import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import api, { getChatMessages } from '../services/api';

const SOCKET_URL = 'http://192.168.2.34:5000'; // Your backend Socket.IO URL

// Helper for bubble color by activity
const getBubbleColor = (messageText, activity) => {
  const lowerCaseText = messageText ? messageText.toLowerCase() : '';
  if (lowerCaseText.includes('weed')) return '#b1e5c6'; // green
  if (lowerCaseText.includes('wine')) return '#ffb3b3'; // red
  // Fallback to activity prop if no keyword found
  if (activity === 'weed') return '#b1e5c6';
  if (activity === 'wine') return '#ffb3b3';
  if (activity === 'water') return '#b3d1ff';
  return '#daf1ff'; // fallback (for 'my' messages or unknown activity)
};

export default function ChatScreen({ route }) {
  const { userId, username, activity } = route.params; // activity comes from navigation
  const [myId, setMyId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const [chatBackgroundColor, setChatBackgroundColor] = useState('#ffffff'); // Default background
  const [inputConfig, setInputConfig] = useState({
    rowBgColor: '#ffffff',
    inputBorderColor: '#ccc',
    rowBorderTopColor: '#eee',
  });

  // Helper to get theme color based on activity
  const getActivityColor = (detectedActivity) => {
    if (detectedActivity === 'weed') return '#e6ffe6'; // light green background
    if (detectedActivity === 'wine') return '#ffe6e6'; // light red background
    return '#ffffff'; // default white background
  };

  // Helper to get colors for input area
  const getInputColors = (detectedActivity) => {
    if (detectedActivity === 'weed') {
      return {
        rowBgColor: '#e6ffe6', // light green
        inputBorderColor: '#77dd77', // medium green
        rowBorderTopColor: '#c1e5c1', // slightly darker green
      };
    }
    if (detectedActivity === 'wine') {
      return {
        rowBgColor: '#ffe6e6', // light red
        inputBorderColor: '#ff8a80', // medium red
        rowBorderTopColor: '#e5c1c1', // slightly darker red
      };
    }
    return {
      rowBgColor: '#ffffff', // default white
      inputBorderColor: '#ccc', // default gray
      rowBorderTopColor: '#eee', // default light gray
    };
  };

  // Helper to detect activity from message text
  const detectActivityFromMessage = (messageText) => {
    const lowerCaseText = messageText ? messageText.toLowerCase() : '';
    if (lowerCaseText.includes('weed')) return 'weed';
    if (lowerCaseText.includes('wine')) return 'wine';
    return null;
  };

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
        const loadedMessages = res.data.messages || [];
        setMessages(loadedMessages);
        // Log for debugging
        console.log('💬 Chat history loaded:', loadedMessages.length ?? 0);

        // Set initial background and input colors based on chat history
        let activityDetected = false;
        for (let i = loadedMessages.length - 1; i >= 0; i--) {
          const detectedActivity = detectActivityFromMessage(loadedMessages[i].text);
          if (detectedActivity) {
            const newChatBgColor = getActivityColor(detectedActivity);
            setChatBackgroundColor(newChatBgColor);
            setInputConfig(getInputColors(detectedActivity));
            activityDetected = true;
            break;
          }
        }
        if (!activityDetected) {
          // Reset to default if no keywords in history
          setChatBackgroundColor(getActivityColor(null));
          setInputConfig(getInputColors(null));
        }
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
        // Update background and input colors based on new message
        const detectedActivity = detectActivityFromMessage(msg.text);
        if (detectedActivity) { // This ensures it only updates if keywords are present
          const newChatBgColor = getActivityColor(detectedActivity);
          setChatBackgroundColor(newChatBgColor);
          setInputConfig(getInputColors(detectedActivity));
        }
        // If the new message does NOT contain a keyword, we don't revert the color.
        // The color should persist from the last keyword message.
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
    const bubbleColor = getBubbleColor(item.text, activity); // Get color based on text and activity

    return (
      <View style={[
        styles.messageBubble,
        isMine ? styles.myMessage : styles.otherMessage,
        { backgroundColor: bubbleColor } // Apply color to all bubbles
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
      style={[styles.container, { backgroundColor: chatBackgroundColor }]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <FlatList
        data={messages} // natural order: oldest to newest
        renderItem={renderItem}
        keyExtractor={(item, idx) => item._id || String(idx)}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }} // Ensure paddingBottom is enough for inputRow
      />
      <View style={[
        styles.inputRow,
        { 
          backgroundColor: inputConfig.rowBgColor,
          borderTopColor: inputConfig.rowBorderTopColor,
        }
      ]}>
        <TextInput
          style={[
            styles.input,
            { borderColor: inputConfig.inputBorderColor, backgroundColor: '#ffffff' } // Explicit white background
          ]}
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
  container: { flex: 1 }, // backgroundColor will be dynamic
  messageBubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: { alignSelf: 'flex-end' }, // backgroundColor will be set by getBubbleColor
  otherMessage: { alignSelf: 'flex-start' }, // backgroundColor will be set by getBubbleColor
  msgText: { fontSize: 16 },
  msgMeta: { fontSize: 11, color: '#888', marginTop: 3 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    // borderColor is now dynamic (inputConfig.rowBorderTopColor)
    // backgroundColor is now dynamic (inputConfig.rowBgColor)
    position: 'absolute', // Keep it at the bottom
    bottom: 0, left: 0, right: 0,
  },
  input: { 
    flex: 1, 
    padding: 12, 
    borderWidth: 1, 
    // borderColor is now dynamic (inputConfig.inputBorderColor)
    borderRadius: 20, 
    marginRight: 10,
    // backgroundColor is now dynamic (explicitly #ffffff in JSX)
  },
  sendBtn: { backgroundColor: '#1e90ff', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 18 },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});