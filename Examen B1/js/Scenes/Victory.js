export default class Victory extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.victorySound = this.sound.add('victory', { loop: true, volume: 0.5 });
    this.victorySound.play();

    this.titleText = this.add.text(w / 2, h / 2 - 150, '¡VICTORIA!', {
      fontSize: '64px',
      fill: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.msgText = this.add.text(w / 2, h / 2 - 50, '¡Celdas de energía al máximo!\nLa nave puede hacer el salto temporal\npara regresar a casa.', {
      fontSize: '24px',
      fill: '#aaffaa',
      align: 'center'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(w / 2, h / 2 + 50, `Puntuación Final: ${this.finalScore}`, {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.restartBtn = this.add.text(w / 2, h / 2 + 150, '[ JUGAR DE NUEVO ]', {
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
      this.victorySound.stop();
      this.scene.start('MenuScene');
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.victorySound.stop();
      this.scene.start('MenuScene');
    });

    const resizeHandler = (gameSize) => {
      if (!this.scene.isActive()) return;
      const gw = gameSize.width;
      const gh = gameSize.height;
      this.titleText.setPosition(gw / 2, gh / 2 - 150);
      this.msgText.setPosition(gw / 2, gh / 2 - 50);
      this.scoreText.setPosition(gw / 2, gh / 2 + 50);
      this.restartBtn.setPosition(gw / 2, gh / 2 + 150);
    };
    this.scale.on('resize', resizeHandler, this);
    this.events.on('shutdown', () => {
      this.scale.off('resize', resizeHandler, this);
    });
  }
}
