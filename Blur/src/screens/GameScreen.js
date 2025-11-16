// screens/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MusicService from '../services/MusicService';
import BattleService from '../services/BattleService';
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
      
      const enemy = route.params?.enemy || { 
        name: 'Enemy', 
        hp: 80, 
        attack: 8 
      };
      
      const playerConfig = { 
        hp: 100, 
        attack: 10, 
        name: 'Player' 
      };
      
      // Создаем новую битву
      battleEngineRef.current = BattleService.startNewBattle(playerConfig, enemy);
      
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
      // Отписываемся от событий (если в BattleEngine есть метод unsubscribe)
      if (battleEngineRef.current.unsubscribe) {
        // Нужно передать ту же функцию, что и в subscribe
        // Для этого нужно хранить ссылку на функцию-обработчик
      }
      BattleService.endCurrentBattle();
    }
    MusicService.playMusic('menu');
  };

  const handleBattleEnd = (result, state) => {
    console.log('Battle ended with result:', result);
    
    const messages = {
      victory: { 
        title: 'Победа!', 
        message: 'Вы победили врага!' 
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

  // Обработчики действий
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
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={initializeBattle}
        >
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
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
  retryButton: {
    backgroundColor: '#4444ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default GameScreen;