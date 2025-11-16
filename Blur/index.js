// index.js
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';

// Регистрируем основное приложение
AppRegistry.registerComponent(appName, () => App);

// Регистрируем сервис для TrackPlayer (ОБЯЗАТЕЛЬНО!)
TrackPlayer.registerPlaybackService(() => require('./src/services/playbackService'));