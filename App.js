
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Src/Screens/LoginScreen';
import Register from './Src/Screens/RegisterScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          options={{ headerShadowVisible: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShadowVisible: false }}
          name="Register"
          component={Register}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}



export default App;
