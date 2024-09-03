import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../../Screens/LoginScreen';
import Register from '../../Screens/RegisterScreen';
import HomeScreen from '../../Screens/HomeScreen';
import ProfileScreen from '../../Screens/ProfileScreen/Index';
import SettingsScreen from '../../Screens/SettingsScreen/Index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import Images from '../../Utils/images';
import SpleshScreen from '../../Screens/SpleshScreen';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, // Hide the header
        tabBarIcon: ({ focused, color, size }) => {


          if (route.name === "Home") {
            return <Image source={focused ? Images.Ic_Home_in : Images.Ic_Home_out} style={{ width: 20, height: 20, }} resizeMode='contain' />;
          } else if (route.name === "Profile") {
            return <Image resizeMode='contain' source={focused ? Images.Ic_Profile_in : Images.Ic_Profile_out} style={{ width: 20, height: 20, }} />;
          } else if (route.name === "Settings") {
            return <Image resizeMode='contain' source={focused ? Images.Ic_Setting_in : Images.Ic_Setting_out} style={{ width: 20, height: 20, }} />;
          }


          return null;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen

        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};



const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splesh">
        <Stack.Screen
          options={{ headerShadowVisible: false }}
          name="Splesh"
          component={SpleshScreen}
        />
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
        <Stack.Screen

          options={{ headerShown: false, headerShadowVisible: false }}
          name="HomeScreen"
          component={TabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
