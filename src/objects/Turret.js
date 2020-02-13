import Phaser from "phaser";
// import levelConfig from "../config/levelConfig";

export default class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y, map) {
    super(scene, x, y, "tower");

    this.map = map;
    this.nextTick = 0;

    // add the turret to the game
    this.scene.add.existing(this);
    this.setScale(-0.8); // nagative flips the object
  }

  update(time, delta) {
    // time to shoot
    if (time > this.nextTick) {
      this.fire();
      this.nextTick = time + 1000;
    }
  }

  place(i, j) {
    this.x = j * 64 + 32;
    this.y = i * 64 + 32;
    this.map[i][j] = 1;
  }

  fire() {
    const enemy = this.scene.getEnemy(this.x, this.y, 100);
    if (enemy) {
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this,
        y,
        enemy.x,
        enemy.y
      );
      this.scene.addBullet(this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  }
}
