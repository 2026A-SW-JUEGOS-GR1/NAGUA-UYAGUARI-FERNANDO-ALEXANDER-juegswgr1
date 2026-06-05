import Projectile from './Projectile.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_base');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true); // Will be bounded by the Tiled map dimensions
    this.body.setSize(50, 50);
    this.body.setDrag(400); 
    this.body.setMaxVelocity(400);

    // Create the engine sprite to attach on top of the base sprite
    this.engineSprite = scene.add.sprite(x, y, 'player_engine');
    
    if (!scene.anims.exists('player_engine_anim')) {
      scene.anims.create({
        key: 'player_engine_anim',
        frames: scene.anims.generateFrameNumbers('player_engine', { start: 0, end: 7 }), // 8 frames
        frameRate: 20,
        repeat: -1
      });
    }

    if (!scene.anims.exists('player_destruction_anim')) {
      scene.anims.create({
        key: 'player_destruction_anim',
        frames: scene.anims.generateFrameNumbers('player_destruction', { start: 0, end: 17 }),
        frameRate: 10,
        repeat: 0
      });
    }

    this.health = 3;
    this.isInvulnerable = false;
    this.isDestroyed = false;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    this.lastFired = 0;
    this.engineSound = scene.sound.add('engine-sound', { loop: true, volume: 0.1 });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.active || this.isDestroyed) return;

    // 1. Rotation towards mouse
    const pointer = this.scene.input.activePointer;
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
    
    this.rotation = targetAngle + Math.PI / 2;

    // 2. Movement Logic
    const accel = 1200;
    
    let vecX = 0;
    let vecY = 0;

    // Absolute movement: WASD moves relative to screen/world, not ship direction
    if (this.keys.up.isDown) vecY -= 1;
    if (this.keys.down.isDown) vecY += 1;
    if (this.keys.left.isDown) vecX -= 1;
    if (this.keys.right.isDown) vecX += 1;

    // Normalize vector so diagonal movement isn't faster
    const length = Math.sqrt(vecX * vecX + vecY * vecY);
    if (length > 0) {
      vecX /= length;
      vecY /= length;
    }

    this.body.setAcceleration(vecX * accel, vecY * accel);

    // Engine logic
    this.engineSprite.setPosition(this.x, this.y);
    this.engineSprite.setRotation(this.rotation);
    if (vecX !== 0 || vecY !== 0) {
      if (!this.engineSprite.anims.isPlaying) {
        this.engineSprite.play('player_engine_anim');
        this.engineSprite.setVisible(true);
      }
      if (!this.engineSound.isPlaying) {
        this.engineSound.play();
      }
    } else {
      this.engineSprite.stop();
      this.engineSprite.setVisible(false);
      if (this.engineSound.isPlaying) {
        this.engineSound.stop();
      }
    }

    // Shooting with left click
    if (pointer.isDown && time > this.lastFired) {
      this.shoot();
      this.lastFired = time + 250; // Fire rate
    }
  }

  shoot() {
    const offsetX = Math.cos(this.rotation - Math.PI / 2) * 50;
    const offsetY = Math.sin(this.rotation - Math.PI / 2) * 50;

    const proj = new Projectile(this.scene, this.x + offsetX, this.y + offsetY);
    this.scene.projectilesGroup.add(proj);
    proj.fire(this.x + offsetX, this.y + offsetY, this.rotation);
    this.scene.sound.play('laser-shot', { volume: 0.5 });
  }

  takeDamage() {
    if (this.isInvulnerable) return;

    this.scene.sound.play('player-hit', { volume: 0.5 });
    this.health--;
    
    if (this.health <= 0) {
      this.scene.triggerGameOver();
    } else {
      // Trigger invulnerability blink
      this.isInvulnerable = true;
      this.scene.tweens.add({
        targets: [this, this.engineSprite],
        alpha: 0,
        duration: 100,
        yoyo: true,
        repeat: 10,
        onComplete: () => {
          this.isInvulnerable = false;
          this.setAlpha(1);
          this.engineSprite.setAlpha(1);
        }
      });
    }
  }

  explode(callback) {
    this.isDestroyed = true;
    this.body.setVelocity(0, 0);
    this.body.setAcceleration(0, 0);
    this.body.checkCollision.none = true;
    
    if (this.engineSprite) this.engineSprite.destroy();
    if (this.engineSound && this.engineSound.isPlaying) {
      this.engineSound.stop();
    }

    this.setTexture('player_destruction');
    this.play('player_destruction_anim');
    this.on('animationcomplete', () => {
      this.destroy();
      if (callback) callback();
    });
  }

  destroy(fromScene) {
    if (this.engineSound && this.engineSound.isPlaying) {
      this.engineSound.stop();
    }
    super.destroy(fromScene);
  }
}
