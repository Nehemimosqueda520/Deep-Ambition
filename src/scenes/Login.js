import Phaser from "phaser";
import { getPhrase } from "../services/translations";

export default class Login extends Phaser.Scene {
  constructor() {
    super("login");
  }

  create() {
    // agregar un texto "Login" en la parte superior de la pantalla
    this.lobbyScene = "principal-menu";
    this.add
      .text(1920 / 2, 100, getPhrase("Ingresar por:"), {
        fontFamily: "Times New Roman",
        fontSize: 48,
      })
      .setOrigin(0.5);
    // Agregar un texto "Ingresas de forma Anonima" que al hacer clic me levante un popup js para ingresar los datos
    this.add
      .image(1920 * 0.75, 500, "anonymous-logo")
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
      .image(1920 * 0.25, 500, "google-logo")
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
      .image(1920 / 2, 500, "github-logo")
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
