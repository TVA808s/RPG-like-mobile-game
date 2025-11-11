import React, { useState, useEffect, useRef } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MenuButton } from '../components/MenuButton';
import musicService from '../services/MusicService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

const SETTINGS_KEY = '@game_settings';

const SettingsScreen = ({ navigation }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [isInitialized, setIsInitialized] = useState(false);
  const isFirstLoad = useRef(true);

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    loadSettings();
  }, []);

  // Применяем настройки музыки только после инициализации
  useEffect(() => {
    if (isInitialized) {
      applyMusicSettings();
    }
  }, [musicEnabled, volume, isInitialized]);

  // Сохраняем настройки при любом изменении, но только после инициализации
  useEffect(() => {
    if (isInitialized) {
      saveSettings();
    }
  }, [soundEnabled, musicEnabled, volume, isInitialized]);

  const loadSettings = async () => {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        
        // Устанавливаем значения напрямую, без промежуточных применений
        setSoundEnabled(settings.soundEnabled !== undefined ? settings.soundEnabled : true);
        setMusicEnabled(settings.musicEnabled !== undefined ? settings.musicEnabled : true);
        setVolume(settings.volume !== undefined ? settings.volume : 1.0);
        
        // Только после установки всех значений помечаем как инициализированные
        setIsInitialized(true);
        
        // И только теперь применяем настройки музыки
        await applyMusicSettingsImmediately(settings.musicEnabled, settings.volume);
      } else {
        // Если настроек нет, устанавливаем и применяем настройки по умолчанию
        setIsInitialized(true);
        await musicService.setVolume(1.0);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
      // В случае ошибки все равно помечаем как инициализированные
      setIsInitialized(true);
    }
  };

  const applyMusicSettingsImmediately = async (enabled, vol) => {
    try {
      // Применяем настройки без промежуточных состояний
      const currentVolume = enabled ? vol : 0;
      await musicService.setVolume(currentVolume);
    } catch (error) {
      console.log('Error applying music settings:', error);
    }
  };

  const saveSettings = async () => {
    // Не сохраняем настройки до завершения инициализации
    if (!isInitialized) return;
    
    try {
      const settings = {
        soundEnabled,
        musicEnabled,
        volume
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const applyMusicSettings = async () => {
    // Не применяем настройки до завершения инициализации
    if (!isInitialized) return;
    
    try {
      // Устанавливаем громкость: если музыка включена - используем volume, если выключена - 0
      const currentVolume = musicEnabled ? volume : 0;
      await musicService.setVolume(currentVolume);
    } catch (error) {
      console.log('Error applying music settings:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const handleSlidingComplete = (value) => {
    setVolume(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>
      
      <View style={styles.settingsContainer}>
        {/* Music Toggle */}
        <TouchableOpacity onPress={toggleMusic} style={styles.settingItem}>
          <Text style={styles.settingText}>Music</Text>
          <Text style={[
            styles.settingValue, 
            musicEnabled ? styles.enabled : styles.disabled
          ]}>
            {musicEnabled ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
        
        {/* Volume Slider */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Volume</Text>
          <View style={styles.volumeContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              onSlidingComplete={handleVolumeChange}
              minimumTrackTintColor="#4444ff"
              maximumTrackTintColor="#333333"
              thumbTintColor="#4444ff"
              step={0.01}
            />
            <Text style={styles.volumeText}>
              {Math.round(volume * 100)}%
            </Text>
          </View>
        </View>
      </View>

      <MenuButton onPress={handleBack} title="BACK TO MENU" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0404',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
  },
  settingsContainer: {
    width: '80%',
    flex: 1,
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 60,
  },
  settingText: {
    color: '#ffffff',
    fontSize: 18,
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 60,
    textAlign: 'center',
  },
  enabled: {
    backgroundColor: '#44ff44',
    color: '#000000',
  },
  disabled: {
    backgroundColor: '#ff4444',
    color: '#ffffff',
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    height: 20, 
  },
  slider: {
    flex: 1,
    height: 20,
    width: 10,
  },
  volumeText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 15,
    minWidth: 45,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;