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
    // Fondo para el pop-up de configuración
    this.add
      .image(1920/2, 1080/2, "image-for-languages");
      
      this.color = "#680005";
      this.fontFamily = "Times new roman";
    // Título del pop-up de configuración
    this.add
      .text(1920 * 0.25, 1080 * 0.25, getPhrase("Pausa"), {
        fontFamily: this.fontFamily,
        fontSize: "50px",
        color: this.color,
        align: "center",
      })

    // Botón para volver al menú principal
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

    //  hacer que backButton cambie de tamaño si lo pasas con el raton

    this.backButton.on("pointerover", () => {
      this.backButton.setScale(1.2); // Cambia el tamaño cuando el ratón está sobre él
    });

    this.backButton.on("pointerout", () => {
      this.backButton.setScale(1); // Restaura el tamaño cuando el ratón sale
    });

    this.backButton.on("pointerdown", () => {
      // Reanudar la escena del juego
      this.scene.resume("game");
      // Detener la escena de pausa
      this.scene.stop("pause");
    });

    // Agregar etiquetas para los controles deslizantes
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

    // crear cursor
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
