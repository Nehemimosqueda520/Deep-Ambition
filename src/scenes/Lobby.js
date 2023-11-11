import Phaser from "phaser";
import events from "./EventCenter";
import PrincipalCharacter from "../components/PrincipalCharacter";

export default class Lobby extends Phaser.Scene {
  velocity;

  character;

  constructor() {
    super("lobby");
  }

  init(data) {
    this.velocity = data.velocity || 400;
    this.level = data.level || 0;
    this.health = data.health || 3;
    this.dynamiteCuantity = 0;
  }

  create() {
    this.lobbyTile = this.make.tilemap({ key: "lobby-tile" });
    this.objectsLayer = this.lobbyTile.getObjectLayer("doors");
    this.atlas = this.lobbyTile.addTilesetImage("Atlas", "Atlas");
    this.floorLayer = this.lobbyTile.createLayer("Floor", this.atlas, 0, 0);
    this.wallCollisionLayer = this.lobbyTile.createLayer(
      "WallC",
      this.atlas,
      0,
      0
    );
    this.wallCollisionLayer.setDepth(1);
    this.wallCollisionLayer.setCollisionByProperty({ colision: true });

    this.lobbySong = this.sound.add("lobby-song", { loop: true });
    this.lobbySong.play();

    this.spawnPoint = this.lobbyTile.findObject("doors", (obj) => obj.name === "1");
    this.spawnPoint2 = this.lobbyTile.findObject("doors", (obj) => obj.name === "2");
    this.spawnPoint3 = this.lobbyTile.findObject("doors", (obj) => obj.name === "3");

    this.Level1Door = this.physics.add
      .sprite(this.spawnPoint.x, this.spawnPoint.y, "door")
      .setImmovable();
    this.Level1Door.setFrame(3);
    this.Level1Door.setDepth(1);
    this.Level2Door = this.physics.add
      .sprite(this.spawnPoint2.x, this.spawnPoint2.y, "door")
      .setImmovable();
      this.Level2Door.setDepth(1);
    this.Level3Door = this.physics.add
      .sprite(this.spawnPoint3.x, this.spawnPoint3.y, "door")
      .setImmovable();
      this.Level3Door.setDepth(1);
    this.character = new PrincipalCharacter(
      this,
      960,
      540,
      "principal-character",
      this.velocity
    );
    this.character.setDepth(2);
    this.add.existing(this.character);
    this.physics.add.collider(
      this.Level1Door,
      this.character,
      this.goToLevel1,
      null,
      this
    );
    this.physics.add.collider(
      this.Level2Door,
      this.character,
      this.goTolevel2,
      null,
      this
    );
    this.physics.add.collider(
      this.Level3Door,
      this.character,
      this.goToLevel3,
      null,
      this
    );

    // this.physics.add.collider(this.character, this.wallCollisionLayer);
  }

  update() {
    events.emit("actualizarDatos", {
      level: this.level,
      health: this.health,
      dynamiteCuantity: this.dynamiteCuantity,
    });
    this.character.update();

    

    if (this.level >= 1) {
      this.Level2Door.setFrame(0);
    } else {
      this.Level2Door.setFrame(1);
    }

    if (this.level >= 2) {
      this.Level3Door.setFrame(0);
    }  else {
      this.Level3Door.setFrame(1);
    }
  }

  goToLevel1() {
    this.level = 1;
    this.dynamiteCuantity = 22;
    this.scene.start("game", {
      velocity: this.velocity,
      level: this.level,
      health: this.health,
      dynamiteCuantity: this.dynamiteCuantity,
    });
    this.lobbySong.stop();
    this.lobbySong.setLoop(false);
  }

  goTolevel2() {
    if (this.level >= 1) {
      this.level = 2;
      this.dynamiteCuantity = 22;
      this.scene.start("game", {
        velocity: this.velocity,
        level: this.level,
        health: this.health,
        dynamiteCuantity: this.dynamiteCuantity,
      });
      this.lobbySong.stop();
      this.lobbySong.setLoop(false);
    }
  }

  goToLevel3() {
    if (this.level >= 2) {
      this.level = 3;
      this.dynamiteCuantity = 22;
      this.scene.start("game", {
        velocity: this.velocity,
        level: this.level,
        health: this.health,
        dynamiteCuantity: this.dynamiteCuantity,
      });
      this.lobbySong.stop();
      this.lobbySong.setLoop(false);
    }
  }
}
