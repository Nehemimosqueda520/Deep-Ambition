import Phaser from "phaser";
import events from "./EventCenter";

export default class UI extends Phaser.Scene {

  health;

  score;

  level;

  stamina;

  dynamiteCuantity;

  constructor() {
    super("ui");
  }

  init (data) {
    this.health = data.health || 3;
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.stamina = data.stamina || 100;
    this.dynamiteCuantity = data.dynamiteCuantity || 0;
  }


  create () {
    this.levelText = this.add.text(
      10,
      10,
      `Nivel: ${this.level} - Puntos ${this.score} - dinamita ${this.dynamiteCuantity}`,
      {
        font: "30px Arial",
        color: "#ffffff",
      }
    );
    events.on("actualizarDatos", this.updates, this);
  }

updates (data) {
  this.level = data.level;
  this.score = data.score;
  this.dynamiteCuantity = data.dynamiteCuantity;

  this.levelText.setText(`Nivel: ${this.level} - Puntos ${this.score} - dinamita ${this.dynamiteCuantity}`);
}
}
