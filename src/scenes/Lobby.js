import Phaser from "phaser";
// import events from "./EventCenter";
import PrincipalCharacter from '../components/PrincipalCharacter';

export default class Lobby extends Phaser.Scene {

  velocity;

  character;

  constructor() {
    super("lobby");
  }


init() {
  this.velocity = 100;
}

create () {
  this.character = new PrincipalCharacter(
    this, 
    100, 
    100, 
    "principal-character", 
    this.velocity); // Ajusta los valores según tus necesidades
    this.add.existing(this.character);

}

update() {
  // this.events.emit("update");
  this.character.update();
}
}
