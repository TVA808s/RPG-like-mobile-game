import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const BattleButton = ({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'default', // 'default', 'mercy', 'attack', 'defend', 'item'
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const getButtonStyles = (pressed) => [
    styles.button,
    styles[`${size}Button`],
    styles[`${variant}Button`],
    pressed && styles.buttonPressed,
    disabled && styles.buttonDisabled,
    pressed && styles[`${variant}ButtonPressed`],
    disabled && styles[`${variant}ButtonDisabled`]
  ];

  const getTextStyles = (pressed) => [
    styles.buttonText,
    styles[`${size}ButtonText`],
    styles[`${variant}ButtonText`],
    pressed && styles.buttonTextPressed,
    disabled && styles.buttonTextDisabled,
    pressed && styles[`${variant}ButtonTextPressed`],
    disabled && styles[`${variant}ButtonTextDisabled`]
  ];

  return (
    <Pressable
      style={({ pressed }) => getButtonStyles(pressed)}
      onPress={onPress}
      disabled={disabled}
    >
      {({ pressed }) => (
        <Text style={getTextStyles(pressed)}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Базовые стили
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#000000ff',
    borderColor: '#307ed6ff',
    borderWidth: 3,
    margin: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Размеры
  smallButton: {
    width: '18%',
    paddingVertical: 8,
  },
  smallButtonText: {
    fontSize: 16,
  },
  mediumButton: {
    width: '22%',
    paddingVertical: 12,
  },
  mediumButtonText: {
    fontSize: 20,
  },
  largeButton: {
    width: '25%',
    paddingVertical: 15,
  },
  largeButtonText: {
    fontSize: 24,
  },

  // Кнопка милосердия
  mercyButton: {
    backgroundColor: '#000000ff',
    borderColor: '#307ed6ff',
  },
  mercyButtonText: {
    color: '#307ed6ff',
  },
  mercyButtonPressed: {
    backgroundColor: '#350211ff',
    borderColor: '#d1517bff',
  },
  mercyButtonTextPressed: {
    color: '#d1517bff',
  },
  mercyButtonDisabled: {
    backgroundColor: '#333333ff',
    borderColor: '#664466ff',
  },
  mercyButtonTextDisabled: {
    color: '#664466ff',
  },

  // Кнопка атаки
  attackButton: {
    backgroundColor: '#000000ff',
    borderColor: '#307ed6ff',
  },
  attackButtonText: {
    color: '#307ed6ff',
  },
  attackButtonPressed: {
    backgroundColor: '#3f0700ff',
    borderColor: '#ee7f63ff',
  },
  attackButtonTextPressed: {
    color: '#ee7f63ff',
  },

  // Кнопка защиты
  defendButton: {
    backgroundColor: '#000000ff',
    borderColor: '#307ed6ff',
  },
  defendButtonText: {
    color: '#307ed6ff',
  },
  defendButtonPressed: {
    backgroundColor: '#422b00ff',
    borderColor: '#ffd477ff',
  },
  defendButtonTextPressed: {
    color: '#ffcf77ff',

  },

  // Кнопка предмета
  itemButton: {
    backgroundColor: '#000000ff',
    borderColor: '#307ed6ff',
  },
  itemButtonText: {
    color: '#307ed6ff',
  },
  itemButtonPressed: {
    backgroundColor: '#183100ff',
    borderColor: '#8fdd5bff',
  },
  itemButtonTextPressed: {
    color: '#8fdd5bff',
  },

  // Общие состояния
  buttonPressed: {
    transform: [{scale: 0.98}],
  },
  buttonTextPressed: {
    // Общие стили для текста в нажатом состоянии
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonTextDisabled: {
    // Общие стили для отключенного текста
  },
});

export { BattleButton };