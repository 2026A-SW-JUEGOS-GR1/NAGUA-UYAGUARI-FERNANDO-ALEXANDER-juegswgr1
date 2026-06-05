export default class Menu extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Add background
    this.add.tileSprite(0, 0, 800, 600, 'bg_stars').setOrigin(0, 0);

    // Title
    this.add.text(400, 150, 'NOVA SPACE', {
      fontSize: '64px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Instructions
    const instructions = "Pilota con las teclas W A S D.\nDispara con la Barra Espaciadora.\nSobrevive al asedio y recoge celdas de energía para ganar.";
    this.add.text(400, 300, instructions, {
      fontSize: '20px',
      fill: '#cccccc',
      align: 'center'
    }).setOrigin(0.5);

    // High Score
    const highScore = localStorage.getItem('novaSpaceHighScore') || 0;
    this.add.text(400, 400, `Puntuación Máxima: ${highScore}`, {
      fontSize: '24px',
      fill: '#ffdd00'
    }).setOrigin(0.5);

    // Start prompt
    const startText = this.add.text(400, 500, '[ PRESIONA CLICK O ENTER PARA COMENZAR ]', {
      fontSize: '24px',
      fill: '#00ff00'
    }).setOrigin(0.5);

    // Simple blink effect
    this.tweens.add({
      targets: startText,
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
