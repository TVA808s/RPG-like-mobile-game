import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@settings';

const defaultSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 1.0, // от 0 до 1
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
};