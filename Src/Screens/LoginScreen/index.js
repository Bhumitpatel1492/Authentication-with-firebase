import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomToastMessage from '../../Components/CustomToastMsg';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const loginUser = async () => {
    if (!email || !password) {
      setMessage('Email and Password are required');
      setIsSuccess(false);
      setVisible(true);
      hideToast();
      return;
    }

    try {
      // Firebase Authentication
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        const snapshot = await database().ref(`/users/${user.uid}`).once('value');
        const userData = snapshot.val();

        if (userData) {
          await AsyncStorage.setItem('NAME', userData.name);
          await AsyncStorage.setItem('EMAIL', userData.email);
          await AsyncStorage.setItem('userId', user.uid);

          setMessage('Login successful');
          setIsSuccess(true);
          setVisible(true);
          hideToast();
          navigation.navigate('Home', { userId: user.uid });
        } else {
          setMessage('User data not found in Realtime Database');
          setIsSuccess(false);
          setVisible(true);
          hideToast();
        }
      }
    } catch (error) {
      console.error('Login Error:', error);

      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
      if (error.code === 'auth/wrong-password') errorMessage = 'Invalid password.';
      if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email format.';

      setMessage(errorMessage);
      setIsSuccess(false);
      setVisible(true);
      hideToast();
    }
  };

  const hideToast = () => {
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Image source={require('../../../Assets/Images/login1.png')} resizeMode="contain" style={styles.image} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Enter Email" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Enter Password" secureTextEntry style={styles.input} />
        <CustomToastMessage visible={isVisible} isSuccess={isSuccess} message={message} onClose={() => setVisible(false)} />
        <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fff' },
  input: { padding: 10, borderWidth: 1, marginVertical: 10, borderRadius: 22 },
  loginButton: { backgroundColor: '#36C2CE', alignItems: 'center', padding: 10, borderRadius: 22, marginTop: 20 },
  loginButtonText: { color: '#fff', fontSize: 16 },
  registerText: { marginTop: 20, textAlign: 'center', color: '#36C2CE' },
  image: { height: 250, width: 340, alignSelf: 'center' },
});

export default Login;
