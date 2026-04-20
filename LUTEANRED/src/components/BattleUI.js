// components/BattleUI.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { CustomButton } from './CustomButton';
import ImageService from '../services/ImageService';
import Sword from '../assets/icons/BloodySword.svg';
import Shield from '../assets/icons/BxsShieldAlt2.svg';
import Item from '../assets/icons/GarbageResidual.svg';
import Mercy from '../assets/icons/WindySnow.svg';

const BattleUI = ({ 
  battleState, 
  onAttack, 
  onDefend, 
  onItem, 
  onMercy,
  totalBattles,
  getDifficultyByLevel
}) => {
  const [attackAnim] = useState(new Animated.Value(0));
  const [levelUpAnim] = useState(new Animated.Value(0));
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelsGained, setLevelsGained] = useState(0);
  
  const { player, enemy, round, isPlayerTurn, mercyAvailable, levelProgress, levelsGained: currentLevelsGained } = battleState;
  
  // Использование изображений
  const playerImage = ImageService.getImage('player');
  const enemyImage = ImageService.getImage(enemy.image);
  
  // Определяем сложность на основе уровня игрока
  const difficulty = getDifficultyByLevel ? getDifficultyByLevel(player.level) : 'easy';
  
  
  // Эффект для отображения уведомления о повышении уровня
  useEffect(() => {
    if (currentLevelsGained > 0) {
      setLevelsGained(currentLevelsGained);
      setShowLevelUp(true);
      
      // Анимация появления
      Animated.timing(levelUpAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Автоматическое скрытие через 1.5 секунды
      setTimeout(() => {
        Animated.timing(levelUpAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowLevelUp(false);
        });
      }, 1500);
    }
  }, [currentLevelsGained]);
  
  // Простая анимация атаки
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

  const handleAttack = () => {
    animateAttack();
    onAttack();
  };

  const animatedStyle = {
    transform: [
      {
        translateX: attackAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20]
        })
      }
    ]
  };

  const levelUpStyle = {
    opacity: levelUpAnim,
    transform: [
      {
        translateY: levelUpAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10]
        })
      }
    ]
  };

  return (
    <View style={styles.container}>
      
      {/* Панель статистики */}
      <View style={styles.statsBar}>
        <View style={styles.statsRow}>

          {/* Прогресс уровня */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Уровень {player.level}</Text>
            <Text style={styles.expText}>
                Опыт: {levelProgress.exp}/{levelProgress.expForNextLevel}
              </Text>
              <View style={styles.expBar}>
                <View style={[styles.expFill, { 
                  width: `${levelProgress.progressPercentage}%` 
                }]} />
              </View>
              {battleState.expGained > 0 && battleState.isBattleEnded && (
            <Text style={styles.expGainedText}>
              +{battleState.expGained} опыта
            </Text>
          )}
          </View>

          <Text style={styles.difficultyText}>
            Сложность: {difficulty.toUpperCase()}
          </Text>
        </View>
        
        
      </View>

      <View style={styles.battleArena}>
        {/* Игрок */}
        <View style={styles.playerSection}>
          <Text style={styles.playerName}>
            {player.name}
          </Text>
          <View style={styles.playerImageContainer}>
            {playerImage ? (
              <Animated.Image 
                source={playerImage} 
                style={[styles.characterSprite, animatedStyle]}
              />
            ) : (
              <Text style={styles.placeholderText}>Player Image</Text>
            )}
            {/* Уведомление о повышении уровня */}
            {showLevelUp && (
              <Animated.Text style={[styles.levelUpText, levelUpStyle]}>
                +{levelsGained} lvl
              </Animated.Text>
            )}
          </View>
          <HPBar current={player.hp} max={player.maxHp} />
          <Text style={styles.hpText}>HP: {player.hp}/{player.maxHp}</Text>
        </View>

        {/* Противник */}
        <View style={styles.enemySection}>
          <Text style={mercyAvailable ? styles.mercyEnemyName : styles.enemyName}>
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
          <HPBar current={enemy.hp} max={enemy.maxHp} />
          <Text style={styles.hpText}>HP: {enemy.hp}/{enemy.maxHp}</Text>
        </View>
      </View>

      {/* Меню действий с CustomButton*/}
      <View style={styles.battleMenu}>
        <View style={styles.actions}>
          <CustomButton
            title="АТАКА"
            onPress={handleAttack}
            disabled={!isPlayerTurn}
            variant="attack"
            icon={Sword}
          />
          <CustomButton
            title="ЗАЩИТА"
            onPress={onDefend}
            disabled={!isPlayerTurn}
            variant="defend"
            icon={Shield}
          />
          <CustomButton
            title="ПРЕДМЕТ"
            onPress={onItem}
            disabled={!isPlayerTurn}
            variant="item"
            icon={Item}
          />

          <CustomButton
            title="ПОЩАДА"
            onPress={onMercy}
            disabled={!isPlayerTurn}
            variant="mercy"
            icon={Mercy}
            canMercy={mercyAvailable}
          />
        </View>
      </View>
    </View>
  );
};

// Компонент полоски HP
const HPBar = ({ current, max }) => (
  <View style={styles.hpBar}>
    <View style={[styles.hpFill, { width: `${(current / max) * 100}%` }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  statsBar: {
    paddingHorizontal: 10,
    backgroundColor: '#000000ff',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  difficultyText: {
    color: '#dfc531ff',
    fontSize: 14,
    fontWeight: '600',
  },
  levelInfo: {
    flexDirection: 'row',
    width: '10%',
    gap: 20,
    alignItems: 'center',

  },
  levelText: {
    color: '#dfc531ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  expContainer: {
    width: '100%',
    alignItems: 'center',
  },
  expText: {
    color: '#87ceeb',
    fontSize: 14,
    marginBottom: 3,
  },
  expBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  expFill: {
    height: '100%',
    backgroundColor: '#87ceeb',
    borderRadius: 3,
  },
  battleArena: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerSection: {
    alignItems: 'center',
    width: '40%',
  },
  playerImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  levelUpText: {
    position: 'absolute',
    left: 130,
    top: 60,
    color: '#dfc531ff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  enemySection: {
    alignItems: 'center',
    width: '40%',
  },
  enemyName: {
    color: '#ffc0c0ff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mercyEnemyName: {
    color: '#f05f8fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerName: {
    color: 'white',
    fontSize: 18,
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
  statsText: {
    color: '#cccccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 3,
  },
  expGainedText: {
    color: '#87ceeb',
    fontSize: 12,
    fontWeight: 'bold',
  },
  battleMenu: {
    marginTop: 'auto',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default BattleUI;