import Phaser from "phaser";
import map from "../config/map";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.map = map.map(arr => arr.slice());
  }

  create() {
    this.createMap();
    this.createPath();
    this.createCursor();
  }

  createCursor() {
    this.cursor = this.add.image(32, 32, "cursor");
    this.cursor.setScale(2);
    this.cursor.alpha = 1;

    this.input.on("pointermove", pointer => {
      const i = Math.floor(pointer.y / 64);
      const j = Math.floor(pointer.x / 64);

      if (this.canPlaceTurret(i, j)) {
        this.cursor.setPosition(j * 64 + 32, i * 64 + 32);
        this.cursor.alpha = 0.8;
      } else {
        this.cursor.alpha = 0;
      }
    });
  }

  canPlaceTurret(i, j) {
    return this.map[i][j] === 0;
  }

  createPath() {
    this.graphics = this.add.graphics();
    // the path the enemies follow
    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 163);
    this.path.lineTo(480, 163);
    this.path.lineTo(480, 544);

    // visualizing the path
    this.graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(this.graphics);
  }

  createMap() {
    // create our map
    this.bgMap = this.make.tilemap({ key: "level1" }); // key from the json file

    // add tileset image
    this.tiles = this.bgMap.addTilesetImage("terrainTiles_default"); // key of our tileset

    // create our background layer (name of the layer from tilemap, tilesetm positions)
    this.backgroundLayer = this.bgMap.createStaticLayer(
      "Background",
      this.tiles,
      0,
      0
    );

    // add tower
    this.add.image(480, 480, "base");
  }
}
