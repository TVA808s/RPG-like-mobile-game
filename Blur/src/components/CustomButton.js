import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const CustomButton = ({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'default',
  size = 'medium',
  icon: IconComponent,
  canMercy = false
}) => {
  // Определяем цвета для разных состояний и вариантов
  const getColors = (pressed) => {
    const colors = {
      mercy: {
        normal: { 
          text: canMercy ? '#8e52f0ff' : '#307ed6ff', 
          border: canMercy ? '#0059ffff' : '#307ed6ff', 
          background: canMercy ? '#1f1e20ff' : '#000000ff' 
        },
        pressed: {text: '#d1517bff', border: '#d1517bff', background: '#350211ff'},
        disabled: {text: '#686868ff', border: '#686868ff', background: '#333333ff'}
      },
      attack: {
        normal: { text: '#307ed6ff', border: '#307ed6ff', background: '#000000ff' },
        pressed: { text: '#ee7f63ff', border: '#ee7f63ff', background: '#3f0700ff' },
        disabled: { text: '#686868ff', border: '#686868ff', background: '#333333ff' }
      },
      defend: {
        normal: { text: '#307ed6ff', border: '#307ed6ff', background: '#000000ff' },
        pressed: { text: '#ffcf77ff', border: '#ffd477ff', background: '#422b00ff' },
        disabled: { text: '#686868ff', border: '#686868ff', background: '#333333ff' }
      },
      item: {
        normal: { text: '#307ed6ff', border: '#307ed6ff', background: '#000000ff' },
        pressed: { text: '#8fdd5bff', border: '#8fdd5bff', background: '#183100ff' },
        disabled: { text: '#686868ff', border: '#686868ff', background: '#333333ff' }
      },
      menu: {
        normal: { text: 'grey', border: 'transparent', background: 'transparent' },
        pressed: { text: '#fffa78', border: 'white', background: '#b5b5b5' },
        disabled: { text: '#686868ff', border: '#686868ff', background: '#333333ff' }
      },
      default: {
        normal: { text: '#307ed6ff', border: '#307ed6ff', background: '#000000ff' },
        pressed: { text: '#307ed6ff', border: '#307ed6ff', background: '#000000ff' },
        disabled: { text: '#686868ff', border: '#686868ff', background: '#333333ff' }
      },
    };

    const variantColors = colors[variant] || colors.default;
    
    if (disabled) return variantColors.disabled;
    if (pressed) return variantColors.pressed;
    return variantColors.normal;
  };

  const getButtonStyles = (pressed) => {
    const colors = getColors(pressed);
    const baseStyles = [
      styles.button,
      { backgroundColor: colors.background, borderColor: colors.border },
      pressed && styles.buttonPressed,
      disabled && styles.buttonDisabled,
    ];

    // Для menu варианта применяем специальные стили
    if (variant === 'menu') {
      baseStyles.push(styles.menuButton);
      if (pressed) {
        baseStyles.push(styles.menuButtonPressed);
      }
    } else {
      // Для остальных вариантов применяем размерные стили
      baseStyles.push(styles[`${size}Button`]);
      if (pressed) {
        baseStyles.push(styles.buttonPressed);
      }
    }

    return baseStyles;
  };

  const getTextStyles = (pressed) => {
    const colors = getColors(pressed);
    const baseStyles = [
      styles.buttonText,
      { color: colors.text },
      pressed && styles.buttonTextPressed,
      disabled && styles.buttonTextDisabled,
    ];

    // Для menu варианта применяем специальные стили текста
    if (variant === 'menu') {
      baseStyles.push(styles.menuButtonText);
      if (pressed) {
        baseStyles.push(styles.menuButtonTextPressed);
      }
    } else {
      // Для остальных вариантов применяем размерные стили текста
      baseStyles.push(styles[`${size}ButtonText`]);
    }

    return baseStyles;
  };

  const getIconColor = (pressed) => {
    const colors = getColors(pressed);
    return colors.text;
  };

  const getIconSize = () => {
    const sizes = {
      small: { width: 16, height: 16 },
      medium: { width: 28, height: 28 },
      large: { width: 36, height: 36 },
    };
    return sizes[size] || sizes.medium;
  };

  return (
    <Pressable
      style={({ pressed }) => getButtonStyles(pressed)}
      onPress={onPress}
      disabled={disabled}
    >
      {({ pressed }) => (
        <View style={styles.contentContainer}>
          {IconComponent && (
            <IconComponent 
              {...getIconSize()}
              color={getIconColor(pressed)}
              style={styles[`${size}Icon`]}
            />
          )}
          <Text style={getTextStyles(pressed)}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Базовые стили
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 3,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Стили для menu варианта (из MenuButton)
  menuButton: {
    width: '35%',
    paddingVertical: 10,
    alignItems: 'center',
    margin: 10,
  },
  menuButtonPressed: {
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  menuButtonTextPressed: {
    fontWeight: '800',
  },

  // Размеры для battle вариантов
  smallButton: {
    width: '16%',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  smallButtonText: {
    fontSize: 16,
  },
  smallIcon: {
    marginRight: 6,
  },
  mediumButton: {
    width: '18%',
    paddingVertical: 12,
  },
  mediumButtonText: {
    fontSize: 20,
  },
  mediumIcon: {
    marginRight: 4,
  },
  largeButton: {
    width: '25%',
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  largeButtonText: {
    fontSize: 24,
  },
  largeIcon: {
    marginRight: 10,
  },

  // Общие состояния
  buttonPressed: {
    transform: [{scale: 0.98}],
  },
  buttonTextPressed: {},
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonTextDisabled: {},
});

export { CustomButton };