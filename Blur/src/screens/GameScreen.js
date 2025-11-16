// screens/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MusicService from '../services/MusicService';
import BattleService from '../services/BattleService';
import PlayerService from '../services/PlayerService';
import EnemyService from '../services/EnemyService';
import BattleUI from '../components/BattleUI';

const GameScreen = ({ navigation, route }) => {
  const [battleState, setBattleState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const battleEngineRef = useRef(null);

  useEffect(() => {
    initializeBattle();
    
    return () => {
      cleanupBattle();
    };
  }, []);

  const initializeBattle = () => {
    try {
      setIsLoading(true);
      
      // Получаем врага из EnemyService
      // const enemyType = route.params?.enemyType || 'skeleton';
      const enemy = EnemyService.getEnemiesByDifficulty('easy');
      
      // Сбрасываем состояние игрока перед началом битвы
      PlayerService.reset();
      
      // Создаем новую битву с выбранным врагом
      battleEngineRef.current = BattleService.startNewBattle(enemy);
      
      // Подписываемся на изменения
      battleEngineRef.current.subscribe((newState) => {
        console.log('Battle state updated:', newState);
        setBattleState(newState);
        setIsLoading(false);
      });
      
      // Настраиваем обработчик окончания битвы
      battleEngineRef.current.onBattleEnd = handleBattleEnd;

      // Запускаем музыку
      MusicService.playMusic('battle');
      
    } catch (error) {
      console.error('Error initializing battle:', error);
      setIsLoading(false);
      Alert.alert('Ошибка', 'Не удалось начать битву', [
        { text: 'В меню', onPress: () => navigation.navigate('MenuScreen') }
      ]);
    }
  };

  const cleanupBattle = () => {
    if (battleEngineRef.current) {
      BattleService.endCurrentBattle();
    }
    MusicService.playMusic('menu');
  };

  const handleBattleEnd = (result, state) => {
    console.log('Battle ended with result:', result);
    
    const messages = {
      victory: { 
        title: 'Победа!', 
        message: `Вы победили ${state.enemy.name}!` 
      },
      defeat: { 
        title: 'Поражение!', 
        message: 'Вы проиграли битву.' 
      },
      mercy: { 
        title: 'Победа!', 
        message: `Вы пощадили ${state.enemy.name}!` 
      }
    };

    const message = messages[result];
    if (message) {
      Alert.alert(message.title, message.message, [
        { 
          text: 'В меню', 
          onPress: () => navigation.navigate('MenuScreen') 
        }
      ]);
    }
  };

  // Обработчики действий (без изменений)
  const handleAttack = () => {
    if (battleEngineRef.current) {
      battleEngineRef.current.playerAttack();
    }
  };

  const handleDefend = () => {
    if (battleEngineRef.current) {
      battleEngineRef.current.playerDefend();
    }
  };

  const handleItem = () => {
    if (battleEngineRef.current) {
      battleEngineRef.current.playerUseItem();
    }
  };

  const handleMercy = () => {
    if (battleEngineRef.current) {
      battleEngineRef.current.playerMercy();
    }
  };

  // Состояние загрузки
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка битвы...</Text>
      </View>
    );
  }

  // Состояние ошибки
  if (!battleState) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ошибка загрузки битвы</Text>
      </View>
    );
  }

  // Основной интерфейс битвы
  return (
    <BattleUI
      battleState={battleState}
      onAttack={handleAttack}
      onDefend={handleDefend}
      onItem={handleItem}
      onMercy={handleMercy}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
});

export default GameScreen;