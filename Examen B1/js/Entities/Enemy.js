export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_base');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.body.setSize(30, 30);

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

    this.speed = Phaser.Math.Between(100, 200);
    this.lastShotTime = 0;
    this.shootInterval = Phaser.Math.Between(1500, 3000); // 1.5 to 3 seconds

    if (!scene.anims.exists('enemy_proj_anim')) {
      scene.anims.create({
        key: 'enemy_proj_anim',
        frames: scene.anims.generateFrameNumbers('enemy_projectile', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
      });
    }
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

      // Shooting logic
      if (time > this.lastShotTime + this.shootInterval) {
        this.shoot(angle);
        this.lastShotTime = time;
      }
    }
  }

  shoot(angle) {
    if (!this.active) return;
    
    // Shoot from slightly ahead of the enemy
    const offsetDist = 20;
    const spawnX = this.x + Math.cos(angle) * offsetDist;
    const spawnY = this.y + Math.sin(angle) * offsetDist;

    const projectile = this.scene.physics.add.sprite(spawnX, spawnY, 'enemy_projectile');
    // Set a slightly smaller hitbox for the projectile if needed, or use default 16x16
    this.scene.enemyProjectilesGroup.add(projectile);
    
    // Make the projectile visually larger
    projectile.setScale(3);
    
    // Set the rotation of the projectile to match its direction
    projectile.setRotation(angle + Math.PI / 2);
    
    projectile.play('enemy_proj_anim');
    
    this.scene.physics.velocityFromRotation(angle, 350, projectile.body.velocity);
    
    // Destroy projectile after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      if (projectile && projectile.active) {
        projectile.destroy();
      }
    });
  }

  destroyEnemy() {
    this.engineSprite.destroy();
    this.destroy();
  }
}
