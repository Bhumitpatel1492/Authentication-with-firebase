// import necessary libraries
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// create a functional component
const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        {/* <Image
          source={{ uri: 'https://example.com/your-profile-pic.jpg' }} // Replace with your profile picture URL
          style={styles.profileImage}
        /> */}
        <Text style={styles.username}>John Doe</Text>
      </View>

      <DrawerItem
        label="Home"
        // icon={({ color, size }) => (
        //   <MaterialIcons name="home" color={color} size={size} />
        // )}
        onPress={() => props.navigation.navigate('HomeScreen')}
      />

      <DrawerItem
        label="Profile"
        // icon={({ color, size }) => (
        //   <MaterialIcons name="person" color={color} size={size} />
        // )}
        onPress={() => props.navigation.navigate('Profile')}
      />

      <DrawerItem
        label="Settings"
        // icon={({ color, size }) => (
        //   <MaterialIcons name="settings" color={color} size={size} />
        // )}
        onPress={() => props.navigation.navigate('Settings')}
      />

      <DrawerItem
        label="Logout"
        // icon={({ color, size }) => (
        //   <MaterialIcons name="logout" color={color} size={size} />
        // )}
        onPress={() => {
          // Handle logout logic here
          props.navigation.navigate('Login');
        }}
      />
    </DrawerContentScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#f6f6f6',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// make this component available to the app
export default DrawerContent;
