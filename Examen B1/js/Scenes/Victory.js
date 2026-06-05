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

    this.titleText = this.add.text(w / 2, h / 2 - 200, 'VICTORIA', {
      fontSize: '120px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#9d4edd',
      strokeThickness: 10,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 10, stroke: true, fill: true }
    }).setOrigin(0.5);

    // Floating animation for title
    this.tweens.add({
      targets: this.titleText,
      y: h / 2 - 220,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    this.msgText = this.add.text(w / 2, h / 2 - 50, '¡Celdas de energía al máximo!\nLa nave pudo hacer el salto temporal\npara regresar a casa.', {
      fontSize: '36px',
      fill: '#ffffff',
      fontStyle: 'normal',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 5, fill: true }
    }).setOrigin(0.5);

    this.scoreText = this.add.text(w / 2, h / 2 + 100, `PUNTUACIÓN FINAL: ${this.finalScore}`, {
      fontSize: '32px',
      fontStyle: 'bold',
      fill: '#ffffffff',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
    }).setOrigin(0.5);

    this.restartBtn = this.add.text(w / 2, h / 2 + 220, ' CONTINUAR ', {
      fontSize: '36px',
      fill: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#9741aeff',
      padding: { x: 20, y: 10 },
      stroke: '#000000',
      strokeThickness: 2,
      shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 5, fill: true }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Hover effects
    this.restartBtn.on('pointerover', () => {
      this.restartBtn.setStyle({ backgroundColor: '#9d4edd', fill: '#ffffcc' });
      this.tweens.add({
        targets: this.restartBtn,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: 'Power2'
      });
    });

    this.restartBtn.on('pointerout', () => {
      this.restartBtn.setStyle({ backgroundColor: '#9741aeff', fill: '#ffffff' });
      this.tweens.add({
        targets: this.restartBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });
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
      this.titleText.setPosition(gw / 2, gh / 2 - 200);
      this.msgText.setPosition(gw / 2, gh / 2 - 50);
      this.scoreText.setPosition(gw / 2, gh / 2 + 100);
      this.restartBtn.setPosition(gw / 2, gh / 2 + 220);
    };
    this.scale.on('resize', resizeHandler, this);
    this.events.on('shutdown', () => {
      this.scale.off('resize', resizeHandler, this);
    });
  }
}
