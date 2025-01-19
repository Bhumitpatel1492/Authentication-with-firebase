import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import CustomToastMessage from '../../Components/CustomToastMsg';

const Register = ({ navigation }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState({});

  const validateInputs = () => {
    let errors = {};
    if (!firstname.trim()) errors.firstname = 'Enter first name';
    if (!lastname.trim()) errors.lastname = 'Enter last name';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email';
    if (!password.trim() || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!phonenumber.trim() || phonenumber.length !== 10) errors.phonenumber = 'Enter a valid 10-digit phone number';
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const registerUser = async () => {
    if (!validateInputs()) return;

    try {
      // Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Realtime Database
      const userData = {
        name: `${firstname} ${lastname}`,
        email,
        phonenumber,
        userId,
      };

      await database().ref(`/users/${userId}`).set(userData);

      setIsSuccess(true);
      setMessage('User registered successfully!');
      setVisible(true);
      hideToast();
      navigation.goBack();
    } catch (error) {
      console.error('Registration Error:', error);
      setIsSuccess(false);
      setMessage(error.message || 'Registration failed');
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
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <Image source={require('../../../Assets/Images/login2.png')} resizeMode="contain" style={styles.image} />
          <TextInput value={firstname} onChangeText={setFirstname} placeholder="Enter First Name *" style={styles.input} />
          {error.firstname && <Text style={styles.errorText}>{error.firstname}</Text>}

          <TextInput value={lastname} onChangeText={setLastname} placeholder="Enter Last Name *" style={styles.input} />
          {error.lastname && <Text style={styles.errorText}>{error.lastname}</Text>}

          <TextInput value={email} onChangeText={setEmail} placeholder="Enter Email *" style={styles.input} />
          {error.email && <Text style={styles.errorText}>{error.email}</Text>}

          <TextInput value={phonenumber} onChangeText={setPhoneNumber} placeholder="Enter Phone Number *" style={styles.input} keyboardType="number-pad" />
          {error.phonenumber && <Text style={styles.errorText}>{error.phonenumber}</Text>}

          <TextInput value={password} onChangeText={setPassword} placeholder="Enter Password *" secureTextEntry style={styles.input} />
          {error.password && <Text style={styles.errorText}>{error.password}</Text>}

          <CustomToastMessage visible={isVisible} isSuccess={isSuccess} message={message} onClose={() => setVisible(false)} />

          <TouchableOpacity style={styles.button} onPress={registerUser}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fff' },
  input: { padding: 10, borderWidth: 1, marginVertical: 10, borderRadius: 22 },
  button: { backgroundColor: '#36C2CE', alignItems: 'center', padding: 10, borderRadius: 22, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16 },
  errorText: { color: 'red', marginHorizontal: 14 },
  image: { height: 200, width: 340, alignSelf: 'center' },
});

export default Register;
