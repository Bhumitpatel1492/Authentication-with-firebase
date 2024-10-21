import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import Login from '../../Screens/LoginScreen';
import Register from '../../Screens/RegisterScreen';
import HomeScreen from '../../Screens/HomeScreen/index';
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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />


    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator for handling the splash screen, auth state, and navigation
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

  // Show HomeStack if user is authenticated, else show AuthStack
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="HomeStack" component={HomeStack} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
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
