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

    this.bg = this.add.image(w / 2, h / 2, 'game_over_bg').setDisplaySize(w, h);

    this.restartBtn = this.add.text(w / 2, h / 2 + 250, '[ REINICIAR ]', {
      fontSize: '40px',
      fontStyle: 'bold',
      fill: '#bf9ff8ff'
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
      this.scene.start('MenuScene');
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });

    const resizeHandler = (gameSize) => {
      if (!this.scene.isActive()) return;
      const gw = gameSize.width;
      const gh = gameSize.height;
      this.bg.setPosition(gw / 2, gh / 2).setDisplaySize(gw, gh);
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
