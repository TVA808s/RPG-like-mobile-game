// screens/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Animated } from 'react-native';
import MusicService from '../services/MusicService';
import BattleService from '../services/BattleService';
import PlayerService from '../services/PlayerService';
import EnemyService from '../services/EnemyService';
import BattleUI from '../components/BattleUI';

const GameScreen = ({ navigation, route }) => {
  const [battleState, setBattleState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBattles, setTotalBattles] = useState(0);
  const [victoryMessage, setVictoryMessage] = useState(null);
  const battleEngineRef = useRef(null);

  useEffect(() => {
    initializeGame();
    
    return () => {
      cleanupBattle();
    };
  }, []);

  const initializeGame = () => {
    try {
      setIsLoading(true);
      
      // Сбрасываем состояние игрока только если это новая игра
      if (!route.params?.continueGame) {
        PlayerService.resetToInitial();
      }
      
      // Начинаем первую битву
      startNewBattle();
      
      // Запускаем музыку
      MusicService.playMusic('battle');
      
    } catch (error) {
      console.error('Error initializing game:', error);
      setIsLoading(false);
      Alert.alert('Ошибка', 'Не удалось начать игру', [
        { text: 'В меню', onPress: () => navigation.navigate('MenuScreen') }
      ]);
    }
  };

  const getDifficultyByLevel = (playerLevel) => {
    if (playerLevel >= 5) return 'hard';
    if (playerLevel >= 3) return 'medium';
    return 'easy';
  };

  const startNewBattle = () => {
    try {
      setIsLoading(true);
      
      // Получаем текущий уровень игрока для определения сложности
      const player = PlayerService.getPlayer();
      const difficulty = getDifficultyByLevel(player.level);
      
      // Получаем врага соответствующей сложности
      const enemy = EnemyService.getEnemiesByDifficulty(difficulty);
      
      // Создаем новую битву с выбранным врагом
      battleEngineRef.current = BattleService.startNewBattle(enemy);
      
      // Подписываемся на изменения
      battleEngineRef.current.subscribe((newState) => {
        setBattleState(newState);
        setIsLoading(false);
      });
      
      // Настраиваем обработчик окончания битвы
      battleEngineRef.current.onBattleEnd = handleBattleEnd;

      // Обновляем счетчик битв
      setTotalBattles(BattleService.getTotalBattles());
      
      // Сбрасываем сообщение о победе
      setVictoryMessage(null);
      
    } catch (error) {
      console.error('Error starting new battle:', error);
      setIsLoading(false);
    }
  };

  const showVictoryMessage = (enemyName) => {
    setVictoryMessage(`${enemyName} побежден!`);
    
    // Автоматически скрываем сообщение через 2 секунды
    setTimeout(() => {
      setVictoryMessage(null);
    }, 1500);
  };



  const handleBattleEnd = (result, state) => {
    console.log('Battle ended with result:', result);
    

    switch (result) {
      case 'victory':
      case 'mercy':
        // Победа - показываем сообщение и начинаем новую битву
        showVictoryMessage(state.enemy.name);
        
        // Начинаем новую битву после небольшой задержки
        setTimeout(() => {
          startNewBattle();
        }, 1500);
        break;
        
      case 'defeat':
        // Поражение - показываем итоги и возвращаем в меню
        setTimeout(() => {
          showGameOverStats();
        }, 1500);
        break;
    }
  };

  const showGameOverStats = () => {
    const player = PlayerService.getPlayer();
    const battles = BattleService.getTotalBattles();
    const stats = PlayerService.getStats();
    
    Alert.alert(
      'Игра окончена!', 
      `Вы достигли ${player.level} уровня и провели ${battles} битв!\n\n` +
      `Побеждено врагов: ${stats.enemiesDefeated}\n` +
      `Нанесено урона: ${stats.totalDamageDealt}\n` +
      `Получено урона: ${stats.totalDamageTaken}\n\n` +
      `Ваши финальные характеристики:\n` +
      `❤️ HP: ${player.maxHp}\n` +
      `⚔️ Атака: ${player.attack}\n` +
      `🛡️ Защита: ${player.defense}`,
      [
        { 
          text: 'В меню', 
          onPress: () => navigation.navigate('MenuScreen') 
        },
        {
          text: 'Начать заново',
          onPress: () => {
            // ПОЛНЫЙ СБРОС ВСЕХ СЕРВИСОВ
            PlayerService.resetToInitial();
            BattleService.reset();
            initializeGame();
          }
        }
      ]
    );
  };

  const cleanupBattle = () => {
    if (battleEngineRef.current) {
      BattleService.endCurrentBattle();
    }
    MusicService.playMusic('menu');
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
  if (isLoading || !battleState) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {isLoading ? 'Загрузка битвы...' : 'Подготовка к битве...'}
        </Text>
      </View>
    );
  }

  // Основной интерфейс битвы
  return (
    <View style={styles.container}>
      
      {/* Сообщение о победе */}
      {victoryMessage && (
        <View style={styles.victoryMessage}>
          <Text style={styles.victoryText}>{victoryMessage}</Text>
        </View>
      )}

      <BattleUI
        battleState={battleState}
        onAttack={handleAttack}
        onDefend={handleDefend}
        onItem={handleItem}
        onMercy={handleMercy}
        totalBattles={totalBattles}
        getDifficultyByLevel={getDifficultyByLevel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  victoryMessage: {
    position: 'absolute',
    top: '30%',
    width: '20%',
    alignSelf: 'center',
    zIndex: 1,
  },
  victoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default GameScreen;