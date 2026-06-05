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

    this.restartBtn = this.add.text(w / 2, h / 2 + 250, ' REINICIAR ', {
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
      this.restartBtn.setPosition(gw / 2, gh / 2 + 250);
    };
    this.scale.on('resize', resizeHandler, this);
    this.events.on('shutdown', () => {
      this.scale.off('resize', resizeHandler, this);
    });
  }
}
