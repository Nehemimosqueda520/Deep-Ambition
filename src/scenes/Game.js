import Phaser from "phaser";
import PrincipalCharacter from "../components/PrincipalCharacter";
import events from "./EventCenter";
import DynamiteGroup from "../components/Dynamite";
import Enemy from "../components/Enemys";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.timeElapsed = 0;
    this.flashActive = false;
    this.flashDuration = 1000;
    this.flashTimer = 0;
  }

  init(data) {
    this.velocity = data.velocity || 400;
    this.level = data.level || 1;
    this.dynamiteCuantity = data.dynamiteCuantity || 22;
    this.levelsPased = data.levelsPased  ;
  }

  create() {
    this.user = this.firebase.getUser();
    this.scene.launch("ui", {
      level: this.level,
    });

    this.fadingOverlay = this.add
    .rectangle(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000
    )
    this.fadingOverlay.setOrigin(0)
    .setDepth(7);

    this.tweens.add({
      targets: this.fadingOverlay,
      alpha: 0, // Cambiado a 0 para hacer desaparecer el overlay
      duration: 4000,
      onComplete: () => {
        this.fadingOverlay.destroy();
      },
  });
  

    this.gameSong = this.sound.add("game-song").setVolume(0.3);
    this.gameSong.play({ loop: true });

    this.gameSong2 = this.sound.add("game-song2").setVolume(0.5);
    this.gameSong2.play({ loop: true });


    this.dynamiteSound = this.sound.add("dynamite-sound");

    this.initializeLevel();
    this.createCharacter();
    this.createDynamite();
    this.createEnemy();
    this.physics.add.collider(this.character, this.wallCollisionLayer);
    this.physics.add.collider(this.enemyGroup, this.wallCollisionLayer);

    this.physics.add.overlap(
      this.character,
      this.dynamite,
      this.hitDynamite,
      null,
      this
    );
    this.physics.add.overlap(
      this.enemyGroup,
      this.character,
      this.damage,
      null,
      this
    );

    events.on("music", this.musicTransfer, this);

    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  initializeLevel() {
    this.level1Tile = this.make.tilemap({ key: "level1" });
    this.objectsLayer = this.level1Tile.getObjectLayer("objects");
    this.atlas = this.level1Tile.addTilesetImage("Atlas", "Atlas");
    this.floorLayer = this.level1Tile.createLayer("Floor", this.atlas, 0, 0);
    this.wallCollisionLayer = this.level1Tile.createLayer(
      "WallC",
      this.atlas,
      0,
      0
    );
    this.wallCollisionLayer.setDepth(1);
    this.wallDecorativeLayer = this.level1Tile.createLayer(
      "WallD",
      this.atlas,
      0,
      0
    );
    this.wallDecorativeLayer.setDepth(4);
    this.wallCollisionLayer.setCollisionByProperty({ colision: true });
  }

  createCharacter() {

    this.spawnPoint = this.level1Tile.findObject(
      "objects",
      (obj) => obj.name === "principalCharacter"
    );

      // Nivel 1: Flash activado
      this.character = new PrincipalCharacter(
        this,
        this.spawnPoint.x,
        this.spawnPoint.y,
        "principal-character",
        this.velocity
      );
    this.character.setDepth(3);
    this.add.existing(this.character);
    this.cameras.main.startFollow(this.character);
    this.physics.world.setBounds(
      0,
      0,
      this.level1Tile.widthInPixels,
      this.level1Tile.heightInPixels
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.level1Tile.widthInPixels,
      this.level1Tile.heightInPixels
    );

  }

  createDynamite() {
    this.dynamite = new DynamiteGroup(this, 0); 
    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      if (name === "dynamite") {
        const dynamite = this.dynamite
          .create(x, y, "dynamite")
          .setSize(50, 300);
        if (dynamite) {
          dynamite.setActive(true).setVisible(true);
        }
      }
    });
    this.dynamite.setDepth(2);
  }

  createEnemy() {
    this.enemyGroup = this.physics.add.group();

    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      if (name === "enemy") {
        const enemy = new Enemy(this, x, y, "enemy", this.character, 1000, this.level).setScale(0.8); 
        this.enemyGroup.add(enemy);
      }
    });
    this.enemyGroup.setDepth(2);
  }

  update(time, delta) {

    this.fadingOverlay.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY);
      this.character.update();

      this.enemyGroup.getChildren().forEach((enemy) => {
        if (enemy instanceof Enemy) {
          enemy.update();
        }
      });

      if (this.keyEsc.isDown) {
        this.scene.pause();
        this.scene.launch("pause", {
          gameSong: this.gameSong,
        });
      }

      if (this.dynamiteCuantity <= 0) {
        this.gameSong.stop();
        this.gameSong.destroy();
        this.gameSong2.stop();
        this.gameSong2.destroy();
        this.saveGameData();
        this.scene.start("win", {
          level: this.level,
          levelsPased: this.levelsPased 
        });
      }

      this.timeElapsed += delta;

      events.emit("actualizarDatos", {
        level: this.level,
        dynamiteCuantity: this.dynamiteCuantity,
        timeElapsed: this.timeElapsed,
      });
  }

  hitDynamite(character, dynamite) {
    dynamite.disableBody(true, true);
    this.dynamiteCuantity -= 1;
    this.dynamiteSound.play();
    events.emit("actualizarDatos", {
      level: this.level,
      dynamiteCuantity: this.dynamiteCuantity,
    });
  }

  damage() {
    this.scene.pause();

    // Obtén las coordenadas actuales de la cámara
    const cameraX = this.cameras.main.scrollX;
    const cameraY = this.cameras.main.scrollY;

    // Calcula las coordenadas del video en relación con la cámara
    this.videoX = cameraX + 1980 / 2;
    this.videoY = cameraY + 1080 / 2;

    this.video = this.add.video(this.videoX, this.videoY, "jumpscare");
    this.gameSong.stop();
    this.gameSong.destroy();
    this.gameSong2.stop();
    this.gameSong2.destroy();;

    // Reproduce el video
    this.video.play();
    this.video.setDepth(4);

    this.video.on('complete', () => {
        this.level -= 1;
        this.scene.start("lose", {
            level: this.level,
            levelsPassed: this.levelsPased
        });
        events.emit("actualizarDatos", {
            level: this.level,
            dynamiteCuantity: this.dynamiteCuantity,
        });
    }, this);
}

  saveGameData() {
    this.firebase.saveGameData(this.user.uid, {
      level: this.level,
      day: new Date(),
      timeElapsed: this.timeElapsed,
    });

  }

  musicTransfer(data) {
    this.gameSong = data.gameSong;
  }
}