// services/PlayerService.js
class PlayerService {
  constructor() {
    this.hp = 40;
    this.maxHp = 40;
    this.defense = 5;
    this.attack = 22;
    this.name = 'Player';
  }

  getPlayer() {
    return {
      hp: this.hp,
      maxHp: this.maxHp,
      defense: this.defense,
      attack: this.attack,
      name: this.name
    };
  }

  setHP(value) {
    this.hp = Math.max(0, Math.min(this.maxHp, value));
  }

  takeDamage(damage) {
    const actualDamage = Math.max(1, damage - this.defense);
    this.hp = Math.max(0, this.hp - actualDamage);
    return actualDamage;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return amount;
  }

  reset() {
    this.hp = this.maxHp;
  }

  // Для возможного будущего расширения
  upgradeStats(newMaxHp, newAttack, newDefense) {
    this.maxHp = newMaxHp;
    this.attack = newAttack;
    this.defense = newDefense;
    this.hp = newMaxHp; // Полное лечение при улучшении
  }
}

export default new PlayerService();