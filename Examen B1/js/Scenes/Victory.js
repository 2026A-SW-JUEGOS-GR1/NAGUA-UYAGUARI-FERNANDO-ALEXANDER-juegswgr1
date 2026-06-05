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

    this.bg = this.add.image(w / 2, h / 2, 'victory_bg').setDisplaySize(w, h);

    this.victorySound = this.sound.add('victory', { loop: true, volume: 0.5 });
    this.victorySound.play();

    this.titleText = this.add.text(w / 2, h / 2 - 150, 'VICTORIA', {
      fontSize: '150px',
      fill: '#f7eef8ff',
      fontStyle: 'bold',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.msgText = this.add.text(w / 2, h / 2, '¡Celdas de energía al máximo!\nLa nave pudo hacer el salto temporal\npara regresar a casa.', {
      fontSize: '40px',
      fill: '#ffffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(w / 2, h / 2 + 150, `Puntuación Final: ${this.finalScore}`, {
      fontSize: '32px',
      fontStyle: 'bold',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.restartBtn = this.add.text(w / 2, h / 2 + 250, '[ JUGAR DE NUEVO ]', {
      fontSize: '32px',
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
      this.bg.setPosition(gw / 2, gh / 2).setDisplaySize(gw, gh);
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
