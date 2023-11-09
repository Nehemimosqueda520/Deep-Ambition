import Phaser from "phaser";
import PrincipalCharacter from "../components/PrincipalCharacter";
import events from "./EventCenter";
import DynamiteGroup from "../components/Dynamite";
import Enemy from "../components/Enemys";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.timeElapsed = 0;
    this.flashActive = false; // Variable para el estado del flash
    this.flashDuration = 1000; // Duración del flash en milisegundos
    this.flashTimer = 0; // Temporizador para el flash
    this.boostActive = false; // Variable para el estado del impulso
    this.boostDuration = 10000; // Duración del impulso en milisegundos (10 segundos)
    this.boostCooldown = 10000; // Tiempo de espera entre impulsos en milisegundos (10 segundos)
    this.boostTimer = 0;
  }

  init(data) {
    this.velocity = data.velocity || 400;
    this.level = data.level || 1;
    this.dynamiteCuantity = data.dynamiteCuantity || 22;
    this.health = data.health || 3;
  }

  create() {
    this.user = this.firebase.getUser();
    this.scene.launch("ui", {
      level: this.level,
    });

    this.gameSong = this.sound.add("game-song");
    this.gameSong.play({ loop: true });

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

    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
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
    this.wallDecorativeLayer.setDepth(3);
    this.wallCollisionLayer.setCollisionByProperty({ colision: true });
  }

  createCharacter() {
    this.spawnPoint = this.level1Tile.findObject(
      "objects",
      (obj) => obj.name === "principalCharacter"
    );
    if (this.level <= 1) {
      // Nivel 1: Flash activado
      this.character = new PrincipalCharacter(
        this,
        this.spawnPoint.x,
        this.spawnPoint.y,
        "principal-character",
        this.velocity
      );
    } else {
      // Nivel 2 y posteriores: Flash desactivado, impulso activado
      this.character = new PrincipalCharacter(
        this,
        this.spawnPoint.x,
        this.spawnPoint.y,
        "principal-character",
        this.velocity + this.level * 100, // Aumenta la velocidad en cada nivel (ajusta según tus necesidades)
        false // Flash desactivado
      );
      this.boostActive = false; // Impulso desactivado
    }
    this.character.setDepth(2);
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

    this.boostKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
  }

  createDynamite() {
    this.dynamite = new DynamiteGroup(this, 0); // Ajusta la cantidad según tus necesidades
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
        const enemy = new Enemy(this, x, y, "enemy", this.character, 1000, this.level); // Ajusta la velocidad según tus necesidades
        this.enemyGroup.add(enemy);
      }
    });
    this.enemyGroup.setDepth(2);
  }

  update(time, delta) {
    try {
      this.character.update();

      this.enemyGroup.getChildren().forEach((enemy) => {
        if (enemy instanceof Enemy) {
          enemy.update();
        }
      });

      if (this.keyP.isDown) {
        this.scene.pause();
        this.scene.launch("pause", {
          gameSong: this.gameSong,
        });
      }

      if (this.dynamiteCuantity <= 0) {
        this.scene.start("win", {
          level: this.level,
        });
        this.gameSong.stop();
        this.gameSong.loop = false;
        this.saveGameData();
      }

      this.timeElapsed += delta;

      if (!this.boostActive && this.level > 1) {
        // Si el impulso no está activo y es un nivel mayor a 1, comienza el tiempo de espera
        this.boostTimer += delta;
        if (this.boostTimer >= this.boostCooldown) {
          // Si ha pasado el tiempo de espera, el impulso está disponible
          if (this.input.keyboard.checkDown(this.boostKey, this.boostCooldown)) {
            // Verifica si se ha presionado la tecla para activar el impulso
            this.boostActive = true;
            this.boostTimer = 0; // Restablece el temporizador del impulso
          }
        }
      }

      // Si el impulso está activo, actualiza su duración
      if (this.boostActive) {
        this.boostTimer += delta;
        if (this.boostTimer >= this.boostDuration) {
          this.boostActive = false; // Desactiva el impulso cuando la duración ha transcurrido
          this.boostTimer = 0; // Restablece el temporizador del impulso
        }
      }

      events.emit("actualizarDatos", {
        level: this.level,
        dynamiteCuantity: this.dynamiteCuantity,
        health: this.health,
        timeElapsed: this.timeElapsed,
      });
    } catch (error) {
      console.error("Error en el juego:", error);
      // Reiniciar la escena
      this.scene.resume();
    }
  }

  hitDynamite(character, dynamite) {
    dynamite.disableBody(true, true);
    this.dynamiteCuantity -= 1;
    events.emit("actualizarDatos", {
      level: this.level,
      dynamiteCuantity: this.dynamiteCuantity,
      health: this.health,
    });
  }

  damage() {
    this.level -= 1;
    this.scene.start("lose", {
      level: this.level,
      health: this.health,
    });
    this.gameSong.stop();
    this.gameSong.loop = false;



    events.emit("actualizarDatos", {
      level: this.level,
      dynamiteCuantity: this.dynamiteCuantity,
      health: this.health,
    });
  }

  saveGameData() {
    this.firebase.saveGameData(this.user.uid, {
      level: this.level,
      health: this.health,
      day: new Date(),
      timeElapsed: this.timeElapsed,
    });

  }

  musicTransfer(data) {
    this.gameSong = data.gameSong;
  }
}