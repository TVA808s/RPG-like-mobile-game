// services/BattleEngine.js
import PlayerService from './PlayerService';
import soundService from './SoundService';
class BattleEngine {
  constructor(enemy) {
    // Принимаем готового врага вместо конфига
    this.enemy = {
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      defense: enemy.defense,
      attack: enemy.attack,
      name: enemy.name,
      image: enemy.image
    };
    
    this.round = 1;
    this.isPlayerTurn = true;
    this.isBattleEnded = false;
    this.mercyAvailable = false;
    this.observers = [];
    this.lastDamage = 0;
    this.lastIsCritical = false;
  }

  // Подписка на изменения состояния
  subscribe(observer) {
    this.observers.push(observer);
    observer(this.getState());
  }

  notifyObservers() {
    this.observers.forEach(observer => observer(this.getState()));
  }

  getState() {
    return {
      player: PlayerService.getPlayer(),
      enemy: { ...this.enemy },
      round: this.round,
      isPlayerTurn: this.isPlayerTurn,
      isBattleEnded: this.isBattleEnded,
      mercyAvailable: this.mercyAvailable,
      lastDamage: this.lastDamage,
      lastIsCritical: this.lastIsCritical
    };
  }

  // Основные действия
  playerAttack() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;

    const player = PlayerService.getPlayer();
    soundService.playSound('player.attack')
    // Формула урона: базовый урон * рандом (0.5 - 1.2)
    const baseDamage = player.attack;
    const randomMultiplier = 0.5 + Math.random() * 0.7;
    let damage = baseDamage * randomMultiplier;
    
    // Проверка на критический удар (~ 7% шанс)
    const isCritical = Math.random() < 0.07;
    if (isCritical) {
      damage *= 1.6;
    }
    
    // Учитываем защиту врага
    damage = Math.max(1, damage - this.enemy.defense);
    damage = Math.floor(damage);
    
    this.enemy.hp = Math.max(0, this.enemy.hp - damage);
 
    this.lastDamage = damage;
    this.lastIsCritical = isCritical;
    
    this.endPlayerTurn();
    
    this.notifyObservers();
    return true;
  }

  playerDefend() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;
    soundService.playSound('player.shield');
    this.lastDamage = 0;
    this.lastIsCritical = false;
    
    this.endPlayerTurn(true);
    
    this.notifyObservers();
    return true;
  }

  playerUseItem() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;
    soundService.playSound('player.heal');
    const heal = Math.floor(Math.random() * 20) + 8;
    PlayerService.heal(heal);
    
    this.lastDamage = 0;
    this.lastIsCritical = false;
    
    this.endPlayerTurn();
    
    this.notifyObservers();
    return true;
  }

  playerMercy() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;
    soundService.playSound('player.mercy');
    this.lastDamage = 0;
    this.lastIsCritical = false;

    if (this.mercyAvailable) {
      this.endBattle('mercy');
      return true;
    } else {
      this.endPlayerTurn();
      
      this.notifyObservers();
      return false;
    }
  }

  // Вспомогательные методы
  endPlayerTurn(isDefending = false) {
    this.isPlayerTurn = false;
    
    if (this.enemy.hp > 0) {
      setTimeout(() => this.enemyTurn(isDefending), 600);
    } else {
      soundService.playSound('enemy.death');
      this.endBattle('victory');
    }
  }

  enemyTurn(isPlayerDefending = false) {
    this.round++;

    const playerBefore = PlayerService.getPlayer();
    soundService.playSound('player.hit');
    let damage = isPlayerDefending 
      ? Math.floor((0.8 + Math.random() * 0.7) * this.enemy.attack) - Math.floor(playerBefore.defense * 1.4)
      : Math.floor((0.8 + Math.random() * 0.7) * this.enemy.attack);
    
    PlayerService.takeDamage(damage);
    
    this.isPlayerTurn = true;
    this.checkMercyCondition();
    
    const playerAfter = PlayerService.getPlayer();
    if (playerAfter.hp < 1) {
      soundService.playSound('player.death');
      this.endBattle('defeat');
    }
    
    this.notifyObservers();
  }

  checkMercyCondition() {
    this.mercyAvailable = this.enemy.hp < this.enemy.maxHp * 0.1 || this.round > 8;
  }

  endBattle(result) {
    this.isBattleEnded = true;
    this.notifyObservers();
    
    if (this.onBattleEnd) {
      this.onBattleEnd(result, this.getState());
    }
  }

  // Для сброса битвы
  resetBattle() {
    this.enemy.hp = this.enemy.maxHp;
    this.round = 1;
    this.isPlayerTurn = true;
    this.isBattleEnded = false;
    this.mercyAvailable = false;
    this.lastDamage = 0;
    this.lastIsCritical = false;
    
    this.notifyObservers();
  }
}

export default BattleEngine;