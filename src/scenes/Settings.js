import Phaser from "phaser";
import { getPhrase } from "../services/translations";

import events from "./EventCenter";

export default class Settings extends Phaser.Scene {
  constructor() {
    super("settings");

  }

  init(data) {
    this.volume = data.volume || 1;
    this.visibleVolume = data.visibleVolume || 100;

    this.mainMenuSong = data.mainMenuSong;
  }

  create() {
    this.add
      .image(1920/2, 1080/2, "image-for-languages");
      
      this.color = "#680005";
      this.fontFamily = "Times new roman";
    this.add
      .text(1920 * 0.25, 1080 * 0.25, getPhrase("Configuración"), {
        fontFamily: this.fontFamily,
        fontSize: "50px",
        color: this.color,
        align: "center",
      })
      .setOrigin(0.5);

    this.backButton = this.add
      .text(
        1920 * 0.75,
        1080 * 0.8,
        getPhrase("Volver"),
        {
          fontFamily: this.fontFamily,
          fontSize: "40px",
          color: this.color,
        }
      )
      .setInteractive();

    this.backButton.on("pointerover", () => {
      this.backButton.setScale(1.2); 
    });

    this.backButton.on("pointerout", () => {
      this.backButton.setScale(1); 
    });

    this.backButton.on("pointerdown", () => {
      this.scene.stop("settings");
      this.scene.resume("principal-menu", {
        visibleVolume: this.visibleVolume,
        volume: this.volume,
      });
    });

    this.volumeText = this.add.text(
      1920 * 0.25,
      1080 * 0.33,
      `Volumen                                 ${this.visibleVolume}%`,
      {
        fontFamily: this.fontFamily,
        fontSize: "20px",
        color: this.color,
      }
    );

    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    events.emit("music-settings", {
      mainMenuSong: this.mainMenuSong,
    });

    if (this.cursor.left.isDown && this.volume > 0.1) {
      this.volume -= 0.1;
      this.visibleVolume -= 10;
      this.mainMenuSong.setVolume(this.volume);
      this.volumeText.setText(`Volumen                                 ${this.visibleVolume}%`);
    } else if (this.cursor.right.isDown && this.volume < 1) {
      this.volume += 0.1;
      this.visibleVolume += 10;
      this.volumeText.setText(`Volumen                                 ${this.visibleVolume}%`);
      this.mainMenuSong.setVolume(this.volume);
    }
  }
}
