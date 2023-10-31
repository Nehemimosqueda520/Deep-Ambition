import Phaser from "phaser";
import { EN_US, ES_AR, PT_BR } from "../enums/languages";
import { getTranslations } from "../services/translations";

// import events from "./EventCenter";

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
    this.loadingText = null;
  }

preload() {
  this.load.spritesheet("principal-character", "./assets/sprites/test.png", {
    frameWidth: 98,
    frameHeight: 214,
  });
  this.load.image ("dynamite" , "./assets/sprites/dynamite.png");
  this.load.image ("enemy", "./assets/sprites/enemy.png");
  this.load.image ("flash-effect", "./assets/particles/flashEffect.webp");
  this.load.image ("Atlas", "./assets/sprites/Atlas.png");
  this.load.image ("door", "./assets/sprites/door.png");
  this.load.video ("main-menu-background", "./assets/sprites/mainMenuBackground.mp4");
  this.load.image ("darkness", "./assets/particles/darkness.png")
  this.load.image ("spanish-button", "./assets/sprites/spanishButton.png");
  this.load.image ("portuguese-button", "./assets/sprites/portugueseButton.png");
  this.load.image ("english-button", "./assets/sprites/englishButton.webp");
  this.load.audio("main-menu-song", "./assets/audio/mainMenuSong.mp3");
  this.load.audio("game-song", "./assets/audio/gameSong.mp3");
  this.load.audio ("pointerOver", "./assets/audio/ui-pointerOver.mp3")
  this.load.tilemapTiledJSON("level1", "./assets/tileMap/Level1.json");

}

init (language) {
this.language = language
}


create () {

  const startGame = () => this.scene.start("principal-menu");

  this.loadingText = this.add.text(1920 * 0.8, 1080 * 0.9, "Loading", {
    font: "46px Arial",
    color: "#ffffff",
  });
  this.loadingText.setOrigin(0.5);
  this.loadingText.setVisible(false);
  
  this.dotCount = 1;

  this.dotTimer = this.time.addEvent({
    delay: 500, // Cambiar los puntos cada 500 ms (ajusta según lo que desees)
    loop: true,
    callback: () => {
      this.updateLoadingText();
    },
  });

  this.loadingText.text = "Loading.";

  this.spanishButton =this.add.image(1920 * 0.25, 500, "spanish-button").setInteractive();

  this.spanishButton.on("pointerdown", () => {
    this.loadingText.setVisible(true); // Mostrar el texto "Cargando"
    getTranslations(ES_AR, () => {
      this.loadingText.setVisible(false);
      this.dotTimer.remove(false); // Ocultar el texto "Cargando"
      startGame();
    });
  });

  this.portugueseButton =this.add.image(1920/2, 500, "portuguese-button").setInteractive();

  this.portugueseButton.on("pointerdown", () => {
    this.loadingText.setVisible(true); // Mostrar el texto "Cargando"
    getTranslations(PT_BR, () => {
      this.loadingText.setVisible(false); // Ocultar el texto "Cargando"
      this.dotTimer.remove(false);
      startGame();
    });
  });

  this.englishButton =this.add.image(1920 * 0.75, 500, "english-button").setInteractive().setScale(0.4);

  this.englishButton.on("pointerdown", () => {
    this.loadingText.setVisible(true); // Mostrar el texto "Cargando"
    getTranslations(EN_US, () => {
      this.loadingText.setVisible(false); // Ocultar el texto "Cargando"
      this.dotTimer.remove(false);
      startGame();
    });
  });
  
        this.anims.create({
            key: 'character-idle',
            frames: this.anims.generateFrameNumbers('principal-character', { start: 0, end: 2 }),
            frameRate: 3, repeat: -1
        });

        this.anims.create({
            key: 'character-down',
            frames: this.anims.generateFrameNumbers('principal-character', { start: 3, end: 10 }),
            frameRate: 10, repeat: -1
        })
  }

  updateLoadingText() {
    this.dotCount = (this.dotCount % 3) + 1; // Alterna entre 1, 2, 3, 4
  
    // Actualiza el texto "Cargando" con la cantidad apropiada de puntos
    this.loadingText.text = `Loading${'.'.repeat(this.dotCount)}`;
  }
}
