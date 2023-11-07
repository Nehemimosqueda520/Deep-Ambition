import Phaser from "phaser";
import { getPhrase } from "../services/translations";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("tutorial");

    // Definir valores para las variables de tamaño y posición del pop-up
    this.popupWidth = 600;
    this.popupHeight = 400;
    this.popupX = (1920 - this.popupWidth) / 2;
    this.popupY = (1080 - this.popupHeight) / 2;
  }

  create() {
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
      .text(1920 / 2, this.popupY + 20, getPhrase("¿Cómo jugar?"), {
        fontSize: "32px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5);

    // Botón para volver al menú principal
    this.backButton = this.add
      .text(
        this.popupX + 50,
        this.popupY + this.popupHeight - 50,
        getPhrase("Volver"),
        {
          fontSize: "20px",
          color: "#fff",
        }
      )
      .setInteractive();

    this.backButton.on("pointerover", () => {
      this.backButton.setScale(1.2); // Cambia el tamaño cuando el ratón está sobre él
    });

    this.backButton.on("pointerout", () => {
      this.backButton.setScale(1); // Restaura el tamaño cuando el ratón sale
    });

    this.backButton.on("pointerdown", () => {
      // Detener la escena de configuración
      this.scene.stop("tutorial");
      this.scene.resume("principal-menu");
    });
  }
}
