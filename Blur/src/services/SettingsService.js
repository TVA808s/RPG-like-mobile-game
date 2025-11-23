// services/SettingsService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключ для хранения настроек в AsyncStorage
// AsyncStorage работает как словарь: ключ -> значение
const SETTINGS_KEY = '@settings';

// Настройки по умолчанию, которые используются при первом запуске приложения
// или если настройки не найдены в хранилище
const defaultSettings = {
  soundEnabled: true,     // Звуки включены по умолчанию
  soundVolume: 0.8,       // Громкость звуков 80% по умолчанию
  musicEnabled: true,     // Музыка включена по умолчанию
  musicVolume: 1.0,       // Громкость музыки 100% по умолчанию
};

export const SettingsService = {
  // Загрузка настроек из постоянного хранилища
  async getSettings() {
    try {
      // Пытаемся получить данные по ключу '@settings'
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      
      // Если настройки найдены - парсим JSON, иначе возвращаем настройки по умолчанию
      return settingsJson ? JSON.parse(settingsJson) : defaultSettings;
    } catch (error) {
      // В случае ошибки возвращаем настройки по умолчанию
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  },

  // Сохранение настроек в постоянное хранилище
  async saveSettings(settings) {
    try {
      // Преобразуем объект настроек в JSON-строку и сохраняем по ключу '@settings'
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Специальные методы для работы только с аудио-настройками
  async getAudioSettings() {
    // Загружаем все настройки и возвращаем только аудио-часть
    const settings = await this.getSettings();
    return {
      soundEnabled: settings.soundEnabled,
      soundVolume: settings.soundVolume,
      musicEnabled: settings.musicEnabled,
      musicVolume: settings.musicVolume,
    };
  },

  // Сохранение только аудио-настроек (объединяет с существующими настройками)
  async saveAudioSettings(audioSettings) {
    // Загружаем текущие настройки
    const currentSettings = await this.getSettings();
    
    // Создаем обновленные настройки, объединяя старые с новыми аудио-настройками
    const updatedSettings = {
      ...currentSettings,      // Копируем все текущие настройки
      ...audioSettings         // Перезаписываем только аудио-настройки
    };
    
    // Сохраняем обновленные настройки
    await this.saveSettings(updatedSettings);
  }
};