import Projectile from './Projectile.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_base');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true); // Will be bounded by the Tiled map dimensions
    this.body.setSize(100, 100);

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

    this.speed = 300;
    this.health = 3;
    this.isInvulnerable = false;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.spaceBar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    this.lastFired = 0;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.active) return;

    // Movement Logic
    this.body.setVelocity(0);

    let isMoving = false;

    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
      isMoving = true;
    }

    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed);
      isMoving = true;
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed);
      isMoving = true;
    }

    // Engine logic
    this.engineSprite.setPosition(this.x, this.y);
    if (isMoving) {
      if (!this.engineSprite.anims.isPlaying) {
        this.engineSprite.play('player_engine_anim');
        this.engineSprite.setVisible(true);
      }
    } else {
      this.engineSprite.stop();
      this.engineSprite.setVisible(false); // Propulsor apagado
    }

    // Shooting
    if (this.spaceBar.isDown && time > this.lastFired) {
      this.shoot();
      this.lastFired = time + 250; // Fire rate
    }
  }

  shoot() {
    // Generate a projectile
    const proj = new Projectile(this.scene, this.x, this.y - 50);
    this.scene.projectilesGroup.add(proj);
    proj.fire(this.x, this.y - 50);

    // Play SFX if we want (or handle in scene)
    // this.scene.sound.play('shoot_sfx');
  }

  takeDamage() {
    if (this.isInvulnerable) return;

    this.health--;
    
    if (this.health <= 0) {
      this.destroyPlayer();
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

  destroyPlayer() {
    this.engineSprite.destroy();
    this.destroy();
  }
}
