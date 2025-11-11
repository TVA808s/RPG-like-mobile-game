const ImageService = {
  images: {
    player: require('../assets/hero.png'),
    enemy: require('../assets/enemy.png'),
    battle_bg: require('../assets/battle_bg.png')
  },

  getImage(key) {
    return this.images[key] || null;
  }
};

export default ImageService;