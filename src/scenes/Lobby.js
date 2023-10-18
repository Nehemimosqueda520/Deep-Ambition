import Phaser from "phaser";
import events from "./EventCenter";
import PrincipalCharacter from '../components/PrincipalCharacter';

export default class Lobby extends Phaser.Scene {

  velocity;

  character;

  constructor() {
    super("lobby");
  }


init(data) {
  this.velocity = data.velocity || 400;
  this.level = data.level || 0;
  this.score = data.score || 0;
  this.dynamiteCuantity = 0;
}

create () {

  this.Level1Door = this.physics.add.sprite(100, 100, "door").setScale(0.5).setImmovable(); 
  this.Level2Door = this.physics.add.sprite(500, 100, "door").setScale(0.5).setImmovable()
  this.Level3Door = this.physics.add.sprite(1000, 100, "door" ).setScale(0.5).setImmovable();
  this.character = new PrincipalCharacter(
    this, 
    960, 
    540, 
    "principal-character", 
    this.velocity); 
    this.add.existing(this.character);
    //  overlap entre level1door y character
    this.physics.add.collider(this.Level1Door, this.character, this.goToLevel1, null, this);
    this.physics.add.collider(this.Level2Door, this.character, this.goTolevel2, null, this);
    this.physics.add.collider(this.Level3Door, this.character, this.goToLevel3, null, this);
}

update() {
  events.emit("actualizarDatos", {
    level: this.level,
    score: this.score,
    dynamiteCuantity: this.dynamiteCuantity
  });
  this.character.update();
}

  goToLevel1() {
    this.level = 1;
    this.dynamiteCuantity = 22;
    this.scene.start("game", {
      velocity: this.velocity,
      level: this.level,
      score: this.score,
      dynamiteCuantity: this.dynamiteCuantity
    });
  }

  goTolevel2() {
    if (this.level === 1) {
    this.level = 2;
    this.dynamiteCuantity = 22;
    this.scene.start("game", {
      velocity: this.velocity,
      level: this.level,
      score: this.score,
      dynamiteCuantity: this.dynamiteCuantity
    });
  }
  }

  goToLevel3 () {
    if (this.level === 2) {
      this.level = 3;
      this.dynamiteCuantity = 22;
      this.scene.start("game", {
        velocity: this.velocity,
        level: this.level,
        score: this.score,
        dynamiteCuantity: this.dynamiteCuantity
      });
    }
}
}

