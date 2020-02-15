import Phaser from "phaser";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UI", active: true });
  }

  init() {
    // grab a reference to game scene
    this.gameScene = this.scene.get("Game");
  }

  create() {
    this.setupUIElements();
    this.setupEvents();
  }

  setupUIElements() {
    this.scoreText = this.add.text(5, 5, "Score: 0", {
      fontSize: "16px",
      fill: "#fff"
    });
    this.healthText = this.add.text(10, 490, "Base Health: 0", {
      fontSize: "16px",
      fill: "#fff"
    });
    this.hideUIElements();
  }

  hideUIElements() {
    this.scoreText.alpha = 0;
    this.healthText.alpha = 0;
  }

  setupEvents() {
    this.gameScene.events.on("displayUI", () => {
      this.scoreText.alpha = 1;
      this.healthText.alpha = 1;
    });

    this.gameScene.events.on("updateScore", score => {
      this.scoreText.setText(`Score: ${score}`);
    });

    this.gameScene.events.on("updateHealth", health => {
      this.healthText.setText(`Base Health: ${health}`);
    });

    this.gameScene.events.on("hideUI", () => {
      this.hideUIElements();
    });
  }
}
