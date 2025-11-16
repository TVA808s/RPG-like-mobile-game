// index.js
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import soundService from './src/services/SoundService';
AppRegistry.registerComponent(appName, () => App);
soundService.preloadGameSounds();
TrackPlayer.registerPlaybackService(() => require('./src/services/playbackService'));