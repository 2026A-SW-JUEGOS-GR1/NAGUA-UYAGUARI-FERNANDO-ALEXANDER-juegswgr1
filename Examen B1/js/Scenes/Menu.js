export default class Menu extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Add backgrounds
    this.bg = this.add.image(w / 2, h / 2, 'menu_bg').setDisplaySize(w, h);

    // Helper function to play BGM
    const playBGM = () => {
      let bgm = this.sound.get('bgm');
      if (!bgm) {
        bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
      }
      if (!bgm.isPlaying) {
        bgm.play();
      }
    };

    // Function to unlock audio context and play BGM
    const unlockAndPlay = () => {
      if (this.sound.context && this.sound.context.state === 'suspended') {
        this.sound.context.resume().then(() => {
          playBGM();
        }).catch(err => {
          console.log('Error resuming sound context:', err);
        });
      } else {
        playBGM();
      }
    };

    // Play BGM if not already playing
    playBGM();

    // Listen to unlock event if sound is locked
    if (this.sound.locked) {
      this.sound.once('unlocked', playBGM);
    }

    // Title
    this.titleText = this.add.text(w / 2, h / 4, 'NOVA SPACE', {
      fontSize: '150px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#9d4edd',
      strokeThickness: 10,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 10, stroke: true, fill: true }
    }).setOrigin(0.5);

    // Floating animation for title
    this.tweens.add({
      targets: this.titleText,
      y: h / 4 - 30,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Instructions
    const instructions = "Pilota con las teclas W A S D.\nApunta con el Mouse y Dispara con el Click Izquierdo.\nTu objetivo es destruir las naves alienígenas,\npara recoger las celdas de energía necesarias para que los\nmotores se recarguen para el salto espacial y regresar a casa.";
    this.instructionsText = this.add.text(w / 2, h / 2, instructions, {
      fontSize: '26px',
      fill: '#ffffff',
      fontStyle: 'normal',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 5, fill: true }
    }).setOrigin(0.5);

    // High Score
    const highScore = localStorage.getItem('novaSpaceHighScore') || 0;
    this.highScoreText = this.add.text(w / 2, h / 2 + 150, `PUNTUACIÓN MÁXIMA: ${highScore}`, {
      fontSize: '28px',
      fontStyle: 'bold',
      fill: '#ffffffff',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
    }).setOrigin(0.5);

    // Start Button
    this.startButton = this.add.text(w / 2, h / 2 + 250, ' COMENZAR ', {
      fontSize: '36px',
      fill: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#9741aeff',
      padding: { x: 20, y: 10 },
      stroke: '#000000',
      strokeThickness: 2,
      shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 5, fill: true }
    }).setOrigin(0.5);

    this.startButton.setInteractive({ useHandCursor: true });

    // Hover effects
    this.startButton.on('pointerover', () => {
      this.startButton.setStyle({ backgroundColor: '#9d4edd', fill: '#ffffcc' });
      this.tweens.add({
        targets: this.startButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: 'Power2'
      });
    });

    this.startButton.on('pointerout', () => {
      this.startButton.setStyle({ backgroundColor: '#7b2cbf', fill: '#ffffff' });
      this.tweens.add({
        targets: this.startButton,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });
    });

    // Start prompt
    // this.promptText = this.add.text(w / 2, h / 2 + 320, '[ PRESIONA ENTER O CLICK PARA COMENZAR ]', {
    //   fontSize: '20px',
    //   fill: '#e0aaff',
    //   fontStyle: 'bold',
    //   stroke: '#000000',
    //   strokeThickness: 3
    // }).setOrigin(0.5);

    // Resize event
    this.scale.on('resize', (gameSize) => {
      const gw = gameSize.width;
      const gh = gameSize.height;
      this.bg.setPosition(gw / 2, gh / 2).setDisplaySize(gw, gh);
      this.titleText.setPosition(gw / 2, gh / 4 - 50);
      this.instructionsText.setPosition(gw / 2, gh / 2);
      this.highScoreText.setPosition(gw / 2, gh / 2 + 150);
      this.startButton.setPosition(gw / 2, gh / 2 + 250);
      this.promptText.setPosition(gw / 2, gh / 2 + 320);
    });

    // Simple pulse effect
    this.tweens.add({
      targets: this.promptText,
      alpha: 0.3,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Inputs to start game
    const startGame = () => {
      unlockAndPlay();
      this.scene.start('GameScene');
    };

    this.input.keyboard.once('keydown-ENTER', startGame);
    this.startButton.once('pointerdown', startGame);

    // Any general click unlocks the audio context without starting the game
    this.input.on('pointerdown', () => {
      unlockAndPlay();
    });
  }
}
