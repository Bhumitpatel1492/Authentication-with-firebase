
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Src/Screens/LoginScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          options={{ headerShadowVisible: false }}
          name="LoginScreen"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}



export default App;
