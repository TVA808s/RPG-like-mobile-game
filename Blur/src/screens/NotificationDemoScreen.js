import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  Button,
  Platform,
  StyleSheet
} from 'react-native';
import NotificationService from '../services/NotificationService';

const NotificationDemoScreen = () => {
  const [dailyEnabled, setDailyEnabled] = useState(true);

  useEffect(() => {
    // Включаем ежедневные уведомления при запуске
    if (dailyEnabled) {
      enableDailyNotifications();
    }
  }, []);

  const enableDailyNotifications = async () => {
    try {
      await NotificationService.scheduleDailyNotification(
        'Ежедневное напоминание',
        'Пора играть в вашу любимую игру!'
      );
    } catch (error) {
      console.error('Error enabling daily notifications:', error);
      setDailyEnabled(false);
    }
  };

  const handleTestNotification = async () => {
    await NotificationService.showTestNotification(
      'Тестовое уведомление',
      `Это ${Platform.OS === 'android' ? 'Android-specific' : 'cross-platform'} уведомление`
    );
  };

  const handleDailyToggle = async (value) => {
    setDailyEnabled(value);
    
    if (value) {
      await enableDailyNotifications();
    } else {
      await NotificationService.cancelAllNotifications();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {Platform.OS === 'android' ? 'Android-Specific' : 'Cross-platform'} Notifications
      </Text>

      <View style={styles.statusCard}>
        <Text style={styles.platformText}>Platform: {Platform.OS.toUpperCase()}</Text>
        <Text style={styles.dailyStatus}>
          Daily Notifications: {dailyEnabled ? '✅ ON' : '❌ OFF'}
        </Text>
        <Text style={styles.typeText}>
          Type: {Platform.OS === 'android' 
            ? 'Android-specific (Vibration + Toast)' 
            : 'Cross-platform (Alert)'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Send Test Notification"
          onPress={handleTestNotification}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Daily Notifications</Text>
        <Switch
          value={dailyEnabled}
          onValueChange={handleDailyToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={dailyEnabled ? '#007AFF' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  statusCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Platform.OS === 'android' ? '#4CAF50' : '#007AFF',
  },
  platformText: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  dailyStatus: {
    fontSize: 14,
    marginBottom: 6,
    color: '#666',
  },
  typeText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  switchLabel: {
    fontWeight: '500',
  },
  infoBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Platform.OS === 'android' ? '#e8f5e8' : '#e8f4f8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Platform.OS === 'android' ? '#4CAF50' : '#007AFF',
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: Platform.OS === 'android' ? '#2E7D32' : '#007AFF',
  },
  feature: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
});

export default NotificationDemoScreen;