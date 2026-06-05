export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'projectile');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 600;
  }

  fire(x, y) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(-this.speed);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y <= -50) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy(); // Alternatively, we could pool them
    }
  }
}
