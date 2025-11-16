// services/ImageService.js
class ImageService {
  constructor() {
    this.images = {
      player: require('../assets/images/player.png'),
      // Изображения врагов
      skeleton: require('../assets/images/skeleton.png'),
      goblin: require('../assets/images/goblin.png'),
      // orc: require('../assets/images/orc.png'),
      // dragon: require('../assets/images/dragon.png'),
      // lich: require('../assets/images/lich.png'),
      // ghost: require('../assets/images/ghost.png'),
      // Заглушка по умолчанию

    };
  }

  getImage(imageName) {
    return this.images[imageName] || this.images.enemy;
  }
}

export default new ImageService();