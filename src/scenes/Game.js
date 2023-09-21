import Phaser from "phaser";
import PrincipalCharacter from '../components/PrincipalCharacter';
// import events from "./EventCenter";
import DynamiteGroup from "../components/Dynamite";

export default class Game extends Phaser.Scene {
  character;

  velocity;

  stamina;

  staminaBar;

  StaminaBarHeight;

  constructor() {
    super("game");
  }

  init(data) {
    this.velocity = data.velocity || 400;
    this.stamina = 100;
    this.level = data.level || 1;
    this.score = data.score || 0;
  }

  create() {

    this.scene.launch("ui", {
      level: this.level,
      score: this.score,
    });

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

  this.dynamita = this.dynamite.getFirstDead();
  if (this.dynamita) {
    this.dynamita.setPosition(960, 500); // Establecer la posición de la dinamita
    this.dynamita.setActive(true).setVisible(true); // Activar y hacer visible la dinamita
  }
}
  

  

  update() {
    // Actualizar el personaje
    this.character.update();
  }
}


