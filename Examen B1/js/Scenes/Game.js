import Player from '../Entities/Player.js';
import Enemy from '../Entities/Enemy.js';
import Item from '../Entities/Item.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 1. Background (TileSprite)
    this.bg = this.add.tileSprite(0, 0, 3200, 2560, 'bg_stars').setOrigin(0, 0);

    // 2. Play BGM
    // this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    // this.bgm.play();

    // 3. Map (Tiled)
    const map = this.make.tilemap({ key: 'mapa_space' });
    const tileset = map.addTilesetImage('asteroid', 'asteroid_tiles');
    // We assume the layer name is 'Tile Layer 1' based on JSON
    this.obstaclesLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);
    this.obstaclesLayer.setCollisionByProperty({ solid: true }); // From JSON properties

    // 4. Groups
    this.projectilesGroup = this.physics.add.group();
    this.enemiesGroup = this.physics.add.group();
    this.itemsGroup = this.physics.add.group();

    // 5. Player
    this.player = new Player(this, 1600, 1280); // Spawn in middle of map approx
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, 3200, 2560);
    this.physics.world.setBounds(0, 0, 3200, 2560);

    // 6. HUD
    this.score = 0;
    this.cells = 0;
    this.maxCells = 10;

    this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);
    this.cellsText = this.add.text(20, 50, `Celdas: 0 / ${this.maxCells}`, { fontSize: '24px', fill: '#0f0' }).setScrollFactor(0);
    this.healthText = this.add.text(20, 80, `Vidas: ${this.player.health}`, { fontSize: '24px', fill: '#f00' }).setScrollFactor(0);

    // 7. Spawner
    this.enemySpawnTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    // 8. Collisions
    // Player vs Obstacles
    this.physics.add.collider(this.player, this.obstaclesLayer, () => {
      this.player.takeDamage();
      this.updateHUD();
    });

    // Enemy vs Obstacles
    this.physics.add.collider(this.enemiesGroup, this.obstaclesLayer);

    // Projectile vs Obstacles
    this.physics.add.collider(this.projectilesGroup, this.obstaclesLayer, (proj, obs) => {
      proj.destroy();
    });

    // Player vs Enemies
    this.physics.add.collider(this.player, this.enemiesGroup, (player, enemy) => {
      player.takeDamage();
      this.updateHUD();
      // Optional: Destroy enemy on collision
      // enemy.destroyEnemy();
    });

    // Projectile vs Enemies
    this.physics.add.overlap(this.projectilesGroup, this.enemiesGroup, (proj, enemy) => {
      proj.destroy();
      
      // Spawn explosion effect
      const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
      this.time.delayedCall(300, () => explosion.destroy());

      // Drop Item (30% chance)
      if (Phaser.Math.Between(1, 100) <= 30) {
        const item = new Item(this, enemy.x, enemy.y);
        this.itemsGroup.add(item);
      }

      enemy.destroyEnemy();

      this.score += 100;
      this.updateHUD();
    });

    // Player vs Items
    this.physics.add.overlap(this.player, this.itemsGroup, (player, item) => {
      item.destroy();
      this.cells++;
      this.updateHUD();

      if (this.cells >= this.maxCells) {
        this.triggerVictory();
      }
    });
  }

  update() {
    // Parallax background based on player movement
    if (this.player && this.player.active) {
      this.bg.tilePositionX = this.cameras.main.scrollX * 0.3;
      this.bg.tilePositionY = this.cameras.main.scrollY * 0.3;
    }
  }

  spawnEnemy() {
    if (!this.player || !this.player.active) return;

    // Spawn near the edges of the camera view
    const cam = this.cameras.main;
    const padding = 50;

    let x, y;
    const edge = Phaser.Math.Between(0, 3);
    if (edge === 0) { // Top
      x = Phaser.Math.Between(cam.worldView.x, cam.worldView.right);
      y = cam.worldView.y - padding;
    } else if (edge === 1) { // Bottom
      x = Phaser.Math.Between(cam.worldView.x, cam.worldView.right);
      y = cam.worldView.bottom + padding;
    } else if (edge === 2) { // Left
      x = cam.worldView.x - padding;
      y = Phaser.Math.Between(cam.worldView.y, cam.worldView.bottom);
    } else { // Right
      x = cam.worldView.right + padding;
      y = Phaser.Math.Between(cam.worldView.y, cam.worldView.bottom);
    }

    const enemy = new Enemy(this, x, y);
    this.enemiesGroup.add(enemy);
  }

  updateHUD() {
    this.scoreText.setText(`Score: ${this.score}`);
    this.cellsText.setText(`Celdas: ${this.cells} / ${this.maxCells}`);
    this.healthText.setText(`Vidas: ${this.player.health}`);
  }

  triggerGameOver() {
    this.saveHighScore();
    // if (this.bgm) this.bgm.stop();
    this.scene.start('GameOverScene', { score: this.score });
  }

  triggerVictory() {
    this.saveHighScore();
    // if (this.bgm) this.bgm.stop();
    this.scene.start('VictoryScene', { score: this.score });
  }

  saveHighScore() {
    const currentHigh = localStorage.getItem('novaSpaceHighScore') || 0;
    if (this.score > currentHigh) {
      localStorage.setItem('novaSpaceHighScore', this.score);
    }
  }
}
