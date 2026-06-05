export default class Item extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'power_cell');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Minor random float for the item drop to look better
    const vX = Phaser.Math.Between(-30, 30);
    const vY = Phaser.Math.Between(-30, 30);
    this.setVelocity(vX, vY);
    this.setDrag(10); // Slowly stop moving
    this.setBounce(0.5);

    // Make it rotate slightly
    this.scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 3000,
      repeat: -1
    });
  }
}
