import Boot from './js/Scenes/Boot.js';
import Menu from './js/Scenes/Menu.js';
import Game from './js/Scenes/Game.js';
import Victory from './js/Scenes/Victory.js';
import GameOver from './js/Scenes/GameOver.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [Boot, Menu, Game, Victory, GameOver],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);
