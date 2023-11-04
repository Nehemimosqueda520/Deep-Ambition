import Phaser from "phaser";

import events from "./EventCenter";

export default class Pause extends Phaser.Scene {
 constructor() {
    super("pause");

    // Definir valores para las variables de tamaño y posición del pop-up
    this.popupWidth = 600;
    this.popupHeight = 400;
    this.popupX = (1920 - this.popupWidth) / 2;
    this.popupY = (1080 - this.popupHeight) / 2;
  }

  init(data) {
    this.volume = data.volume || 1;
    this.visibleVolume = data.visibleVolume || 100;
    this.gameSong = data.gameSong;
  }

  create() {
    // Fondo para el pop-up de configuración
    this.add
      .rectangle(
        this.popupX,
        this.popupY,
        this.popupWidth,
        this.popupHeight,
        0x000000
      )
      .setOrigin(0);

    // Contorno blanco alrededor del pop-up
    this.popupOutline = this.add.graphics();
    this.popupOutline.lineStyle(2, 0xffffff);
    this.popupOutline.strokeRect(
      this.popupX,
      this.popupY,
      this.popupWidth,
      this.popupHeight
    );

    // Título del pop-up de configuración
    this.add
      .text(1920 / 2, this.popupY + 20, "pausa", {
        fontSize: "32px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5);

    // Botón para volver al menú principal
    this.backButton = this.add
      .text(this.popupX + 50, this.popupY + 70, "reanudar", {
        fontSize: "20px",
        color: "#fff",
      })
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
      this.popupX + 50,
      this.popupY + 50,
      `Volumen             ${this.visibleVolume}%`,
      {
        fontSize: "20px",
        color: "#fff",
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
      this.volumeText.setText(`Volumen             ${this.visibleVolume}%`);
    } else if (this.cursor.right.isDown && this.volume < 1) {
      this.volume += 0.1;
      this.visibleVolume += 10;
      this.gameSong.setVolume(this.volume);
      this.volumeText.setText(`Volumen             ${this.visibleVolume}%`);
    }
  }
}
