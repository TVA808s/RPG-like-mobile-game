// services/BattleEngine.js
class BattleEngine {
  constructor(playerConfig, enemyConfig) {
    this.player = {
      hp: playerConfig.hp || 100,
      maxHp: playerConfig.hp || 100,
      attack: playerConfig.attack || 10,
      name: playerConfig.name || 'Player'
    };
    
    this.enemy = {
      hp: enemyConfig.hp || 80,
      maxHp: enemyConfig.hp || 80,
      attack: enemyConfig.attack || 8,
      name: enemyConfig.name || 'Enemy'
    };
    
    this.round = 1;
    this.isPlayerTurn = true;
    this.isBattleEnded = false;
    this.mercyAvailable = false;
    this.observers = [];
  }

  // Подписка на изменения состояния
  subscribe(observer) {
    this.observers.push(observer);
    // НЕМЕДЛЕННО отправляем текущее состояние новому подписчику
    observer(this.getState());
  }

  notifyObservers() {
    this.observers.forEach(observer => observer(this.getState()));
  }

  getState() {
    return {
      player: { ...this.player },
      enemy: { ...this.enemy },
      round: this.round,
      isPlayerTurn: this.isPlayerTurn,
      isBattleEnded: this.isBattleEnded,
      mercyAvailable: this.mercyAvailable
    };
  }

  // Основные действия
  playerAttack() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;

    const damage = Math.floor(Math.random() * this.player.attack) + 5;
    this.enemy.hp = Math.max(0, this.enemy.hp - damage);
    
    this.endPlayerTurn();
    
    this.notifyObservers();
    return true;
  }

  playerDefend() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;

    this.endPlayerTurn(true);
    
    this.notifyObservers();
    return true;
  }

  playerUseItem() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;

    const heal = Math.floor(Math.random() * 20) + 10;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
    
    this.endPlayerTurn();
    
    this.notifyObservers();
    return true;
  }

  playerMercy() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;

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
      setTimeout(() => this.enemyTurn(isDefending), 1000);
    } else {
      this.endBattle('victory');
    }
  }

  enemyTurn(isPlayerDefending = false) {
    this.round++;
    
    const damage = isPlayerDefending 
      ? Math.floor(Math.random() * (this.enemy.attack / 2)) + 2
      : Math.floor(Math.random() * this.enemy.attack) + 3;
    
    this.player.hp = Math.max(0, this.player.hp - damage);
    
    this.isPlayerTurn = true;
    this.checkMercyCondition();
    
    if (this.player.hp <= 0) {
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
    
    // Можно добавить колбэк для обработки результатов
    if (this.onBattleEnd) {
      this.onBattleEnd(result, this.getState());
    }
  }

  // Для сброса битвы
  resetBattle() {
    this.player.hp = this.player.maxHp;
    this.enemy.hp = this.enemy.maxHp;
    this.round = 1;
    this.isPlayerTurn = true;
    this.isBattleEnded = false;
    this.mercyAvailable = false;
    
    this.notifyObservers();
  }
}

export default BattleEngine;