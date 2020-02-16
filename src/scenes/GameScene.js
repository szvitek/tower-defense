import Phaser from "phaser";
import map from "../config/map";
import Enemy from "../objects/Enemy";
import Turret from "../objects/Turret";
import Bullet from "../objects/Bullet";
import levelConfig from "../config/levelConfig";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.map = map.map(arr => arr.slice());
    this.level = 1;
    this.nextEnemy = 0;
    this.score = 0;
    this.baseHealth = levelConfig.initial.baseHealth;
    this.availableTurrets = levelConfig.initial.numOfTurrets;
    this.roundStarted = false;
    this.remainingEnemies =
      levelConfig.initial.numOfEnemies +
      this.level * levelConfig.incremental.numOfEnemies;

    this.events.emit("displayUI");
    this.events.emit("updateScore", this.score);
    this.events.emit("updateHealth", this.baseHealth);
    this.events.emit("updateTurrets", this.availableTurrets);
    this.events.emit("updateEnemies", this.remainingEnemies);

    // reference to UI scene
    this.uiScene = this.scene.get("UI");
  }

  create() {
    this.events.emit("startRound", this.level);
    this.uiScene.events.on("roundReady", () => {
      this.roundStarted = true;
    });

    this.createMap();
    this.createPath();
    this.createCursor();
    this.createGroups();

    this.input.on("pointerdown", pointer => this.placeTurret(pointer));

    this.physics.add.overlap(this.enemies, this.bullets, (enemy, bullet) =>
      this.damageEnemy(enemy, bullet)
    );
  }

  update(time, delta) {
    // if its time for the next enemy
    if (
      time > this.nextEnemy &&
      this.roundStarted &&
      this.enemies.countActive(true) < this.remainingEnemies
    ) {
      let enemy = this.enemies.getFirstDead();
      if (!enemy) {
        enemy = new Enemy(this, 0, 0, this.path);
        this.enemies.add(enemy);
      }
      enemy.setActive(true);
      enemy.setVisible(true);

      // place the enemy at the start of the path
      enemy.startOnPath(this.level);

      this.nextEnemy = time + 2000;
    }
  }

  updateScore(score) {
    this.score += score;
    this.events.emit("updateScore", this.score);
  }

  updateHealth(health) {
    this.baseHealth -= health;
    this.events.emit("updateHealth", this.baseHealth);

    if (this.baseHealth < 1) {
      this.events.emit("hideUI");
      this.scene.start("Title");
    }
  }

  levelUp() {
    // stop round
    this.roundStarted = false;

    // increment level
    this.level++;

    // increment number of turrets
    this.updateTurrets(levelConfig.incremental.numOfTurrets);

    // increment number of enemies
    this.updateEnemies(
      levelConfig.initial.numOfEnemies +
        this.level * levelConfig.incremental.numOfEnemies
    );

    this.events.emit("startRound", this.level);
  }

  updateEnemies(numberOfEnemies) {
    this.remainingEnemies += numberOfEnemies;
    this.events.emit("updateEnemies", this.remainingEnemies);
    if (this.remainingEnemies <= 0) {
      this.levelUp();
    }
  }

  updateTurrets(numberOfTurrets) {
    this.availableTurrets += numberOfTurrets;
    this.events.emit("updateTurrets", this.availableTurrets);
  }

  createGroups() {
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });

    this.turrets = this.add.group({
      classType: Turret,
      runChildUpdate: true
    });

    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });
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
    return this.map[i][j] === 0 && this.availableTurrets > 0;
  }

  createPath() {
    this.graphics = this.add.graphics();
    // the path the enemies follow
    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 163);
    this.path.lineTo(480, 163);
    this.path.lineTo(480, 544);

    // visualizing the path
    // this.graphics.lineStyle(3, 0xffffff, 1);
    // this.path.draw(this.graphics);
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

  getEnemy(x, y, distance) {
    const enemyUnits = this.enemies.getChildren();
    for (const enemy of enemyUnits) {
      if (
        enemy.active &&
        Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= distance
      ) {
        return enemy;
      }
    }
    return false;
  }

  addBullet(x, y, angle) {
    let bullet = this.bullets.getFirstDead();
    if (!bullet) {
      bullet = new Bullet(this, 0, 0);
      this.bullets.add(bullet);
    }
    bullet.fire(x, y, angle);
  }

  placeTurret(pointer) {
    const i = Math.floor(pointer.y / 64);
    const j = Math.floor(pointer.x / 64);

    if (this.canPlaceTurret(i, j)) {
      let turret = this.turrets.getFirstDead();
      if (!turret) {
        turret = new Turret(this, 0, 0, this.map);
        this.turrets.add(turret);
      }
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(i, j);
      this.updateTurrets(-1);
    }
  }

  damageEnemy(enemy, bullet) {
    if (enemy.active === true && bullet.active === true) {
      bullet.setActive(false);
      bullet.setVisible(false);

      // decrease the enemy hp
      enemy.recieveDamage(levelConfig.initial.bulletDamage);
    }
  }
}
