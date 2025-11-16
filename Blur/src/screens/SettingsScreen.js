import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MenuButton } from '../components/MenuButton';
import musicService from '../services/MusicService';
import soundService from '../services/SoundService';
import { SettingsService } from '../services/SettingsService';
import Slider from '@react-native-community/slider';
const SettingsScreen = ({ navigation }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.8);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(1.0);

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    loadSettings();
  }, []);

  // Применяем настройки звуков при изменении
  useEffect(() => {
    applySoundSettings();
  }, [soundEnabled, soundVolume]);

  // Применяем настройки музыки при изменении
  useEffect(() => {
    applyMusicSettings();
  }, [musicEnabled, musicVolume]);

  const loadSettings = async () => {
    try {
      const settings = await SettingsService.getSettings();
      setSoundEnabled(settings.soundEnabled);
      setSoundVolume(settings.soundVolume);
      setMusicEnabled(settings.musicEnabled);
      setMusicVolume(settings.musicVolume);
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const applyMusicSettings = async () => {
    try {
      // Сохраняем настройки
      await SettingsService.saveSettings({
        soundEnabled,
        soundVolume,
        musicEnabled,
        musicVolume
      });
      
      // Применяем настройки к сервису музыки
      await musicService.setEnabled(musicEnabled);
      await musicService.setVolume(musicVolume);
    } catch (error) {
      console.log('Error applying music settings:', error);
    }
  };

  const applySoundSettings = async () => {
    try {
      // Сохраняем настройки
      await SettingsService.saveSettings({
        soundEnabled,
        soundVolume,
        musicEnabled,
        musicVolume
      });
      
      // Применяем настройки к сервису звуков
      await soundService.setEnabled(soundEnabled);
      await soundService.setVolume(soundVolume);
    } catch (error) {
      console.log('Error applying sound settings:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleMusicVolumeChange = (value) => {
    setMusicVolume(value);
  };

  const handleSoundVolumeChange = (value) => {
    setSoundVolume(value);
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
        
        {/* Music Volume Slider */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Music Volume</Text>
          <View style={styles.volumeContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={musicVolume}
              onValueChange={handleMusicVolumeChange}
              onSlidingComplete={handleMusicVolumeChange}
              minimumTrackTintColor="#4444ff"
              maximumTrackTintColor="#333333"
              thumbTintColor="#4444ff"
              step={0.01}
              disabled={!musicEnabled}
            />
            <Text style={[styles.volumeText, !musicEnabled && styles.disabledText]}>
              {Math.round(musicVolume * 100)}%
            </Text>
          </View>
        </View>

        {/* Sound Toggle */}
        <TouchableOpacity onPress={toggleSound} style={styles.settingItem}>
          <Text style={styles.settingText}>Sound</Text>
          <Text style={[
            styles.settingValue, 
            soundEnabled ? styles.enabled : styles.disabled
          ]}>
            {soundEnabled ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
        
        {/* Sound Volume Slider */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Sound Volume</Text>
          <View style={styles.volumeContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={soundVolume}
              onValueChange={handleSoundVolumeChange}
              onSlidingComplete={handleSoundVolumeChange}
              minimumTrackTintColor="#44ff44"
              maximumTrackTintColor="#333333"
              thumbTintColor="#44ff44"
              step={0.01}
              disabled={!soundEnabled}
            />
            <Text style={[styles.volumeText, !soundEnabled && styles.disabledText]}>
              {Math.round(soundVolume * 100)}%
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 54,
  },
  settingText: {
    color: '#ffffff',
    fontSize: 20,
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 100,
    textAlign: 'center',
  },
  enabled: {
    backgroundColor: '#47e447ff',
    color: '#000000',
  },
  disabled: {
    backgroundColor: '#e44646ff',
    color: '#ffffff',
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 15,
    minWidth: 45,
    textAlign: 'center',
    fontWeight: '600',
  },
  disabledText: {
    color: '#666666',
  },
});

export default SettingsScreen;