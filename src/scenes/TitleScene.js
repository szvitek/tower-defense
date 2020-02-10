import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    this.createTitle();
    this.createPlayButton();
  }

  createTitle() {
    // title image
    this.titleImage = this.add.image(0, 0, "title");
    this.centerObject(this.titleImage, 1);
  }

  createPlayButton() {
    // play button
    this.gameButton = this.add.sprite(0, 0, "button1").setInteractive();
    this.centerObject(this.gameButton, -1);

    this.gameText = this.add.text(0, 0, "Play", {
      fontSize: "32px",
      fill: "#fff"
    });
    Phaser.Display.Align.In.Center(this.gameText, this.gameButton);

    this.gameButton.on("pointerdown", () => {
      this.scene.start("Game");
    });

    this.gameButton.on("pointerover", () => {
      this.gameButton.setTexture("button2");
    });

    this.gameButton.on("pointerout", () => {
      this.gameButton.setTexture("button1");
    });
  }

  centerObject(gameObject, offset = 0) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    gameObject.x = width / 2;
    gameObject.y = height / 2 - offset * 100;
  }
}
