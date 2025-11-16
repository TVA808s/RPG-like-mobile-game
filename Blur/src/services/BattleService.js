// services/BattleService.js
import BattleEngine from './BattleEngine';

class BattleService {
  constructor() {
    this.currentBattle = null;
  }

  startNewBattle(enemy) {
    this.currentBattle = new BattleEngine(enemy);
    return this.currentBattle;
  }

  getCurrentBattle() {
    return this.currentBattle;
  }

  endCurrentBattle() {
    this.currentBattle = null;
  }
}

export default new BattleService();