// services/MusicService.js
import TrackPlayer from 'react-native-track-player';
import { AppState } from 'react-native';

class MusicService {
  constructor() {
    this.isInitialized = false;
    this.appStateListener = null;
  }

  // Простая инициализация
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await TrackPlayer.setupPlayer();
      
      // Минимальные настройки
      await TrackPlayer.updateOptions({
        stopWithApp: true, // Останавливать при закрытии приложения
        capabilities: [],
        compactCapabilities: [],
      });

      // Добавляем слушатель состояния приложения
      this.setupAppStateListener();
      
      this.isInitialized = true;
      console.log('MusicService initialized');
    } catch (error) {
      console.log('MusicService init:', error.message);
    }
  }

  // Настройка слушателя состояния приложения
  setupAppStateListener() {
    this.appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // При сворачивании или переходе в неактивное состояние - пауза
        this.pauseMusic();
      } else if (nextAppState === 'active') {
        // При возвращении в активное состояние - возобновление
        this.resumeMusic();
      }
    });
  }

  // Воспроизведение музыки
  async playMusic(trackName) {
    try {
      await this.initialize();
      await TrackPlayer.reset();
      let track;
      
      if (trackName === 'menu') {
        track = {
          id: 'menu',
          url: require('../assets/music/menu.mp3'),
          title: 'Menu Music',
          artist: 'lov3rbo9',
        };
      } else if (trackName === 'battle') {
        // Убедитесь, что URL корректен и доступен
        track = {
          id: 'battle',
          url: 'https://audio.ngfiles.com/1127000/1127253_Undertale-like-Battle-Them.mp3?f1650965154',
          title: 'Battle Music',
          artist: '',
        };
      }

      // Добавляем и воспроизводим трек
      await TrackPlayer.add(track);
      await TrackPlayer.play();
      await TrackPlayer.setRepeatMode(1);
      console.log(`Now playing: ${trackName}`);
    } catch (error) {
      console.log('Play music error:', error.message);
    }
  }

  async setVolume(volume) {
    try {
      await TrackPlayer.setVolume(volume);
      console.log(`Volume set to: ${volume}`);
    } catch (error) {
      console.log('Set volume error:', error.message);
    }
  }

  // Пауза музыки
  async pauseMusic() {
    try {
      await TrackPlayer.pause();
      console.log('Music paused');
    } catch (error) {
      console.log('Pause music error:', error.message);
    }
  }

  // Возобновление музыки
  async resumeMusic() {
    try {
      await TrackPlayer.play();
      console.log('Music resumed');
    } catch (error) {
      console.log('Resume music error:', error.message);
    }
  }

  // Остановка музыки
  async stopMusic() {
    try {
      await TrackPlayer.stop();
      console.log('Music stopped');
    } catch (error) {
      console.log('Stop music error:', error.message);
    }
  }

  // Очистка ресурсов
  async destroy() {
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }
    
    try {
      await TrackPlayer.reset();
      await TrackPlayer.destroy();
      this.isInitialized = false;
      console.log('MusicService destroyed');
    } catch (error) {
      console.log('Destroy error:', error.message);
    }
  }
}

// Создаем экземпляр
const musicService = new MusicService();
export default musicService;