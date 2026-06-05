import Player from '../Entities/Player.js';
import Enemy from '../Entities/Enemy.js';
import Item from '../Entities/Item.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // 1. Backgrounds (TileSprites) for Parallax
    this.bgNebula = this.add.tileSprite(0, 0, 800, 600, 'bg_nebula').setOrigin(0, 0).setScrollFactor(0);
    this.bgStars = this.add.tileSprite(0, 0, 800, 600, 'bg_stars').setOrigin(0, 0).setScrollFactor(0);

    // 2. Play BGM
    // this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    // this.bgm.play();

    // 3. Map (Tiled)
    const map = this.make.tilemap({ key: 'mapa_space' });
    const tileset = map.addTilesetImage('asteroid', 'asteroid_tiles');
    // We assume the layer name is 'Asteroid Layer' based on JSON
    this.obstaclesLayer = map.createLayer('Asteroid Layer', tileset, 0, 0);
        
    // Create custom static hitboxes to make asteroid collision more forgiving
    this.asteroidsGroup = this.physics.add.staticGroup();
    this.obstaclesLayer.forEachTile(tile => {
      if (tile.properties.solid) {
        // Tile is 128x128. We shrink the hitbox to 80x80
        const size = 80;
        const offsetX = tile.pixelX + (128 - size) / 2;
        const offsetY = tile.pixelY + (128 - size) / 2;
        
        // Create an invisible rectangle for the hitbox
        const hitbox = this.add.rectangle(offsetX, offsetY, size, size).setOrigin(0, 0);
        this.physics.add.existing(hitbox, true);
        this.asteroidsGroup.add(hitbox);
      }
    });

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

    if (!this.anims.exists('explosion_anim')) {
      this.anims.create({
        key: 'explosion_anim',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 8 }),
        frameRate: 15,
        repeat: 0
      });
    }

    // 8. Collisions
    // Player vs Obstacles
    this.physics.add.collider(this.player, this.asteroidsGroup, () => {
      this.player.takeDamage();
      this.updateHUD();
    });

    // Enemy vs Obstacles
    this.physics.add.collider(this.enemiesGroup, this.asteroidsGroup);

    // Projectile vs Obstacles
    this.physics.add.collider(this.projectilesGroup, this.asteroidsGroup, (proj, obs) => {
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
      explosion.setRotation(enemy.rotation);
      explosion.play('explosion_anim');
      explosion.on('animationcomplete', () => {
        explosion.destroy();
      });

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
      this.bgNebula.tilePositionX = this.cameras.main.scrollX * 0.1;
      this.bgNebula.tilePositionY = this.cameras.main.scrollY * 0.1;
      
      this.bgStars.tilePositionX = this.cameras.main.scrollX * 0.3;
      this.bgStars.tilePositionY = this.cameras.main.scrollY * 0.3;
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
