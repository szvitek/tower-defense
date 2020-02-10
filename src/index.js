import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/GameScene";
import BootScene from "./scenes/BootScene";
import PreloaderScene from "./scenes/PreloaderScene";
import TitleScene from "./scenes/TitleScene";
import UIScene from "./scenes/UIScene";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("Preloader", PreloaderScene);
    this.scene.add("Boot", BootScene);
    this.scene.add("Game", GameScene);
    this.scene.add("Title", TitleScene);
    this.scene.add("UI", UIScene);
    this.scene.start("Boot");
  }
}

window.onload = function() {
  window.game = new Game(config);
};
