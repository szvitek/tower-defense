import Phaser from "phaser";

export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 640,
  height: 512,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scale: {
    parent: "body",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT
  }
};
