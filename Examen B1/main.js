import Boot from './js/Scenes/Boot.js';
import Menu from './js/Scenes/Menu.js';
import Game from './js/Scenes/Game.js';
import Victory from './js/Scenes/Victory.js';
import GameOver from './js/Scenes/GameOver.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  resolution: window.devicePixelRatio || 1,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [Boot, Menu, Game, Victory, GameOver],
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%'
  }
};

const game = new Phaser.Game(config);
