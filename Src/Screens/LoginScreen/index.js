//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

// create a component
const LoginScreen = () => {
  const [Email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')


  const loginuser = () => {
    auth()
      .signInWithEmailAndPassword(Email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {

          console.log('That email address is invalid!');
        }

        console.error(error);
      });

  }
  return (
    <View style={styles.container}>
      <TextInput
        value={Email}
        onChangeText={(txt) => SetEmail(txt)}
        placeholder='Enter Emnail'
        style={{ padding: 10, borderWidth: 1, marginHorizontal: 15, borderRadius: 22 }}
      />
      <View style={{ marginTop: 10 }} />
      <TextInput
        value={password}
        onChangeText={(txt) => SetPassword(txt)}
        placeholder='Enter Password'
        style={{ padding: 10, borderWidth: 1, marginHorizontal: 15, borderRadius: 22 }}
      />
      <View style={{ marginTop: 10 }} />
      <View style={{ marginTop: 10 }} />

      <TouchableOpacity
        style={{ backgroundColor: '#36C2CE', alignItems: "center", padding: 10, borderWidth: 1, marginHorizontal: 45, borderRadius: 22 }}
        onPress={() => loginuser()}
      >
        <Text style={{ color: '#fff' }}>{'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});

//make this component available to the app
export default LoginScreen;
