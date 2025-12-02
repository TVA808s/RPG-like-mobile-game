// services/BattleService.js
import BattleEngine from './BattleEngine';

class BattleService {
  constructor() {
    this.currentBattle = null;        // Текущая активная битва
    this.battleHistory = [];         // Архив всех проведенных битв
  }

  // Запуск новой битвы
  startNewBattle(enemy) {
    // Создает экземпляр BattleEngine и регистрирует битву в истории
    this.currentBattle = new BattleEngine(enemy);
    this.battleHistory.push({
      enemy: enemy.name,
      timestamp: new Date().toISOString()
    });
    return this.currentBattle;
  }

  // Обеспечивает доступ к активному бою для UI компонентов
  getCurrentBattle() {
    return this.currentBattle;
  }

  // Завершение текущей битвы с очисткой
  endCurrentBattle() {
    this.currentBattle = null;
  }

  // Получение истории сражений
  getBattleHistory() {
    return this.battleHistory;
  }

  // Возвращает количество сражений
  getTotalBattles() {
    return this.battleHistory.length;
  }

  // Полный сброс
  reset() {
    this.currentBattle = null;
    this.battleHistory = [];
  }
}

export default new BattleService();