import Phaser from "phaser";
import { getPhrase } from "../services/translations";

export default class Login extends Phaser.Scene {
  constructor() {
    super("login");
  }

  create() {
    this.lobbyScene = "principal-menu";
    this.add
      .text(1920 / 2, 100, getPhrase("Ingresar por:"), {
        fontFamily: "Times New Roman",
        fontSize: 48,
        color: "#7D080E",
        backgroundColor: "11111"

      })
      .setOrigin(0.5)
      .setDepth(1);

      this.background = this.add.image(1920/2, 1080/2, "image-for-languages");
      this.background.setDepth(0);

    this.add
      .image(1920 * 0.33, 300, "anonymous-logo")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.firebase
          .signInAnonymously()
          .then(() => {
            this.scene.start(this.lobbyScene);
          })
          .catch((error) => {
            console.log("🚀 ~ file: Login.js:74 ~ .catch ~ error", error);
          });
      });

    // agregar un texto centrado "Ingresar con Google" que al hacer clic me levante un popup js para ingresar los datos
    this.add
      .image(1920 *0.33, 700, "google-logo")
      .setInteractive()
      .on("pointerdown", () => {
        this.firebase
          .signInWithGoogle()
          .then(() => {
            this.scene.start(this.lobbyScene);
          })
          .catch((error) => {
            console.log("🚀 ~ file: Login.js:74 ~ .catch ~ error", error);
          });
      });

    // agregar un texto "Ingresar con GitHub" que al hacer clic me levante un popup js para ingresar los datos
    this.add
      .image(1920 * (1 - 0.33), 500, "github-logo")
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.firebase
          .signInWithGithub()
          .then(() => {
            this.scene.start(this.lobbyScene);
          })
          .catch((error) => {
            console.log("🚀 ~ file: Login.js:74 ~ .catch ~ error", error);
          });
      });
  }
}
