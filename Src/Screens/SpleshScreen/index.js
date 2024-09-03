//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

// create a component
const SpleshScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuthState = async () => {
      const user = auth().currentUser;
      if (user) {
        navigation.navigate('HomeScreen')
      } else {
        navigation.navigate('Login')

      }
    }
    checkAuthState();

  }, [navigation])
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default SpleshScreen;
