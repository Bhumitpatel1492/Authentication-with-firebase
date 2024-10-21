import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const SpleshScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../Assets/Images/chat.png')}
        style={{ height: 300, width: 300 }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SpleshScreen;
