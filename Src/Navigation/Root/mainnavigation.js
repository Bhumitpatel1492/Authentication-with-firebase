import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import auth from '@react-native-firebase/auth';

import Login from '../../Screens/LoginScreen';
import Register from '../../Screens/RegisterScreen';
import HomeScreen from '../../Screens/HomeScreen';
import ChatScreen from '../../Screens/ChatScreen/Index';
import SpleshScreen from '../../Screens/SpleshScreen';

const Stack = createNativeStackNavigator();
const AuthenticatedUserContext = createContext();

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShadowVisible: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShadowVisible: false }} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setSplashVisible(false);
    }, 1200);
    const unsubscribe = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser || null);
    });

    return () => {
      clearTimeout(splashTimeout);
      unsubscribe();
    };
  }, []);

  if (splashVisible) {
    return <SpleshScreen />;
  }

  return user ? <HomeStack /> : <AuthStack />;
};

const MainNavigation = () => {
  return (
    <AuthenticatedUserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthenticatedUserProvider>
  );
};

export default MainNavigation;
