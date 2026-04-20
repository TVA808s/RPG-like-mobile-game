// services/BattleEngine.js
import PlayerService from './PlayerService';
import soundService from './SoundService';

class BattleEngine {
  constructor(enemy) {
    this.enemy = {
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      defense: enemy.defense,
      attack: enemy.attack,
      name: enemy.name,
      image: enemy.image,
      exp: enemy.exp || 0
    };
    
    this.round = 1;
    this.isPlayerTurn = true;
    this.isBattleEnded = false;
    this.mercyAvailable = false;
    
    // observer для уведомлений о изменениях состояния
    this.observers = [];
    
    this.lastDamage = 0;
    this.lastIsCritical = false;
    this.expGained = 0;
    this.levelsGained = 0;
  }

  // Используется UI компонентами для получения обновлений
  subscribe(observer) {
    this.observers.push(observer);
    // Немедленно отправляем текущее состояние новому подписчику
    observer(this.getState());
  }

  // Уведомление всех подписчиков об изменениях
  notifyObservers() {
    this.observers.forEach(observer => observer(this.getState()));
  }

  // Возвращает полное состояние битвы для подписчиков
  getState() {
    const player = PlayerService.getPlayer();
    return {
      player: player,
      enemy: { ...this.enemy }, // копия чтобы избежать мутаций
      round: this.round,
      isPlayerTurn: this.isPlayerTurn,
      isBattleEnded: this.isBattleEnded,
      mercyAvailable: this.mercyAvailable,
      lastDamage: this.lastDamage,
      lastIsCritical: this.lastIsCritical,
      expGained: this.expGained,
      levelsGained: this.levelsGained,
      levelProgress: PlayerService.getProgress()
    };
  }

  // Вычисления урона игрока с элементами случайности
  calculatePlayerDamage() {
    const player = PlayerService.getPlayer();
    
    // Базовая формула урона игрока с вариативностью ±30%
    const baseDamage = player.attack;
    const randomMultiplier = 0.6 + Math.random() * 0.7; 
    let damage = baseDamage * randomMultiplier;
    
    // Критический удар с шансом 8%
    const isCritical = Math.random() < 0.08;
    if (isCritical) {
      damage *= 1.7; // +70% урона при критическом ударе
    }
    
    // Учитываем защиту врага, минимальный урон = 1
    damage = Math.max(1, Math.floor(damage - this.enemy.defense));
    
    return { damage, isCritical };
  }

  // Вычисления урона врага
  calculateEnemyDamage(isPlayerDefending = false) {
    const player = PlayerService.getPlayer();
    
    // Базовая формула урона врага
    let damage = Math.floor((0.6 + Math.random() * 0.7) * this.enemy.attack);
    
    if (isPlayerDefending) {
      // При защите показатель брони увеличивается в 2.2 раза
      damage = Math.max(1, Math.floor(damage - player.defense * 2.2));
    } else {
      // Без защиты обычный расчет
      damage = Math.max(1, Math.floor(damage - player.defense));
    }
    
    return damage;
  }

  // Основные действия игрока
  playerAttack() {
    if (!this.isPlayerTurn || this.isBattleEnded) return false;

    soundService.playSound('player.attack');
    
    // Расчет урона
    const { damage, isCritical } = this.calculatePlayerDamage();
    
    // Применяем урон врагу
    this.enemy.hp = Math.max(0, this.enemy.hp - damage);
 
    this.lastDamage = damage;
    this.lastIsCritical = isCritical;
    
    // Записываем статистику
    PlayerService.recordDamageDealt(damage);
    
    this.endPlayerTurn();
    // Уведомляем UI об изменении состояния
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
    
    // Лечение с случайным значением от 12 до 27
    const heal = Math.floor(Math.random() * 16) + 12;
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
      // Задержка перед ходом врага для лучшего UX
      setTimeout(() => this.enemyTurn(isDefending), 500);
    } else {
      soundService.playSound('enemy.death');
      this.endBattle('victory');
    }
  }

  enemyTurn(isPlayerDefending = false) {
    this.round++;
    soundService.playSound('player.hit');
    
    // Расчет урона врага 
    const damage = this.calculateEnemyDamage(isPlayerDefending);
    
    // Применяем урон игроку
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

  // Условие для возможности пощады
  checkMercyCondition() {
    // Можно пощадить когда у врага меньше 10% HP или прошло больше 7 раундов
    this.mercyAvailable = this.enemy.hp < this.enemy.maxHp * 0.1 || this.round > 7;
  }

  endBattle(result) {
    this.isBattleEnded = true;
    
    // Начисляем опыт только при победе или пощаде
    if ((result === 'victory' || result === 'mercy') && this.enemy.exp) {
      this.expGained = this.enemy.exp;
      this.levelsGained = PlayerService.addExp(this.expGained);
      PlayerService.recordBattleVictory();
    }
    
    this.notifyObservers();
    
    // Колбэк для внешних обработчиков (навигация, анимации и т.д.)
    if (this.onBattleEnd) {
      this.onBattleEnd(result, this.getState());
    }
  }

  // Для сброса битвы (рестарт)
  resetBattle() {
    this.enemy.hp = this.enemy.maxHp;
    this.round = 1;
    this.isPlayerTurn = true;
    this.isBattleEnded = false;
    this.mercyAvailable = false;
    this.lastDamage = 0;
    this.lastIsCritical = false;
    this.expGained = 0;
    this.levelsGained = 0;
    
    this.notifyObservers();
  }
}

export default BattleEngine;