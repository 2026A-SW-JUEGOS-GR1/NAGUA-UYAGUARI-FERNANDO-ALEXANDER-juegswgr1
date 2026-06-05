export default class Boot extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load map and tileset
    this.load.image('asteroid_tiles', 'assets/images/tilesets/Asteroid Brown.png');
    this.load.tilemapTiledJSON('mapa_space', 'assets/maps/mapa_space.json');

    // Load backgrounds
    this.load.image('bg_nebula', 'assets/images/backgrounds/Nebula Aqua-Pink.png');
    this.load.image('bg_stars', 'assets/images/backgrounds/Stars Small_1.png');

    // Load player sprites
    this.load.image('player_base', 'assets/images/player/Nairan - Battlecruiser - Base.png');
    this.load.spritesheet('player_engine', 'assets/images/player/Nairan - Battlecruiser - Engine.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    // Load enemy sprites
    this.load.image('enemy_base', "assets/images/enemies/Kla'ed - Frigate - Base.png");
    this.load.spritesheet('enemy_engine', "assets/images/enemies/Kla'ed - Frigate - Engine.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    // Load projectiles and effects
    this.load.spritesheet('projectile', 'assets/images/projectiles/Nautolan - Bullet.png', {
      frameWidth: 9,
      frameHeight: 12
    });
    this.load.image('power_cell', 'assets/images/power_cell/Item_Powerup_Weapon_Special_2.png');
    this.load.spritesheet('explosion', "assets/images/enemies/Kla'ed - Frigate - Destruction.png", {
      frameWidth: 64,
      frameHeight: 64
    });

    // Load sounds 
    this.load.audio('bgm', 'assets/sounds/bgm-loop.mp3');
    this.load.audio('laser-shot', 'assets/sounds/laser-shot.mp3');
    this.load.audio('enemy-explosion', 'assets/sounds/enemy-explosion.mp3');
    this.load.audio('game-over', 'assets/sounds/game-over.mp3');
    this.load.audio('player-hit', 'assets/sounds/player-hit.mp3');
  }

  create() {
    this.scene.start('MenuScene');
  }
}
