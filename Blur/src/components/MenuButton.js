import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
const MenuButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <Text style={[
          styles.buttonText,
          pressed && styles.buttonTextPressed
        ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  button: {
    width: '35%',
    paddingVertical: 10,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'grey',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonPressed: {
    backgroundColor: '#b5b5b5',
    borderColor: 'white',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  buttonTextPressed: {
    color: '#fffa78',
    fontWeight: '800',
  },
});
export {MenuButton};
