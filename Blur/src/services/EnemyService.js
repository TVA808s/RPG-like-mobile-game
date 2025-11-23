class EnemyService {
  constructor() {
    this.enemies = {
      // Базовые враги
      skeleton: {
        name: 'Скелет',
        hp: 80,
        maxHp: 80,
        defense: 6,
        attack: 11,
        image: 'skeleton',
        expRange: { min: 10, max: 20 }
      },
      goblin: {
        name: 'Гоблин',
        hp: 60,
        maxHp: 60,
        defense: 2,
        attack: 14,
        image: 'goblin',
        expRange: { min: 15, max: 25 }
      },
      orc: {
        name: 'Орк',
        hp: 120,
        maxHp: 120,
        defense: 4,
        attack: 17,
        image: 'orc',
        expRange: { min: 25, max: 40 }
      },
      
      // Боссы
      dragon: {
        name: 'Дракон',
        hp: 300,
        maxHp: 300,
        defense: 10,
        attack: 24,
        image: 'dragon',
        expRange: { min: 100, max: 150 }
      },
      lich: {
        name: 'Лич',
        hp: 200,
        maxHp: 200,
        defense: 6,
        attack: 20,
        image: 'lich',
        expRange: { min: 80, max: 120 }
      },
      
      // Специальные враги
      ghost: {
        name: 'Призрак',
        hp: 50,
        maxHp: 50,
        defense: 0,
        attack: 20,
        image: 'ghost',
        expRange: { min: 30, max: 50 }
      }
    };
  }

  getEnemy(enemyType) {
    const enemy = {...this.enemies[enemyType]};
    // Генерируем случайное количество опыта в заданном диапазоне
    if (enemy.expRange) {
      enemy.exp = Math.floor(Math.random() * (enemy.expRange.max - enemy.expRange.min + 1)) + enemy.expRange.min;
    }
    return enemy;
  }

  getAllEnemies() {
    return this.enemies;
  }

  getRandomEnemy() {
    const enemyTypes = Object.keys(this.enemies);
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    return this.getEnemy(randomType);
  }

  // Для получения врагов по сложности
  getEnemiesByDifficulty(difficulty) {
    const difficulties = {
      easy: ['skeleton', 'goblin'],
      medium: ['orc', 'ghost'],
      hard: ['dragon', 'lich']
    };
    
    const availableTypes = difficulties[difficulty] || difficulties.easy;
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    return this.getEnemy(randomType);
  }
}

export default new EnemyService();