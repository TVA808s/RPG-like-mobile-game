import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Dimensions, Image } from 'react-native';
import { MenuButton } from '../components/MenuButton';
import ImageService from '../services/ImageService';
import musicService from '../services/MusicService';
const { width, height } = Dimensions.get('window');

const GameScreen = ({ navigation, route }) => {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(80);
  const [mercy, setMercy] = useState(false);
  const [round, setRound] = useState(1);
  const [playerAttack, setPlayerAttack] = useState(10);
  const [enemyAttack, setEnemyAttack] = useState(8);
  const [battleLog, setBattleLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [attackAnim] = useState(new Animated.Value(0));
  const playerHPRef = useRef(playerHP);
  const enemyHPRef = useRef(enemyHP);
  const enemy = route.params?.enemy || { name: 'Enemy', hp: 80, attack: 8 };
  useEffect(() => {
    // Воспроизводим боевую музыку при начале игры
    musicService.playMusic('battle');

    // Возвращаем функцию cleanup для воспроизведения меню-музыки при выходе
    return () => {
      musicService.playMusic('menu');
    };
  }, []);

  useEffect(() => {
    playerHPRef.current = playerHP;
  }, [playerHP]);
  
  useEffect(() => {
    enemyHPRef.current = enemyHP;
  }, [enemyHP]);
  // Проверка условий для милосердия
  useEffect(() => {
    if (enemyHP < enemy.hp * 0.1 || round > 8) {
      setMercy(true);
    }
  }, [enemyHP, round]);

  // Анимация атаки
  const animateAttack = () => {
    Animated.sequence([
      Animated.timing(attackAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(attackAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Игрок атакует
  const handleAttack = () => {
    if (!isPlayerTurn || enemyHPRef.current <= 0) return; // Используем ref
    animateAttack();
    const damage = Math.floor(Math.random() * playerAttack) + 5;
    
    // Используем функциональное обновление
    setEnemyHP(prevHP => {
      const newEnemyHP = Math.max(0, prevHP - damage);
      enemyHPRef.current = newEnemyHP; // Обновляем ref
      return newEnemyHP;
    });
    
    setBattleLog(prev => [`Вы атаковали и нанесли ${damage} урона!`, ...prev]);
    setIsPlayerTurn(false);

    setTimeout(() => {
      if (enemyHPRef.current > 0) { // Используем ref
        enemyTurn();
      }
    }, 1000);
  };

  // Защита
  const handleDefend = () => {
    if (!isPlayerTurn) return;
    
    setBattleLog(prev => ['Вы защитились! Следующая атака врага будет слабее.', ...prev]);
    setIsPlayerTurn(false);
        setTimeout(() => {
      enemyTurn();
    }, 500);
  };

  // Использование предмета
  const handleItem = () => {
    if (!isPlayerTurn) return;

    const heal = Math.floor(Math.random() * 20) + 10;
    
    // Используем функциональное обновление
    setPlayerHP(prevHP => {
      const newPlayerHP = Math.min(100, prevHP + heal);
      playerHPRef.current = newPlayerHP; // Обновляем ref
      return newPlayerHP;
    });
    
    setBattleLog(prev => [`Вы использовали зелье и восстановили ${heal} HP!`, ...prev]);
    setIsPlayerTurn(false);

    setTimeout(() => {
      enemyTurn();
    }, 1000);
  };

  // Пощада
  const handleMercy = () => {
    if (!isPlayerTurn) return;
    
    if (mercy) {
      Alert.alert('Победа!', `Вы пощадили ${enemy.name}!`, [
        { text: 'В меню', onPress: () => navigation.navigate('MenuScreen') }
      ]);
    } else {
      setBattleLog(prev => [`${enemy.name} еще не готов сдаться...`, ...prev]);
      setTimeout(() => {
        enemyTurn();
      }, 500);
    }
  };

  // Ход врага
    const enemyTurn = (isDefending = false) => {
    if (playerHPRef.current <= 0) return; // Используем ref
    setRound(prevRound => prevRound + 1);
    
    const damage = isDefending 
      ? Math.floor(Math.random() * (enemyAttack / 2)) + 2
      : Math.floor(Math.random() * enemyAttack) + 3;
    
    // Используем функциональное обновление
    setPlayerHP(prevHP => {
      const newPlayerHP = Math.max(0, prevHP - damage);
      playerHPRef.current = newPlayerHP; // Обновляем ref
      return newPlayerHP;
    });
    
    setBattleLog(prev => [
      `${enemy.name} атаковал и нанес ${damage} урона!`, 
      ...prev
    ]);
    setIsPlayerTurn(true);
  };

  // Проверка конца битвы
  useEffect(() => {
    if (playerHP <= 0) {
      Alert.alert('Поражение!', 'Вы проиграли битву.', [
        { text: 'В меню', onPress: () => navigation.navigate('MenuScreen') }
      ]);
    } else if (enemyHP <= 0) {
      Alert.alert('Победа!', 'Вы победили врага!', [
        { text: 'В меню', onPress: () => navigation.navigate('MenuScreen') }
      ]);
    }
  }, [playerHP, enemyHP]);

  // Получаем изображения
  const playerImage = ImageService.getImage('player');
  const enemyImage = ImageService.getImage('enemy');
  const backgroundImage = ImageService.getImage('battle_bg');
  return (
    <View style={styles.container}>
      {/* Раунд */}
      <Text style={styles.roundText}>РАУНД: {round}</Text>
      
      {/* Арена */}
      <View style={styles.battleArena}>
        {/* Игрок */}
        <View style={styles.playerSection}>
          <Text style={styles.playerName}>Player</Text>
          {playerImage ? (
            <Image 
              source={playerImage} 
              style={styles.characterSprite}
            />
          ) : (
            <Text style={styles.placeholderText}>Player Image</Text>
          )}
          <View style={styles.hpBar}>
            <View style={[styles.hpFill, { width: `${(playerHP / 100) * 100}%` }]} />
          </View>
          <Text style={styles.hpText}>HP: {playerHP}/100</Text>
        </View>

        {/* Противник */}
        <View style={styles.enemySection}>
          <Text style={mercy ? styles.mercyEnemyName : styles.enemyName}>
            {enemy.name}
          </Text>
          {enemyImage ? (
            <Image 
              source={enemyImage} 
              style={[styles.characterSprite, { transform: [{ scaleX: -1 }]}]}
            />
          ) : (
            <Text style={styles.placeholderText}>Enemy Image</Text>
          )}
          <View style={styles.hpBar}>
            <View style={[styles.hpFill, { width: `${(enemyHP / enemy.hp) * 100}%` }]} />
          </View>
          <Text style={styles.hpText}>HP: {enemyHP}/{enemy.hp}</Text>
        </View>
      </View>

      {/* Меню боя */}
      <View style={styles.battleMenu}>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, !isPlayerTurn && styles.disabledButton]} 
            onPress={handleAttack}
            disabled={!isPlayerTurn}
          >
            <Text style={styles.actionText}>⚔️ АТАКА</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, !isPlayerTurn && styles.disabledButton]} 
            onPress={handleDefend}
            disabled={!isPlayerTurn}
          >
            <Text style={styles.actionText}>🛡️ ЗАЩИТА</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, !isPlayerTurn && styles.disabledButton]} 
            onPress={handleItem}
            disabled={!isPlayerTurn}
          >
            <Text style={styles.actionText}>🧪 ПРЕДМЕТ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, !isPlayerTurn && styles.disabledButton]}
            onPress={handleMercy}
            disabled={!isPlayerTurn}
          >
            <Text style={styles.actionText}>❤️ ПОЩАДА</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  roundText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  battleArena: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  enemySection: {
    alignItems: 'center',
    width: '40%',
  },
  enemyName: {
    color: '#ff4444',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mercyEnemyName: {
    color: '#fff959',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerSection: {
    alignItems: 'center',
    width: '40%',
  },
  playerName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  characterSprite: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    width: 100,
    height: 100,
    lineHeight: 100,
    backgroundColor: '#333',
  },
  hpBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 6,
    marginVertical: 5,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    backgroundColor: '#44ff44',
    borderRadius: 6,
  },
  hpText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  battleMenu: {
    marginTop: 'auto',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4444ff',
    padding: 12,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#666666',
    opacity: 0.5,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;