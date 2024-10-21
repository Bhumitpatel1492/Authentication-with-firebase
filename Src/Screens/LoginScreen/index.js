import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import CustomToastMessage from '../../Components/CustomToastMsg';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
  const [Email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');


  const loginuser = async () => {
    if (!Email || !password) {
      setMessage('Email and Password are required');
      setIsSuccess(false);
      setVisible(true);
      hideToast();
      return;
    }
  
    try {
      const res = await firestore()
        .collection('users')
        .where('email', '==', Email)
        .get();
  
      if (res.docs.length > 0) {
        const userData = res.docs[0].data();
        goTonextScreen(userData.name, userData.email, userData.userId);
      } else {
        setIsSuccess(false);
        setMessage('User not found');
        setVisible(true);
        hideToast();
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('An error occurred while fetching user');
      setVisible(true);
      hideToast();
    }
  };
  


  const goTonextScreen = async (name, email, userId) => {
    try {
        await AsyncStorage.setItem('NAME', name);
        await AsyncStorage.setItem('EMAIL', email);
        await AsyncStorage.setItem('userId', userId);
        console.log('User details saved successfully');

        // Pass userId as a parameter when navigating
        navigation.navigate('Home', { userId }); // Pass userId here
    } catch (error) {
        console.error('Error saving user details: ', error);
    }
};

  
  const hideToast = () => {
    setTimeout(() => {
      setVisible(false);
    }, 1500);
  };

  const registeruser = () => {
    navigation.navigate('Register')
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View>
          <Image
            source={require('../../../Assets/Images/login1.png')}
            resizeMode='contain'
            style={{ height: 250, width: 340, justifyContent: "center" }}
          />
        </View>
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
          onPress={() => loginuser()}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 18, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={() => registeruser()}>
            <Text >{'Dont have account ? Resgister here '}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff"
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

export default Login;
