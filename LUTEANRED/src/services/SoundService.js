// services/SoundService.js
import Sound from 'react-native-sound';
import { SettingsService } from './SettingsService';

class SoundService {
  constructor() {
    this.sounds = new Map();
    this.isEnabled = true;
    this.volume = 0.6;
    this.isInitialized = false;
    
    // Автоматическая загрузка настроек при создании
    this.loadSettings();
    this.initialize();
  }

  // Загрузка настроек из SettingsService
  async loadSettings() {
    try {
      const settings = await SettingsService.getSettings();
      this.isEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
      this.volume = settings.soundVolume !== undefined ? settings.soundVolume : 0.8;
      console.log('Sound settings loaded - enabled:', this.isEnabled, 'volume:', this.volume);
    } catch (error) {
      console.log('Error loading sound settings:', error);
    }
  }

  // Сохранение настроек в SettingsService
  async saveSettings() {
    try {
      const currentSettings = await SettingsService.getSettings();
      const updatedSettings = {
        ...currentSettings,
        soundEnabled: this.isEnabled,
        soundVolume: this.volume
      };
      await SettingsService.saveSettings(updatedSettings);
      console.log('Sound settings saved');
    } catch (error) {
      console.log('Error saving sound settings:', error);
    }
  }

  // Инициализация аудио системы
  initialize() {
    if (this.isInitialized) return;
    
    try {
      Sound.setCategory('Playback', true);
      this.isInitialized = true;
      console.log('SoundService initialized');
    } catch (error) {
      console.log('SoundService init error:', error);
    }
  }

  // Загрузка звука
  async loadSound(soundKey, soundFile) {
    try {
      if (this.sounds.has(soundKey)) {
        return true;
      }

      return new Promise((resolve, reject) => {
        const sound = new Sound(soundFile, (error) => {
          if (error) {
            console.log(`Failed to load sound ${soundKey}:`, error);
            reject(error);
            return;
          }
          
          sound.setVolume(this.volume);
          this.sounds.set(soundKey, sound);
          console.log(`Sound ${soundKey} loaded successfully`);
          resolve(true);
        });
      });
    } catch (error) {
      console.log(`Load sound ${soundKey} error:`, error);
      return false;
    }
  }

  // Предзагрузка всех звуков игры
  async preloadGameSounds() {
    const soundConfigs = {
      'player.attack': require('../assets/sounds/hit2.mp3'),
      'player.hit': require('../assets/sounds/hit3.mp3'),
      'player.death': require('../assets/sounds/death2.mp3'),
      'player.heal': require('../assets/sounds/heal.mp3'),
      'player.shield': require('../assets/sounds/shield.mp3'),
      'player.mercy': require('../assets/sounds/mercy.mp3'),
      'enemy.death': require('../assets/sounds/death1.mp3'),
    };

    try {
      const loadPromises = Object.entries(soundConfigs).map(([key, file]) => 
        this.loadSound(key, file)
      );
      
      await Promise.all(loadPromises);
      console.log('All game sounds preloaded');
      return true;
    } catch (error) {
      console.log('Error preloading sounds:', error);
      return false;
    }
  }

  // Воспроизведение звука с проверкой настроек
  playSound(soundKey) {
    if (!this.isEnabled || !this.isInitialized) {
      console.log('Sound disabled or not initialized');
      return;
    }

    const sound = this.sounds.get(soundKey);
    if (sound) {
      sound.play();
    } else {
      console.log(`Sound ${soundKey} not found`);
    }
  }

  // Установка громкости с сохранением в настройки
  async setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.setVolume(this.volume);
    });
    await this.saveSettings();
  }

  // Включение/выключение звуков с сохранением в настройки
  async setEnabled(enabled) {
    this.isEnabled = enabled;
    await this.saveSettings();
  }

  // Получение текущих настроек
  getSettings() {
    return {
      soundEnabled: this.isEnabled,
      soundVolume: this.volume
    };
  }

  // Очистка ресурсов
  cleanup() {
    this.sounds.forEach((sound, soundKey) => {
      sound.stop();
      sound.release();
    });
    this.sounds.clear();
    this.isInitialized = false;
  }
}

const soundService = new SoundService();
export default soundService;