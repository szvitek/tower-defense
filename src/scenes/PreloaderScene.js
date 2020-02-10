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

  init() {
    this.readyCount = 0;
  }

  preload() {
    this.createPreloader();

    // time event for logo
    // TODO: update delayedCall time
    this.timedEvent = this.time.delayedCall(1, this.ready, [], this);

    this.loadAssets();
  }

  createPreloader() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // add logo image
    this.add.image(width / 2, height / 2 - 100, "logo");

    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    // loading text
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    // percent text
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);

    // loading assets text
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on("progress", value => {
      percentText.setText(`${parseInt(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
    });

    // update file progress text
    this.load.on("fileprogress", file => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    // remove progressbar when complete
    this.load.on("complete", file => {
      progressBox.destroy();
      progressBar.destroy();
      assetText.destroy();
      loadingText.destroy();
      percentText.destroy();
      this.ready();
    });
  }

  loadAssets() {
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

  ready() {
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start("Title");
    }
  }
}
