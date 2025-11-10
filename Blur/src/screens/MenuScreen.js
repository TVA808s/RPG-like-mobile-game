import React from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native'; 
import { MenuButton } from '../components/MenuButton';

const MenuScreen = ({ navigation }) => {
  const handlePlay = () => {
    navigation.navigate('Game');
  };

  const handleSettings = () => {
    navigation.navigate('Settings'); // Переход на экран настроек
  };

  const handleExit = () => {
    // Выйти из приложения
    BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LUTEANRED</Text>
      <MenuButton onPress={handlePlay} title="PLAY" />
      <MenuButton onPress={handleSettings} title="SETTINGS" />
      <MenuButton onPress={handleExit} title="EXIT" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0404',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: '#ffffff',
    fontSize: 42,
    marginBottom: 30,
    fontWeight: '700',
  },
});

export default MenuScreen;