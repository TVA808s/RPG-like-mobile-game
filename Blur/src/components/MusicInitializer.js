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


    
    // Очистка при размонтировании компонента
    return () => {
      musicService.cleanup(); // Используем cleanup вместо destroy
    };
  }, []);

  return children;
};

export default MusicInitializer;