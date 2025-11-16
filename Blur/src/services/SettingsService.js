// services/SettingsService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@settings';

const defaultSettings = {
  soundEnabled: true,
  soundVolume: 0.8,
  musicEnabled: true,
  musicVolume: 1.0,
};

export const SettingsService = {
  async getSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Специальные методы для аудио настроек
  async getAudioSettings() {
    const settings = await this.getSettings();
    return {
      soundEnabled: settings.soundEnabled,
      soundVolume: settings.soundVolume,
      musicEnabled: settings.musicEnabled,
      musicVolume: settings.musicVolume,
    };
  },

  async saveAudioSettings(audioSettings) {
    const currentSettings = await this.getSettings();
    const updatedSettings = {
      ...currentSettings,
      ...audioSettings
    };
    await this.saveSettings(updatedSettings);
  }
};