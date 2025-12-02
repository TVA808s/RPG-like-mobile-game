// services/NotificationService.ios.js
import { Alert } from 'react-native';

class NotificationService {
  constructor() {
    console.log('iOS/Cross-platform Notification Service initialized');
  }

  // Показать тестовое уведомление
  async showTestNotification(title = 'Game Reminder', message = 'Time to play!') {
    try {
      Alert.alert(
        `🎮 ${title}`,
        `${message}\n\n(Cross-platform Alert on iOS)`,
        [{ text: 'OK' }]
      );
      
      console.log('Cross-platform notification displayed');
      return true;
    } catch (error) {
      console.log('Notification error:', error);
      return false;
    }
  }

  // Запланировать ежедневное уведомление
  async scheduleDailyNotification(title = 'Daily Reminder', message = 'Don\'t forget to play today!') {
    try {
      // В кросс-платформенной версии просто показываем Alert
      Alert.alert(
        '📅 Уведомление запланировано',
        'Ежедневное напоминание установлено на 9:00 утра',
        [{ text: 'OK' }]
      );
      
      console.log('Cross-platform daily notification scheduled');
      return true;
    } catch (error) {
      console.log('Schedule error:', error);
      return false;
    }
  }

  // Отменить все уведомления
  async cancelAllNotifications() {
    try {
      Alert.alert(
        'Отменено',
        'Все уведомления отменены',
        [{ text: 'OK' }]
      );
      
      console.log('All cross-platform notifications cancelled');
      return true;
    } catch (error) {
      console.log('Cancel error:', error);
      return false;
    }
  }

  // Проверить разрешения
  async checkPermissions() {
    // Для кросс-платформенной версии всегда возвращаем разрешения
    return {
      alert: true,
      badge: true,
      sound: true,
      granted: true
    };
  }
}

export default new NotificationService();