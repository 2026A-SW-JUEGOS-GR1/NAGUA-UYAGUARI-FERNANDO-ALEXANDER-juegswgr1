export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'projectile');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(2);

    this.speed = 1200;

    if (!scene.anims.exists('projectile_anim')) {
      scene.anims.create({
        key: 'projectile_anim',
        frames: scene.anims.generateFrameNumbers('projectile', { start: 0, end: 7 }),
        frameRate: 20,
        repeat: -1
      });
    }
  }

  fire(x, y, angle) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.play('projectile_anim');
    this.setRotation(angle);
    this.scene.physics.velocityFromRotation(angle - Math.PI / 2, this.speed, this.body.velocity);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    
    // Bounds check to destroy when out of bounds. Since player moves in a 3200x2560 map, 
    // it's better to check if it's way out of map, or just use a timer.
    // Tiled map is 3200x2560
    if (this.x < -100 || this.x > 3300 || this.y < -100 || this.y > 2660) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy(); 
    }
  }
}
