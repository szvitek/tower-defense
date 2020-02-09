import Phaser from "phaser";
import logo2Img from "../assets/logo.png";
import bulletImg from "../assets/level/bulletDark2_outline.png";
import towerImg from "../assets/level/tank_bigRed.png";
import enemyImg from "../assets/level/tank_sand.png";
import baseImg from "../assets/level/tankBody_darkLarge_outline.png";
import titleImg from "../assets/ui/title.png";
import cursorImg from "../assets/ui/cursor.png";
import button1Img from "../assets/ui/blue_button02.png";
import button2Img from "../assets/ui/blue_button03.png";
import level1 from "../assets/level/level1.json";
import terrainTiles from "../assets/level/terrainTiles_default.png";

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // add logo image
    this.add.image(width / 2, height / 2 - 100, "logo");

    // load assets
    this.load.image("bullet", bulletImg);
    this.load.image("tower", towerImg);
    this.load.image("enemy", enemyImg);
    this.load.image("base", baseImg);
    this.load.image("title", titleImg);
    this.load.image("cursor", cursorImg);
    this.load.image("button1", button1Img);
    this.load.image("button2", button2Img);

    // placeholder
    this.load.image("logo2", logo2Img);

    // tile map in JSON format
    this.load.tilemapTiledJSON("level1", level1);
    this.load.spritesheet("terrainTiles_default", terrainTiles, {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    this.scene.start("Game");
  }
}
