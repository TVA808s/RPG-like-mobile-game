// services/NotificationService/index.js
import { Platform } from 'react-native';

// Автоматический выбор реализации по платформе
const NotificationService = Platform.select({
  ios: () => require('./NotificationService.ios').default,
  android: () => require('./NotificationService.android').default,
})();

export default NotificationService;