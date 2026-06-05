export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    this.add.text(400, 200, 'GAME OVER', {
      fontSize: '64px',
      fill: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 300, `Puntuación Final: ${this.finalScore}`, {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const restartBtn = this.add.text(400, 450, '[ REINICIAR ]', {
      fontSize: '32px',
      fill: '#00ff00'
    }).setOrigin(0.5).setInteractive();

    this.tweens.add({
      targets: restartBtn,
      alpha: 0.2,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    restartBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }
}
