import Phaser from "phaser";

import events from "./EventCenter";
import { getPhrase } from "../services/translations";

export default class Pause extends Phaser.Scene {
 constructor() {
    super("pause");
  }

  init(data) {
    this.volume = data.volume || 1;
    this.visibleVolume = data.visibleVolume || 100;
    this.gameSong = data.gameSong;
  }

  create() {
    this.add
      .image(1920/2, 1080/2, "image-for-languages");
      
      this.color = "#680005";
      this.fontFamily = "Times new roman";
    this.add
      .text(1920 * 0.25, 1080 * 0.25, getPhrase("Pausa"), {
        fontFamily: this.fontFamily,
        fontSize: "50px",
        color: this.color,
        align: "center",
      })

    this.backButton = this.add
    .text(
      1920 * 0.75,
      1080 * 0.8,
      getPhrase("Reanudar"),
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
      this.scene.resume("game");
      this.scene.stop("pause");
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
    events.emit("music", {
      gameSong: this.gameSong,
    });

    if (this.cursor.left.isDown && this.volume > 0.1) {
      this.volume -= 0.1;
      this.visibleVolume -= 10;
      this.gameSong.setVolume(this.volume);
      this.volumeText.setText(`Volumen                                 ${this.visibleVolume}%`);
    } else if (this.cursor.right.isDown && this.volume < 1) {
      this.volume += 0.1;
      this.visibleVolume += 10;
      this.gameSong.setVolume(this.volume);
      this.volumeText.setText(`Volumen                                 ${this.visibleVolume}%`);
    }
  }
}
