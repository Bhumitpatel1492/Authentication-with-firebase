// import libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Image, Animated } from 'react-native';

// create a component
const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <Text>
        {'hello'}
      </Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#f0f4f8',
  },

});

// make this component available to the app
export default HomeScreen;
