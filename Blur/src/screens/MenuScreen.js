import {React, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, BackHandler, AppState } from 'react-native';
import { MenuButton } from '../components/MenuButton';
import musicService from '../services/MusicService';

const MenuScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Воспроизводим музыку при монтировании компонента
    musicService.playMusic('menu');

    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        // Приложение переходит в фоновый режим - ставим музыку на паузу
        musicService.pauseMusic();
      } else if (appState.current === 'background' && nextAppState === 'active') {
        // Приложение возвращается из фонового режима - возобновляем музыку
        musicService.resumeMusic();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      // Останавливаем музыку при размонтировании компонента
      musicService.stopMusic();
    };
  }, []);

  const handlePlay = () => {
    navigation.navigate('Game');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleExit = () => {
    // Останавливаем музыку перед выходом
    musicService.stopMusic();
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