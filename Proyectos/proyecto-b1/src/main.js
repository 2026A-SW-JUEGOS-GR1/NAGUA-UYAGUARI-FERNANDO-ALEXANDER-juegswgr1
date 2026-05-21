class Tema06Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Tema06Scene' });
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.tilemapTiledJSON('nivel-1', 'scenes/nivel-1.json');
    this.load.spritesheet('player', 'assets/player-1/player-1.png', {
      frameWidth: 82,
      frameHeight: 60,
    });
  }

  create() {
    const mapa = this.make.tilemap({ key: 'nivel-1' });

    const tileset = mapa.addTilesetImage('background', 'background', 32, 32, 1, 2);
    const nombreCapa = mapa.layers[0].name;
    const capa = mapa.createLayer(nombreCapa, tileset, 0, 0);

    this.add.sprite(400, 320, 'player', 0).setScale(1);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 480,
  parent: 'game-container',
  scene: [Tema06Scene],
};

new Phaser.Game(config);