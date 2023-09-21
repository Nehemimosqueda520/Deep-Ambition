import Phaser from "phaser";
import events from "./EventCenter";

export default class UI extends Phaser.Scene {

  health;

  score;

  level;

  constructor() {
    super("ui");
  }

  init (data) {
    this.health = data.health || 3;
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.stamina = data.stamina || 100;
  }


  create () {
    this.levelText = this.add.text(
      10,
      10,
      `Nivel: ${this.level} - Puntos ${this.score}`,
      {
        font: "12px Arial",
        color: "#ffffff",
      }
    );
    events.on("actualizarDatos", this.updates, this);
  }

updates (data) {
  this.level = data.level;
  this.score = data.score;

  this.levelText.setText(`Nivel: ${this.level} - Puntos ${this.score}`);
}
}
