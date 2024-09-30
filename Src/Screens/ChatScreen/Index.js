import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';

// Sample chat data
const sampleMessages = [
  { id: '1', text: 'Hello!', sender: 'user1' },
  { id: '2', text: 'Hi there!', sender: 'user2' },
  { id: '3', text: 'How are you?', sender: 'user1' },
  { id: '4', text: 'I am good, thanks!', sender: 'user2' },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: (messages.length + 1).toString(),
        text: newMessage,
        sender: 'user1', // Change this based on the actual sender
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'user1' ? styles.userMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
        inverted // To display the latest messages at the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    paddingVertical: 10,
  },
  messageContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
