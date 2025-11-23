// services/ImageService.js
class ImageService {
  constructor() {
    this.images = {
      player: require('../assets/images/player.png'),
      skeleton: require('../assets/images/skeleton.png'),
      goblin: require('../assets/images/goblin.png'),
      enemy: require('../assets/images/enemy.png'),
    };
  }

  getImage(imageName) {
    return this.images[imageName] || this.images.enemy;
  }
}

export default new ImageService();