// components/BattleUI.js
import React, { useState } from 'react';
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
  onMercy
}) => {
  const [attackAnim] = useState(new Animated.Value(0));
  const { player, enemy, round, isPlayerTurn, mercyAvailable } = battleState;
  const playerImage = ImageService.getImage('player');
  const enemyImage = ImageService.getImage(enemy.image);

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

  return (
    <View style={styles.container}>
      
      <View style={styles.battleArena}>
        {/* Игрок */}
        <View style={styles.playerSection}>
          <Text style={styles.playerName}>{player.name}</Text>
          {playerImage ? (
            <Animated.Image 
              source={playerImage} 
              style={[styles.characterSprite, animatedStyle]}
            />
          ) : (
            <Text style={styles.placeholderText}>Player Image</Text>
          )}
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
            canMercy={mercyAvailable} // Активирует mercy цветовой режим
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
  playerSection: {
    alignItems: 'center',
    width: '40%',
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