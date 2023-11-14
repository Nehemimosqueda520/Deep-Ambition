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
    this.level = 0;
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
    this.fadingOverlay.setAlpha(0)
    .setDepth(4);

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
      this.pointerdownSound.play();
      this.tweens.add({
        targets: this.fadingOverlay,
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          this.playCinematic();
          this.mainMenuSong.stop();
          this.mainMenuSong.loop = false;

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

    events.on("music-settings", this.musicTransfer, this);

    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  sounds() {
    this.mainMenuSong = this.sound.add("main-menu-song");
    this.mainMenuSong.play();
    this.mainMenuSong.loop = true;

    this.pointerSound = this.sound.add("pointerOver");
    this.pointerdownSound = this.sound.add("PointerdownFX");
  }

  playCinematic() {
    // Obtén una referencia al video usando la notación this
    this.video = this.add.video(1980 / 2, 1080/2, "main-cinematic");

    // Reproduce el video
    this.video.play();
    this.video.setDepth(4);

    // Establece un evento para verificar si la tecla de espacio es presionada durante la cinematica
    this.input.keyboard.once('keydown-SPACE', () => {
      // Si la tecla de espacio es presionada, ejecuta la función fadeOutCinematic
      this.fadeOutCinematic();
  }, this);
    // Establece un evento para cuando el video termine
    this.video.on('complete',  () =>  {
        // Cuando el video termina, ejecuta la función fadeOutCinematic
        this.fadeOutCinematic();
    }, this);
}

  fadeOutCinematic() {
    this.scene.start("lobby", {
      level: this.level
    });
  }

  musicTransfer(data) {
    this.mainMenuSong = data.mainMenuSong;
  }
}
