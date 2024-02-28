import Phaser from "phaser";
import events from "./EventCenter";
import { getPhrase } from "../services/translations";

export default class UI extends Phaser.Scene {
  constructor() {
    super("ui");
  }

  init(data) {
    this.health = data.health || 3;
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.stamina = data.stamina || 100;
    this.dynamiteCuantity = data.dynamiteCuantity || 22;
  }

  create() {
    this.font = "times ";

    this.dynamiteText = this.add.text(1800, 10, `${this.dynamiteCuantity}`, {
      font: "60px Arial",
      color: "#ffffff",
    });

    this.lantern = this.add.image(1920 * 0.05, 43, "lantern");

    this.levelText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      `${getPhrase("Nivel")} ${this.level}`,
      {
        fontFamily: this.font,
        fontSize: "48px",
        color: "#fff",
        backgroundColor: "red",
      }
    );
    this.levelText.setOrigin(0.5);

    this.enemyText = this.add.text(this.cameras.main.width / 2,
     1080* 0.8,
      getPhrase("Presiona la barra espaciadora para aturdir enemigos"), {
      fontFamily: this.font,
      fontSize: "48px",
      color: "red",
    } );
    this.enemyText.setOrigin(0.5);

    this.tweens.add({
      targets: this.levelText && this.enemyText, 
      alpha: 0, 
      duration: 4000, 
      ease: "Linear", 
      onComplete: () => {
        this.levelText.destroy(); 
      },
    });

    this.dynamite = this.add.image(1750, 43, "dynamite");
    events.on("actualizarDatos", this.updates, this);
    events.on('canUseFlashChanged', this.updateCanUseFlash, this);
  }

  updates(data) {
    this.level = data.level;
    this.score = data.score;
    this.dynamiteCuantity = data.dynamiteCuantity;

    this.dynamiteText.setText(`${this.dynamiteCuantity}`);

  }

  updateCanUseFlash(data) {
    this.canUseFlash = data.canUseFlash; 
    if (this.canUseFlash === true) {
      this.lantern.setTexture("lanternOff");
    } else {
      this.lantern.setTexture("lantern");
    }
  }
}
