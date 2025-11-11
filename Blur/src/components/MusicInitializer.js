// components/MusicInitializer.js
import React, { useEffect } from 'react';
import musicService from '../services/MusicService';

const MusicInitializer = ({ children }) => {
  useEffect(() => {
    // Инициализируем музыку при загрузке приложения
    const initMusic = async () => {
      try {
        await musicService.initialize();
      } catch (error) {
        console.log('Music init delayed');
      }
    };

    // Задержка для избежания конфликтов при запуске
    setTimeout(initMusic, 200);
    
    // Очистка при размонтировании компонента
    return () => {
      musicService.destroy();
    };
  }, []);

  return children;
};

export default MusicInitializer;