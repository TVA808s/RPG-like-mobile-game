// services/MusicService.js
import TrackPlayer from 'react-native-track-player';
import { AppState } from 'react-native';
import { SettingsService } from './SettingsService';

class MusicService {
  constructor() {
    this.isInitialized = false;
    this.appStateListener = null;
    this.isEnabled = true;
    this.volume = 1.0;
    this.settingsLoaded = false;
    this.pendingActions = [];
    
    // Загрузка настроек при создании
    this.loadSettings();
  }

  // Загрузка настроек музыки
  async loadSettings() {
    try {
      const settings = await SettingsService.getSettings();
      this.isEnabled = settings.musicEnabled !== undefined ? settings.musicEnabled : true;
      this.volume = settings.musicVolume !== undefined ? settings.musicVolume : 1.0;
      this.settingsLoaded = true;
      console.log('Music settings loaded - enabled:', this.isEnabled, 'volume:', this.volume);
      
      // Выполняем отложенные действия
      this.processPendingActions();
    } catch (error) {
      console.log('Error loading music settings:', error);
      this.settingsLoaded = true;
    }
  }

  // Обработка отложенных действий
  async processPendingActions() {
    for (const action of this.pendingActions) {
      await action();
    }
    this.pendingActions = [];
  }

  // Добавление действия в очередь
  async executeWhenReady(action) {
    if (this.settingsLoaded) {
      await action();
    } else {
      this.pendingActions.push(action);
    }
  }

  // Сохранение настроек музыки
  async saveSettings() {
    try {
      const currentSettings = await SettingsService.getSettings();
      const updatedSettings = {
        ...currentSettings,
        musicEnabled: this.isEnabled,
        musicVolume: this.volume
      };
      await SettingsService.saveSettings(updatedSettings);
      console.log('Music settings saved');
    } catch (error) {
      console.log('Error saving music settings:', error);
    }
  }

  // Простая инициализация
  async initialize() {
    if (this.isInitialized) return;
    
    await this.executeWhenReady(async () => {
      try {
        await TrackPlayer.setupPlayer();
        
        // Минимальные настройки
        await TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [],
          compactCapabilities: [],
        });

        // Устанавливаем начальную громкость
        await TrackPlayer.setVolume(this.isEnabled ? this.volume : 0);
        
        // Добавляем слушатель состояния приложения
        this.setupAppStateListener();
        
        this.isInitialized = true;
        console.log('MusicService initialized');
      } catch (error) {
        console.log('MusicService init:', error.message);
      }
    });
  }

  // Настройка слушателя состояния приложения
  setupAppStateListener() {
    this.appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        this.pauseMusic();
      } else if (nextAppState === 'active') {
        this.resumeMusic();
      }
    });
  }

  // Воспроизведение музыки с проверкой настроек
  async playMusic(trackName) {
    await this.executeWhenReady(async () => {
      if (!this.isEnabled) {
        console.log('Music disabled, skipping playback');
        return;
      }

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
          track = {
            id: 'battle',
            url: 'https://audio.ngfiles.com/1127000/1127253_Undertale-like-Battle-Them.mp3?f1650965154',
            title: 'Battle Music',
            artist: '',
          };
        }

        await TrackPlayer.add(track);
        await TrackPlayer.play();
        await TrackPlayer.setRepeatMode(1);
        console.log(`Now playing: ${trackName}`);
      } catch (error) {
        console.log('Play music error:', error.message);
      }
    });
  }

  // Установка громкости с сохранением в настройки
  async setVolume(volume) {
    await this.executeWhenReady(async () => {
      try {
        this.volume = Math.max(0, Math.min(1, volume));
        await TrackPlayer.setVolume(this.isEnabled ? this.volume : 0);
        await this.saveSettings();
        console.log(`Music volume set to: ${this.volume}`);
      } catch (error) {
        console.log('Set volume error:', error.message);
      }
    });
  }

  // Включение/выключение музыки с сохранением в настройки
  async setEnabled(enabled) {
    await this.executeWhenReady(async () => {
      this.isEnabled = enabled;
      await this.saveSettings();
      
      try {
        if (this.isInitialized) {
          await TrackPlayer.setVolume(enabled ? this.volume : 0);
          if (!enabled) {
            await this.stopMusic();
          } else {
            // Если музыка включается и плеер инициализирован, возобновляем воспроизведение
            const currentTrack = await TrackPlayer.getCurrentTrack();
            if (currentTrack) {
              await TrackPlayer.play();
            }
          }
        }
      } catch (error) {
        console.log('Error updating music state:', error);
      }
      
      console.log(`Music enabled: ${this.isEnabled}`);
    });
  }

  // Получение текущих настроек музыки
  getSettings() {
    return {
      musicEnabled: this.isEnabled,
      musicVolume: this.volume
    };
  }

  // Пауза музыки
  async pauseMusic() {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.log('Pause music error:', error.message);
    }
  }

  // Возобновление музыки с проверкой настроек
  async resumeMusic() {
    if (!this.isEnabled) return;
    
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.log('Resume music error:', error.message);
    }
  }

  // Остановка музыки
  async stopMusic() {
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.log('Stop music error:', error.message);
    }
  }

  // Очистка ресурсов
  async cleanup() {
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }
    
    try {
      await TrackPlayer.reset();
      this.isInitialized = false;
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  }
}

const musicService = new MusicService();
export default musicService;