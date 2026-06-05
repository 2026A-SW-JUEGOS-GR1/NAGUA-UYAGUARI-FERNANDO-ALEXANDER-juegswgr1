export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_base');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Add engine sprite on top as a child or just composite
    // For simplicity, we just use the base sprite for physics and position,
    // and let's add an engine sprite if we want
    this.engineSprite = scene.add.sprite(x, y, 'enemy_engine');
    
    // Play engine animation
    if (!scene.anims.exists('enemy_engine_anim')) {
      scene.anims.create({
        key: 'enemy_engine_anim',
        frames: scene.anims.generateFrameNumbers('enemy_engine', { start: 0, end: 11 }), // 12 frames
        frameRate: 15,
        repeat: -1
      });
    }
    this.engineSprite.play('enemy_engine_anim');

    this.speed = Phaser.Math.Between(80, 150);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    
    // Engine sprite follows base
    this.engineSprite.setPosition(this.x, this.y);
    this.engineSprite.setRotation(this.rotation);

    const player = this.scene.player;
    if (player && player.active) {
      // Calculate angle to player
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      this.setRotation(angle + Math.PI / 2); // Adjust depending on sprite orientation
      
      // Move vectorially towards player
      this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
    }
  }

  destroyEnemy() {
    this.engineSprite.destroy();
    this.destroy();
  }
}
