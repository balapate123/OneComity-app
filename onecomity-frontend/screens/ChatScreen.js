import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import api, { getChatMessages } from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';

const SOCKET_URL = 'http://192.168.2.34:5000'; // Your backend Socket.IO URL

// Helper for bubble color - NOW THEME AWARE
const getBubbleColor = (messageText, activity, globalTheme, isMine) => {
  const lowerCaseText = messageText ? messageText.toLowerCase() : '';
  if (lowerCaseText.includes('weed')) return '#005C28'; // Darker Green
  if (lowerCaseText.includes('wine')) return '#6D0D0D'; // Darker Red

  // Fallback to activity prop if no keyword found - for OTHER user's bubbles
  if (!isMine) {
    if (activity === 'weed') return '#005C28';
    if (activity === 'wine') return '#6D0D0D';
    if (activity === 'water') return '#004080'; // Darker Blue for water
    return globalTheme.secondaryBackground; // Default for other user
  }
  
  // Default for "my" messages or unknown activity
  return globalTheme.tertiaryBackground; // Default for user's own message
};

export default function ChatScreen({ route }) {
  const globalTheme = useContext(ThemeContext);
  
  const { userId, username, activity } = route.params; // activity comes from navigation
  const [myId, setMyId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  // Initial state values should now use globalTheme for defaults
  const [chatBackgroundColor, setChatBackgroundColor] = useState(globalTheme.primaryBackground);
  const [inputConfig, setInputConfig] = useState({
    rowBgColor: globalTheme.secondaryBackground,
    inputBorderColor: globalTheme.borderColor,
    rowBorderTopColor: globalTheme.borderColor,
  });

  // Helper to get CHAT SCREEN background color based on activity - NOW THEME AWARE
  const getActivityColor = (detectedActivity, theme) => {
    if (detectedActivity === 'weed') return '#102510'; // Dark green tint for screen background
    if (detectedActivity === 'wine') return '#251010'; // Dark red tint for screen background
    return theme.primaryBackground; // default to global theme primary
  };

  // Helper to get colors for INPUT AREA - NOW THEME AWARE
  const getInputColors = (detectedActivity, theme) => {
    if (detectedActivity === 'weed') {
      return {
        rowBgColor: '#1A3A1A', // Darker green for input row
        inputBorderColor: theme.accentGreen, 
        rowBorderTopColor: theme.borderColor,
      };
    }
    if (detectedActivity === 'wine') {
      return {
        rowBgColor: '#3A1A1A', // Darker red for input row
        inputBorderColor: theme.accentRed,
        rowBorderTopColor: theme.borderColor,
      };
    }
    return { // Default input colors from global theme
      rowBgColor: theme.secondaryBackground,
      inputBorderColor: theme.borderColor,
      rowBorderTopColor: theme.borderColor,
    };
  };

  const styles = getStyles(globalTheme); // Get styles dynamically based on global theme

  // Helper to detect activity from message text (remains the same)
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
        console.log('💬 Chat history loaded:', loadedMessages.length ?? 0);

        let activityDetectedInHistory = false;
        for (let i = loadedMessages.length - 1; i >= 0; i--) {
          const detected = detectActivityFromMessage(loadedMessages[i].text);
          if (detected) {
            setChatBackgroundColor(getActivityColor(detected, globalTheme));
            setInputConfig(getInputColors(detected, globalTheme));
            activityDetectedInHistory = true;
            break;
          }
        }
        if (!activityDetectedInHistory) {
          setChatBackgroundColor(getActivityColor(null, globalTheme));
          setInputConfig(getInputColors(null, globalTheme));
        }
      } catch (err) {
        console.log('❌ Failed to load chat history', err);
        // Keep default theme colors if history fails
        setChatBackgroundColor(globalTheme.primaryBackground);
        setInputConfig(getInputColors(null, globalTheme));
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
        const detected = detectActivityFromMessage(msg.text);
        if (detected) { 
          setChatBackgroundColor(getActivityColor(detected, globalTheme));
          setInputConfig(getInputColors(detected, globalTheme));
        }
        // If the new message does NOT contain a keyword, we don't revert the theme.
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
    // Pass globalTheme and isMine to getBubbleColor
    const bubbleColor = getBubbleColor(item.text, activity, globalTheme, isMine); 

    return (
      <View style={[
        styles.messageBubble, // Base bubble style from getStyles
        isMine ? styles.myMessage : styles.otherMessage, // Alignment
        { backgroundColor: bubbleColor } // Dynamic background color
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
        contentContainerStyle={styles.flatListContent}
      />
      <View style={[
        styles.inputRow, // Base inputRow style from getStyles
        { 
          backgroundColor: inputConfig.rowBgColor, // Dynamic background
          borderTopColor: inputConfig.rowBorderTopColor, // Dynamic border
        }
      ]}>
        <TextInput
          style={[
            styles.input, // Base input style from getStyles
            { borderColor: inputConfig.inputBorderColor } // Dynamic border
          ]}
          placeholder="Type a message..."
          placeholderTextColor={globalTheme.secondaryText} // Use theme placeholder color
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          keyboardAppearance="dark" // Dark keyboard
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!text.trim()}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles are now a function that accepts the globalTheme
const getStyles = (theme) => StyleSheet.create({
  container: { // This style is used by KeyboardAvoidingView, but its background is dynamic
    flex: 1,
  },
  flatListContent: {
    padding: 16, 
    paddingBottom: 90, // Ensure paddingBottom is enough for inputRow
  },
  messageBubble: {
    marginVertical: 5, // Slightly more margin
    paddingHorizontal: 12, // More horizontal padding
    paddingVertical: 8, // More vertical padding
    borderRadius: 12, // More rounded
    maxWidth: '80%',
    shadowColor: '#000', // Shadow for bubbles
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  myMessage: { 
    alignSelf: 'flex-end',
    // backgroundColor is now set dynamically in renderItem
  },
  otherMessage: { 
    alignSelf: 'flex-start',
    // backgroundColor is now set dynamically in renderItem
  },
  msgText: { 
    fontSize: 16, 
    color: theme.primaryText, // Light text for dark bubbles
  },
  msgMeta: { 
    fontSize: 11, 
    color: theme.secondaryText, // Lighter gray for meta text
    marginTop: 4, 
    textAlign: 'right', // Align meta text to the right for my messages
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    // backgroundColor and borderTopColor are now dynamic via inputConfig state
    position: 'absolute', 
    bottom: 0, left: 0, right: 0,
  },
  input: { 
    flex: 1, 
    paddingVertical: 10, // Adjusted padding
    paddingHorizontal: 15,
    borderWidth: 1, 
    borderRadius: 20, 
    marginRight: 10,
    fontSize: 16,
    backgroundColor: theme.inputBackground, // Use theme input background
    color: theme.inputTextColor, // Use theme input text color
    // borderColor is now dynamic via inputConfig state
  },
  sendBtn: { 
    backgroundColor: theme.accentGreen, // Use theme accent for send button
    paddingHorizontal: 20, // Adjusted padding
    paddingVertical: 10, 
    borderRadius: 20, // Match input field's borderRadius
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: { 
    color: theme.buttonDefaultText, // Use theme button text color
    fontWeight: 'bold', 
    fontSize: 16 
  },
});