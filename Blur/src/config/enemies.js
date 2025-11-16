// config/enemies.js
export const ENEMIES = {
  GOBLIN: {
    name: 'Гоблин',
    hp: 60,
    attack: 6,
    image: 'goblin',
    difficulty: 'easy'
  },
  ORC: {
    name: 'Орк',
    hp: 100,
    attack: 12,
    image: 'orc',
    difficulty: 'medium'
  },
  DRAGON: {
    name: 'Дракон',
    hp: 200,
    attack: 20,
    image: 'dragon',
    difficulty: 'hard'
  }
};

export const getRandomEnemy = () => {
  const enemies = Object.values(ENEMIES);
  return enemies[Math.floor(Math.random() * enemies.length)];
};