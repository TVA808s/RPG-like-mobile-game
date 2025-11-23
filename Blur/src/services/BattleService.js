// services/BattleService.js
import BattleEngine from './BattleEngine';

class BattleService {
  constructor() {
    this.currentBattle = null;
    this.battleHistory = [];
  }

  startNewBattle(enemy) {
    this.currentBattle = new BattleEngine(enemy);
    this.battleHistory.push({
      enemy: enemy.name,
      timestamp: new Date().toISOString()
    });
    return this.currentBattle;
  }

  getCurrentBattle() {
    return this.currentBattle;
  }

  endCurrentBattle() {
    this.currentBattle = null;
  }

  getBattleHistory() {
    return this.battleHistory;
  }

  getTotalBattles() {
    return this.battleHistory.length;
  }

  // НОВЫЙ МЕТОД: Полный сброс сервиса
  reset() {
    this.currentBattle = null;
    this.battleHistory = [];
  }
}

export default new BattleService();