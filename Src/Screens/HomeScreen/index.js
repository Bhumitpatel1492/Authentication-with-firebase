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
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const Home = ({ route, navigation }) => {
  
  const { userId } = route.params; // Get the userId from route params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userLastSeen, setUserLastSeen] = useState({});

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('messages')
      .where('sender', 'in', [userId, 'user1']) // Fetch messages for the specific user
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data(),
        }));
        setMessages(fetchedMessages);
      });

    const fetchLastSeen = async () => {
      const usersSnapshot = await firestore().collection('users').get();
      const lastSeenData = {};
      usersSnapshot.forEach(doc => {
        lastSeenData[doc.id] = doc.data().lastSeen;
      });
      setUserLastSeen(lastSeenData);
    };

    fetchLastSeen();

    return () => unsubscribe();
  }, [userId]); // Re-run effect when userId changes

  const handleSend = async () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        sender: userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('messages').add(messageData);

      await firestore().collection('users').doc(userId).update({
        lastSeen: new Date().toISOString(),
      });

      setNewMessage('');
    }
  };

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

        const reference = storage().ref(`chatImages/${fileName}`);
        await reference.putFile(imageUri);
        const imageUrl = await reference.getDownloadURL();

        const messageData = {
          image: imageUrl,
          sender: userId,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore().collection('messages').add(messageData);

        await firestore().collection('users').doc(userId).update({
          lastSeen: new Date().toISOString(),
        });
      }
    });
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Offline';
    const lastSeenDate = new Date(timestamp);
    const now = new Date();
    const diff = now - lastSeenDate;

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'Online';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return lastSeenDate.toLocaleDateString();
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
        inverted
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

export default Home;
