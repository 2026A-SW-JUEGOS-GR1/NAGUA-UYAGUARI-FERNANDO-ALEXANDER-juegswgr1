export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.titleText = this.add.text(w / 2, h / 2 - 100, 'GAME OVER', {
      fontSize: '64px',
      fill: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(w / 2, h / 2, `Puntuación Final: ${this.finalScore}`, {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.restartBtn = this.add.text(w / 2, h / 2 + 150, '[ REINICIAR ]', {
      fontSize: '32px',
      fill: '#00ff00'
    }).setOrigin(0.5).setInteractive();

    this.tweens.add({
      targets: this.restartBtn,
      alpha: 0.2,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    this.restartBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });

    const resizeHandler = (gameSize) => {
      if (!this.scene.isActive()) return;
      const gw = gameSize.width;
      const gh = gameSize.height;
      this.titleText.setPosition(gw / 2, gh / 2 - 100);
      this.scoreText.setPosition(gw / 2, gh / 2);
      this.restartBtn.setPosition(gw / 2, gh / 2 + 150);
    };
    this.scale.on('resize', resizeHandler, this);
    this.events.on('shutdown', () => {
      this.scale.off('resize', resizeHandler, this);
    });
  }
}
