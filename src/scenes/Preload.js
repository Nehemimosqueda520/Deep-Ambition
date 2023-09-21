import Phaser from "phaser";
// import events from "./EventCenter";

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

preload() {
  this.load.image("principal-character", "./assets/sprites/principal-character.png");
}

create () {
  this.scene.start("principal-menu");
  }
}
