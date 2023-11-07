import Phaser from "phaser";

import events from "./EventCenter";

import { getPhrase } from "../services/translations";

export default class PrincipalMenu extends Phaser.Scene {
  constructor() {
    super("principal-menu");
  }

  init(data, language) {
    this.volume = data.volume || 1;
    this.visibleVolume = data.visibleVolume || 100;
    this.language = language;
  }

  create() {
    this.BackgroundVideo = this.add.video(
      1920 / 2,
      1080 / 2,
      "main-menu-background"
    );
    this.BackgroundVideo.play(true);
    this.BackgroundVideo.setLoop(true);
    this.BackgroundVideo.setScale(1.05);

    this.fadingOverlay = this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000
      )
      .setOrigin(0);
    this.fadingOverlay.setAlpha(0);

    this.sounds();

    this.color = "#680005";
    this.fontFamily = "Times new roman";

    this.add.text(80, 60, "Deep Ambition", {
      fontFamily: this.fontFamily,
      fontSize: "160px",
      color: "#7D080E",
    });

    this.playText = this.add
      .text(80, 350, getPhrase("Jugar"), {
        fontFamily: this.fontFamily,
        fontSize: "140px",
        color: this.color,
      })
      .setInteractive();

    this.playText.on("pointerover", () => {
      this.playText.setScale(1.2);
      this.pointerSound.play();
    });

    this.playText.on("pointerout", () => {
      this.playText.setScale(1);
    });

    this.playText.on("pointerdown", () => {
      this.scene.start("lobby");
      this.mainMenuSong.stop();
      this.mainMenuSong.loop = false;

      this.tweens.add({
        targets: this.fadingOverlay,
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          this.playCinematic();
        },
      });
    });

    this.settingsText = this.add
      .text(80, 580, getPhrase("Configuración"), {
        fontFamily: this.fontFamily,
        fontSize: "80px",
        color: this.color,
      })
      .setInteractive();

    this.settingsText.on("pointerover", () => {
      this.settingsText.setScale(1.2);
      this.pointerSound.play();
    });

    this.settingsText.on("pointerout", () => {
      this.settingsText.setScale(1);
    });

    this.settingsText.on("pointerdown", () => {
      this.scene.launch("settings", {
        mainMenuSong: this.mainMenuSong,
        volume: this.volume,
        visibleVolume: this.visibleVolume,
      });
      this.scene.pause();
    });

    this.tutorialText = this.add
      .text(80, 790, getPhrase("¿Cómo jugar?"), {
        fontFamily: this.fontFamily,
        fontSize: "80px",
        color: this.color,
      })
      .setInteractive();

    //  hacer lo mismo que con settings
    this.tutorialText.on("pointerover", () => {
      this.tutorialText.setScale(1.2);
      this.pointerSound.play();
    });

    this.tutorialText.on("pointerout", () => {
      this.tutorialText.setScale(1);
    });

    this.tutorialText.on("pointerdown", () => {
      this.scene.launch("tutorial");
      this.scene.pause();
    });

    events.on("music-settings", this.musicTransfer, this);
  }

  sounds() {
    this.mainMenuSong = this.sound.add("main-menu-song");
    this.mainMenuSong.play();
    this.mainMenuSong.loop = true;

    this.pointerSound = this.sound.add("pointerOver");
  }

  playCinematic() {
    this.fadeOutCinematic();
  }

  fadeOutCinematic() {
    this.tweens.add({
      targets: this.fadingOverlay,
      alpha: 0,
      duration: 1000, // Ajusta la duración de la animación de desvanecimiento
      onComplete: () => {
        this.scene.start("lobby");
      },
    });
  }

  musicTransfer(data) {
    this.mainMenuSong = data.mainMenuSong;
  }
}
