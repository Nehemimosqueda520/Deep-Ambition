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
  this.level = data.level || 1;
  this.score = data.score || 0;
  this.dynamiteCuantity = data.dynamiteCuantity || 0;
}

create () {
  this.character = new PrincipalCharacter(
    this, 
    960, 
    540, 
    "principal-character", 
    this.velocity); 
    this.add.existing(this.character);

    this.Level1Door = this.add.rectangle(100, 100, 100, 100, 0xffffff);
    this.physics.add.existing(this.Level1Door); // Agrega físicas al objeto
    this.Level2Door = this.add.rectangle(500, 100, 100, 100, 0xffffff);
    this.physics.add.existing(this.Level2Door);
    this.Level3Door = this.add.rectangle(1000, 100, 100, 100, 0xffffff);
    this.physics.add.existing(this.Level3Door);

  

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
    this.scene.start("game", {
      velocity: this.velocity,
      level: this.level,
      score: this.score,
      dynamiteCuantity: this.dynamiteCuantity
    });
  }

  goTolevel2() {
    this.level = 2;
    this.scene.start("game", {
      velocity: this.velocity,
      level: this.level,
      score: this.score,
      dynamiteCuantity: this.dynamiteCuantity
    });
  }

  goToLevel3 () {
    this.level = 3;
    this.scene.start("game", {
      velocity: this.velocity,
      level: this.level,
      score: this.score,
      dynamiteCuantity: this.dynamiteCuantity
    });
  }

}

