import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import storage from '@react-native-firebase/storage'; // Import Storage
import { launchImageLibrary } from 'react-native-image-picker'; // Import Image Picker

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = 'user1'; // Replace with actual user ID or get it from auth context
  const [userLastSeen, setUserLastSeen] = useState({}); // Store last seen of users

  // Fetch messages and user last seen from Firestore on component mount
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('messages')
      .orderBy('createdAt', 'desc') // Order messages by timestamp
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

    // Fetch last seen for all users (you can optimize this based on your use case)
    const fetchLastSeen = async () => {
      const usersSnapshot = await firestore().collection('users').get(); // Get all users
      const lastSeenData = {};
      usersSnapshot.forEach(doc => {
        lastSeenData[doc.id] = doc.data().lastSeen; // Store last seen
      });
      setUserLastSeen(lastSeenData); // Set last seen state
    };

    fetchLastSeen();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to send a new message and update last seen
  const handleSend = async () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        sender: userId, // Replace with actual sender ID
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('messages').add(messageData); // Add new message to Firestore

      // Update last seen
      await firestore().collection('users').doc(userId).update({
        lastSeen: new Date().toISOString(), // Update last seen to current time
      });

      setNewMessage(''); // Clear input field
    }
  };

  // Function to handle image selection and upload
  const handleImageSend = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = response.assets[0];
        const imageUri = source.uri;
        const fileName = source.fileName;

        // Upload the image to Firebase Storage
        const reference = storage().ref(`chatImages/${fileName}`);
        await reference.putFile(imageUri);

        // Get the URL of the uploaded image
        const imageUrl = await reference.getDownloadURL();

        // Create a message with the image URL
        const messageData = {
          image: imageUrl,
          sender: userId, // Replace with actual sender ID
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore().collection('messages').add(messageData); // Add new message to Firestore

        // Update last seen
        await firestore().collection('users').doc(userId).update({
          lastSeen: new Date().toISOString(), // Update last seen to current time
        });
      }
    });
  };

  // Function to format the last seen timestamp
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Offline';
    const lastSeenDate = new Date(timestamp);
    const now = new Date();
    const diff = now - lastSeenDate;

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'Online';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return lastSeenDate.toLocaleDateString(); // Show date if last seen is more than a day ago
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === userId ? styles.userMessage : styles.otherMessage]}>
            {item.text ? (
              <Text style={styles.messageText}>{item.text}</Text>
            ) : (
              <Image source={{ uri: item.image }} style={styles.imageMessage} />
            )}
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
        <TouchableOpacity style={styles.imageButton} onPress={handleImageSend}>
          <Text style={styles.sendButtonText}>📷</Text>
        </TouchableOpacity>
      </View>
      {/* Display last seen status */}
      <View style={styles.lastSeenContainer}>
        {Object.keys(userLastSeen).map((userId) => (
          <Text key={userId} style={styles.lastSeenText}>
            {`User ${userId}: ${formatLastSeen(userLastSeen[userId])}`}
          </Text>
        ))}
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
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
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
  imageButton: {
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lastSeenContainer: {
    padding: 10,
  },
  lastSeenText: {
    color: '#888',
  },
});

export default ChatScreen;
