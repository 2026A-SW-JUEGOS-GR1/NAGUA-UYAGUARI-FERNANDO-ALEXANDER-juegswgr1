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
      fill: '#f4e3f3ff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Instructions
    const instructions = "Pilota con las teclas W A S D.\nApunta con el Mouse y Dispara con el Click Izquierdo.\nTu objetivo es destruir las naves alienígenas, \npara recoger las celdas de energía necesarias para que los \nmotores se recarguen para el salto espacial y regresar a casita.";
    this.instructionsText = this.add.text(w / 2, h / 2, instructions, {
      fontSize: '30px',
      fill: '#f7e5faff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // High Score
    const highScore = localStorage.getItem('novaSpaceHighScore') || 0;
    this.highScoreText = this.add.text(w / 2, h / 2 + 200, `Puntuación Máxima: ${highScore}`, {
      fontSize: '24px',
      fontStyle: 'bold',
      fill: '#f276fbff'
    }).setOrigin(0.5);

    // Start prompt
    this.startText = this.add.text(w / 2, h / 2 + 250, '[ PRESIONA CLICK O ENTER PARA COMENZAR ]', {
      fontSize: '30px',
      fill: '#bf9ff8ff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Resize event
    this.scale.on('resize', (gameSize) => {
      const gw = gameSize.width;
      const gh = gameSize.height;
      this.bg.setPosition(gw / 2, gh / 2).setDisplaySize(gw, gh);
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
