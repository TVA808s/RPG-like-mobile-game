import BattleEngine from './BattleEngine';

class BattleService {
  constructor() {
    this.currentBattle = null;
  }

  startNewBattle(playerConfig, enemyConfig) {
    this.currentBattle = new BattleEngine(playerConfig, enemyConfig);
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