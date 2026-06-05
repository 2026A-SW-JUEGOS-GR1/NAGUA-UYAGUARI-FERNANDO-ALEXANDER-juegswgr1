export default class Menu extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Add backgrounds
    this.bgNebula = this.add.tileSprite(0, 0, w, h, 'bg_nebula').setOrigin(0, 0);
    this.bgStars = this.add.tileSprite(0, 0, w, h, 'bg_stars').setOrigin(0, 0);

    // Title
    this.titleText = this.add.text(w / 2, h / 4, 'NOVA SPACE', {
      fontSize: '64px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Instructions
    const instructions = "Pilota con las teclas W A S D.\nDispara con la Barra Espaciadora.\nSobrevive al asedio y recoge celdas de energía para ganar.";
    this.instructionsText = this.add.text(w / 2, h / 2, instructions, {
      fontSize: '20px',
      fill: '#cccccc',
      align: 'center'
    }).setOrigin(0.5);

    // High Score
    const highScore = localStorage.getItem('novaSpaceHighScore') || 0;
    this.highScoreText = this.add.text(w / 2, h / 2 + 100, `Puntuación Máxima: ${highScore}`, {
      fontSize: '24px',
      fill: '#ffdd00'
    }).setOrigin(0.5);

    // Start prompt
    this.startText = this.add.text(w / 2, h / 2 + 200, '[ PRESIONA CLICK O ENTER PARA COMENZAR ]', {
      fontSize: '24px',
      fill: '#00ff00'
    }).setOrigin(0.5);

    // Resize event
    this.scale.on('resize', (gameSize) => {
      const gw = gameSize.width;
      const gh = gameSize.height;
      this.bgNebula.setSize(gw, gh);
      this.bgStars.setSize(gw, gh);
      this.titleText.setPosition(gw / 2, gh / 4);
      this.instructionsText.setPosition(gw / 2, gh / 2);
      this.highScoreText.setPosition(gw / 2, gh / 2 + 100);
      this.startText.setPosition(gw / 2, gh / 2 + 200);
    });

    // Simple blink effect
    this.tweens.add({
      targets: this.startText,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Inputs to start
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
    this.input.once('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
