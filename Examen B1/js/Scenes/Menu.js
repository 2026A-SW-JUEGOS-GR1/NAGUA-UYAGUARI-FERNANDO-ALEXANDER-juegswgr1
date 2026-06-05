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

    // Make start text interactive to start the game
    this.startText.setInteractive();

    // Inputs to start game
    const startGame = () => {
      unlockAndPlay();
      this.scene.start('GameScene');
    };

    this.input.keyboard.once('keydown-ENTER', startGame);
    this.startText.once('pointerdown', startGame);

    // Any general click unlocks the audio context without starting the game
    this.input.on('pointerdown', unlockAndPlay);
  }
}
