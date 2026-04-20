// services/PlayerService.js
class PlayerService {
  constructor() {
    this.resetToInitial();
  }

  // Единый метод сброса к начальным значениям
  resetToInitial() {
    // Базовые характеристики (уровень 1)
    this.baseMaxHp = 40;
    this.baseAttack = 22;
    this.baseDefense = 5;
    
    // Система уровней
    this.level = 1;
    this.exp = 0;
    this.baseExpForNextLevel = 40; // Опыт до 2 уровня
    
    // Обновляем характеристики по уровню + восстановление хп
    this.updateStatsByLevel();
    this.hp = this.maxHp;
    this.name = 'Player';
    
    // Статистика
    this.stats = {
      totalBattles: 0,
      enemiesDefeated: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      highestLevelReached: 1
    };
  }

  // Обновление характеристик в зависимости от уровня в 1.25 раза за уровень
  updateStatsByLevel() {
    const multiplier = Math.pow(1.25, this.level - 1);
    this.maxHp = Math.floor(this.baseMaxHp * multiplier);
    this.attack = Math.floor(this.baseAttack * multiplier);
    this.defense = Math.floor(this.baseDefense * multiplier);
  }

  // Следующий уровень требует в 1.5 раз больше опыта
  getExpForNextLevel() {
    return Math.floor(this.baseExpForNextLevel * Math.pow(1.5, this.level - 1));
  }

  // Добавление опыта и проверка повышения уровня
  addExp(amount) {
    const levelsBefore = this.level;
    this.exp += amount;
    const expForNextLevel = this.getExpForNextLevel();
    
    let levelsGained = 0;
    
    while (this.exp >= expForNextLevel) {
      this.level++;
      levelsGained++;
      this.exp -= expForNextLevel;
      this.updateStatsByLevel();
      this.stats.highestLevelReached = Math.max(this.stats.highestLevelReached, this.level);
    }
    
    if (levelsGained > 0) {
      this.hp = this.maxHp;
    }
    
    return levelsGained;
  }

  getPlayer() {
    return {
      hp: this.hp,
      maxHp: this.maxHp,
      defense: this.defense,
      attack: this.attack,
      name: this.name,
      level: this.level,
      exp: this.exp,
      expToNextLevel: this.getExpForNextLevel()
    };
  }

  setHP(value) {
    this.hp = Math.max(0, Math.min(this.maxHp, value));
  }

  takeDamage(damage) {
    this.hp = Math.max(0, this.hp - damage);
    this.stats.totalDamageTaken += damage;
    return damage;
  }

  heal(amount) {
    const actualHeal = Math.min(this.maxHp - this.hp, amount);
    this.hp += actualHeal;
    return actualHeal;
  }

  resetHP() {
    this.hp = this.maxHp;
  }

  // Получить информацию о прогрессе
  getProgress() {
    const expForNextLevel = this.getExpForNextLevel();
    const progress = Math.floor((this.exp / expForNextLevel) * 100);
    
    return {
      level: this.level,
      exp: this.exp,
      expForNextLevel: expForNextLevel,
      progressPercentage: progress,
      stats: {
        hp: this.maxHp,
        attack: this.attack,
        defense: this.defense
      }
    };
  }

  // Статистика
  recordBattleVictory() {
    this.stats.totalBattles++;
    this.stats.enemiesDefeated++;
  }

  recordDamageDealt(amount) {
    this.stats.totalDamageDealt += amount;
  }

  getStats() {
    return { ...this.stats };
  }
}

export default new PlayerService();