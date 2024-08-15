//import libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import CustomToastMessage from '../../Components/CustomToastMsg';

// create a component
const LoginScreen = () => {
  const [Email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const loginuser = () => {
    auth()
      .signInWithEmailAndPassword(Email, password)
      .then(() => {
        setIsSuccess(true);
        setMessage('Login successful!');
        setVisible(true);
        hideToast();
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setIsSuccess(false);
          setMessage('That email address is already in use!');
          setVisible(true);
        } else if (error.code === 'auth/invalid-email') {
          setIsSuccess(false);
          setMessage('That email address is invalid!');
          setVisible(true);
        } else if (error.code === 'auth/user-not-found') {
          setIsSuccess(false);
          setMessage('No user found with this email!');
          setVisible(true);
        } else if (error.code === 'auth/wrong-password') {
          setIsSuccess(false);
          setMessage('Incorrect password!');
          setVisible(true);
        } else {
          setIsSuccess(false);
          setMessage('Login failed! Please try again.');
          setVisible(true);
        }
        hideToast();
      });
  };

  const hideToast = () => {
    setTimeout(() => {
      // setVisible(false);
    }, 3000); // Hide the toast after 3 seconds
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={Email}
        onChangeText={txt => SetEmail(txt)}
        placeholder='Enter Email'
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={txt => SetPassword(txt)}
        placeholder='Enter Password'
        secureTextEntry={true}
        style={styles.input}
      />
      <CustomToastMessage
        visible={isVisible}
        isSuccess={isSuccess}
        message={message}
        onClose={() => setVisible(false)}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={loginuser}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 22,
  },
  loginButton: {
    backgroundColor: '#36C2CE',
    alignItems: 'center',
    padding: 10,
    borderRadius: 22,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

//make this component available to the app
export default LoginScreen;
