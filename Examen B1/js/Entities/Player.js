import Projectile from './Projectile.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_base');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true); // Will be bounded by the Tiled map dimensions
    this.body.setSize(100, 100);
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

    this.health = 3;
    this.isInvulnerable = false;

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.spaceBar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    this.lastFired = 0;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.active) return;

    // Movement Logic
    let ax = 0;
    let ay = 0;
    const accel = 1200;

    if (this.keys.left.isDown) ax = -accel;
    else if (this.keys.right.isDown) ax = accel;

    if (this.keys.up.isDown) ay = -accel;
    else if (this.keys.down.isDown) ay = accel;

    this.body.setAcceleration(ax, ay);

    if (this.body.velocity.lengthSq() > 10) {
      const targetAngle = this.body.velocity.angle() + Math.PI / 2;
      // Interpolate rotation for an even smoother feel
      const diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation);
      this.rotation += diff * 0.2;
    }

    // Engine logic
    this.engineSprite.setPosition(this.x, this.y);
    this.engineSprite.setRotation(this.rotation);
    if (ax !== 0 || ay !== 0) {
      if (!this.engineSprite.anims.isPlaying) {
        this.engineSprite.play('player_engine_anim');
        this.engineSprite.setVisible(true);
      }
    } else {
      this.engineSprite.stop();
      this.engineSprite.setVisible(false);
    }

    // Shooting
    if (this.spaceBar.isDown && time > this.lastFired) {
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
  }

  takeDamage() {
    if (this.isInvulnerable) return;

    this.health--;
    
    if (this.health <= 0) {
      this.scene.triggerGameOver();
      this.destroyPlayer();
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
