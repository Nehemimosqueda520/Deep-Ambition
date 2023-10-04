import Phaser from "phaser";
import PrincipalCharacter from '../components/PrincipalCharacter';
import events from "./EventCenter";
import DynamiteGroup from "../components/Dynamite";

export default class Game extends Phaser.Scene {
  character;

  dynamite;

  velocity;

  stamina;

  staminaBar;

  StaminaBarHeight;

  gameSong;

  dynamiteCuantity;

  level1Tile;

  constructor() {
    super("game");
  }

  init(data) {
    this.velocity = data.velocity || 400;
    this.stamina = 100;
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.dynamiteCuantity = data.dynamiteCuantity || 0;
  }

  create() {

    this.scene.launch("ui", {
      level: this.level,
      score: this.score,
    });

    this.level1Tile = this.make.tilemap({ key: "level1" });

    this.floor = this.level1Tile.addTilesetImage("Atlas", "Floor");
    this.wallCollision = this.level1Tile.addTilesetImage("Atlas", "WallC");
    this.wallDecorative = this.level1Tile.addTilesetImage("Atlas", "WallD");

    this.floorLayer = this.level1Tile.createLayer("Floor", this.floor, 0, 0);
    this.wallCollisionLayer = this.level1Tile.createLayer("WallC", this.wallCollision, 0, 0);
    this.wallDecorativeLayer = this.level1Tile.createLayer("WallD", this.wallDecorative, 0, 0);

    this.gameSong =this.sound.add ("game-song");
    this.gameSong.play();
    this.gameSong.loop = true;

  // Crear el personaje
  this.character = new PrincipalCharacter(
    this,
    100,
    100,
    "principal-character",
    this.velocity
  );
  this.add.existing(this.character);

  //  crear la dinamita
  this.dynamite = new DynamiteGroup(
    this,
  ) 
  this.dynamite.create(300, 500, "dynamite");
  this.dynamite.create(500, 500, "dynamite");
  this.dynamite.create(700, 500, "dynamite");

  //  collider entre dinamita y personaje principal
  this.physics.add.overlap(this.character, this.dynamite, this.hitDynamite, null, this);
  events.on("music", this.musicTransfer, this);
  
  this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

  }

  
  update() {
    // Actualizar el personaje
    this.character.update();

    if (this.keyP.isDown) {
      this.scene.pause()
      this.scene.launch("pause", {
        gameSong: this.gameSong, 
    });
  }
  }

  hitDynamite(character, dynamite) {
    dynamite.disableBody(true, true)
    this.dynamiteCuantity += 1;

    events.emit("actualizarDatos", {
      level: this.level,
      score: this.score,
      dynamiteCuantity: this.dynamiteCuantity
    });
  }

    musicTransfer (data) {
      this.gameSong = data.gameSong;
    }
    
  


}