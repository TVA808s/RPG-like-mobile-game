import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MenuButton } from '../components/MenuButton';

const SettingsScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack(); // Вернуться назад
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>
      
      <ScrollView style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Sound</Text>
          <Text style={styles.settingValue}>ON</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Music</Text>
          <Text style={styles.settingValue}>OFF</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Language</Text>
          <Text style={styles.settingValue}>ENGLISH</Text>
        </View>
      </ScrollView>

      <MenuButton onPress={handleBack} title="BACK TO MENU" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0404',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  settingsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    color: '#ffffff',
    fontSize: 18,
  },
  settingValue: {
    color: '#cccccc',
    fontSize: 16,
  },
});

export default SettingsScreen;