//import libraries
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import CustomToastMessage from '../../Components/CustomToastMsg';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore'

// create a component
const Register = ({ navigation }) => {
  const [firstname, setfirstname] = useState('');
  const [Lastname, setLastname] = useState('');
  const [Phonenumber, setPhoneNumber] = useState('');
  const [Email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState({
    firstname: '',
    lastname: '',
    Email: '',
    password: '',
    Phonenumber: ''
  })

  const registeruser = () => {
    if (error.firstname?.length == 0) {
      setError(prevError => ({ ...prevError, firstname: 'Enter first name' }))
    } else if (error.lastname?.length == 0) {
      setError(prevError => ({
        ...prevError, lastname: 'Enter Last name'
      }))
    } else if (error.Email?.length == 0) {
      setError(prevError => ({
        ...prevError, Email: 'Enter Email'
      }))
    } else if (error.Phonenumber?.length == 0) {
      setError(prevError => ({
        ...prevError, Phonenumber: 'Enter Phone number'
      }))
    }
    else if (error.password?.length == 0) {
      setError(prevError => ({
        ...prevError, password: 'Enter Password '
      }))
    }

    else {
      const userId = uuid.v4()
      firestore().collection("users").doc(userId).set({
        name: firstname + "" + Lastname,
        email: Email,
        password: password,
        phonenumber: Phonenumber,
        userId: userId
      }).then((res) => {
        console.log('user is Register')
        setIsSuccess(true);
        setMessage(' user is Register Succesfull');
        setVisible(true);

      })
      hideToast()
      navigation.goBack('')
      // auth()
      //   .createUserWithEmailAndPassword(Email, password,)
      //   .then(() => {
      //     setIsSuccess(true);
      //     setMessage('Register successful!');
      //     setVisible(true);
      //     hideToast();
      //     navigation.navigate('Login')
      //   })
      //   .catch(error => {
      //     if (error.code === 'auth/email-already-in-use') {
      //       setIsSuccess(false);
      //       setMessage('That email address is already in use!');
      //       setVisible(true);
      //     } else if (error.code === 'auth/invalid-email') {
      //       setIsSuccess(false);
      //       setMessage('That email address is invalid!');
      //       setVisible(true);

      //     } else if (error.code === 'auth/wrong-password') {
      //       setIsSuccess(false);
      //       setMessage('Incorrect password!');
      //       setVisible(true);
      //     } else {
      //       setIsSuccess(false);
      //       setMessage('Login failed! Please try again.');
      //       setVisible(true);
      //     }
      //     hideToast();

      //   });
    }
  };

  const hideToast = () => {
    setTimeout(() => {
      setVisible(false);
    }, 3000); // Hide the toast after 3 seconds
  };



  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <View>
            <Image
              source={require('../../../Assets/Images/login2.png')}
              resizeMode='contain'
              style={{ height: 200, width: 340, justifyContent: "center" }}
            />
          </View>
          <TextInput
            value={firstname}
            onChangeText={txt => setfirstname(txt)}
            placeholder='Enter first Name *'
            style={styles.input}
          />
          {error?.firstname ?
            <Text style={styles.errortxt}>
              {error.firstname}
            </Text> : null
          }
          <TextInput
            value={Lastname}
            onChangeText={txt => setLastname(txt)}
            placeholder='Enter Last Name *'
            style={styles.input}
          />
          {error?.lastname ?
            <Text style={styles.errortxt}>
              {error.lastname}
            </Text> : null
          }

          <TextInput
            value={Email}
            onChangeText={txt => SetEmail(txt)}
            placeholder='Enter Email *'
            style={styles.input}
          />
          {error?.Email ?
            <Text style={styles.errortxt}>
              {error.Email}
            </Text> : null
          }
          <TextInput
            value={Phonenumber}
            onChangeText={txt => setPhoneNumber(txt)}
            placeholder='Enter Phone Number *'
            style={styles.input}
            maxLength={10}
            keyboardType='number-pad'
          />
          {error?.Phonenumber ?
            <Text style={styles.errortxt}>
              {error.Phonenumber}
            </Text> : null
          }
          <TextInput
            value={password}
            onChangeText={txt => SetPassword(txt)}
            placeholder='Enter Password *'
            secureTextEntry={true}
            style={styles.input}
          />
          {error?.password ?
            <Text style={styles.errortxt}>
              {error.password}
            </Text> : null
          }
          <CustomToastMessage
            visible={isVisible}
            isSuccess={isSuccess}
            message={message}
            onClose={() => setVisible(false)}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={registeruser}
          >
            <Text style={styles.loginButtonText}>{"Register"}</Text>
          </TouchableOpacity>


        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

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
  errortxt: { color: 'red', marginHorizontal: 14 }
});

//make this component available to the app
export default Register;
