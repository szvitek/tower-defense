import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/GameScene";
import BootScene from "./scenes/BootScene";
import PreloaderScene from "./scenes/PreloaderScene";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("Preloader", PreloaderScene);
    this.scene.add("Boot", BootScene);
    this.scene.add("Game", GameScene);
    this.scene.start("Boot");
  }
}

window.onload = function() {
  window.game = new Game(config);
};
