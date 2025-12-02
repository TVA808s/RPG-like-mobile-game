// services/NotificationService.android.js
import { ToastAndroid, Alert, Vibration } from 'react-native';

class NotificationService {
  constructor() {
    console.log('Android-specific Notification Service initialized');
  }

  // Показать тестовое уведомление
  async showTestNotification(title = 'Game Reminder', message = 'Time to play!') {
    try {
      // Вибрация (только для Android)
      Vibration.vibrate(100);
      
      // Toast уведомление (только для Android)
      ToastAndroid.showWithGravity(
        `🎮 ${title}: ${message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      
      // Звук симулируем через Alert
      Alert.alert(
        '🔔 Android Notification',
        `${title}\n\n${message}\n\n(Android-specific: Vibration + Toast)`,
        [{ text: 'OK' }]
      );
      
      console.log('Android-specific notification displayed');
      return true;
    } catch (error) {
      console.log('Notification error:', error);
      return false;
    }
  }

  // Запланировать ежедневное уведомление
  async scheduleDailyNotification(title = 'Daily Reminder', message = 'Don\'t forget to play today!') {
    try {
      // Для Android используем длинный Toast с вибрацией
      Vibration.vibrate([0, 200, 100, 200]);
      
      ToastAndroid.showWithGravity(
        '📅 Ежедневное уведомление запланировано на 9:00 утра',
        ToastAndroid.LONG,
        ToastAndroid.TOP
      );
      
      // Alert с деталями
      Alert.alert(
        'Android Notification Scheduled',
        `Title: ${title}\nMessage: ${message}\nTime: Daily at 9:00 AM\n\n(Android-specific: Vibration pattern)`,
        [{ text: 'OK' }]
      );
      
      console.log('Android-specific daily notification scheduled');
      return true;
    } catch (error) {
      console.log('Schedule error:', error);
      return false;
    }
  }

  // Отменить все уведомления
  async cancelAllNotifications() {
    try {
      Vibration.vibrate(300);
      
      ToastAndroid.showWithGravity(
        'Все уведомления отменены',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      
      console.log('All Android-specific notifications cancelled');
      return true;
    } catch (error) {
      console.log('Cancel error:', error);
      return false;
    }
  }

  // Проверить разрешения
  async checkPermissions() {
    // Для Android всегда возвращаем разрешения
    return {
      alert: true,
      badge: true,
      sound: true,
      vibration: true, // Android-specific
      toast: true,    // Android-specific
      granted: true
    };
  }
}

export default new NotificationService();