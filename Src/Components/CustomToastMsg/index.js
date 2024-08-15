//import libraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';

// create a component
const CustomToastMessage = ({ visible, isSuccess, message, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.toastContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={isSuccess ? require('../../../Assets/Images/SuccessToast.png') : require('../../../Assets/Images/ErrorToast.png')}
              style={styles.icon}
            />
          </View>
          <Text style={styles.messageText}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../../Assets/Images/canclebtn.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,

  },
  icon: {
    width: 45,
    height: 45,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 10,
  },
});

//make this component available to the app
export default CustomToastMessage;
