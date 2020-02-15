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
    this.turretsText = this.add.text(430, 5, "Available turrets : 0", {
      fontSize: "16px",
      fill: "#fff"
    });
    this.roundTimeText = this.add.text(180, 5, "Round Start In: 10", {
      fontSize: "16px",
      fill: "#fff"
    });
    this.hideUIElements();
  }

  hideUIElements() {
    this.scoreText.alpha = 0;
    this.healthText.alpha = 0;
    this.turretsText.alpha = 0;
    this.roundTimeText.alpha = 0;
  }

  setupEvents() {
    this.gameScene.events.on("displayUI", () => {
      this.scoreText.alpha = 1;
      this.healthText.alpha = 1;
      this.turretsText.alpha = 1;
    });

    this.gameScene.events.on("updateScore", score => {
      this.scoreText.setText(`Score: ${score}`);
    });

    this.gameScene.events.on("updateHealth", health => {
      this.healthText.setText(`Base Health: ${health}`);
    });

    this.gameScene.events.on("updateTurrets", turrets => {
      this.turretsText.setText(`Available turrets: ${turrets}`);
    });

    this.gameScene.events.on("hideUI", () => {
      this.hideUIElements();
    });

    this.gameScene.events.on("startRound", () => {
      this.roundTimeText.alpha = 1;
      const timedEvent = this.time.addEvent({
        delay: 1000,
        repeat: 9,
        callback: () => {
          this.roundTimeText.setText(
            `Round Start In: ${timedEvent.repeatCount}`
          );
          if (timedEvent.repeatCount === 0) {
            this.events.emit("roundReady");
            this.roundTimeText.alpha = 0;
          }
        }
      });
    });
  }
}
