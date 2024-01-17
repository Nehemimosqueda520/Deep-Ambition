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
      frameWidth: 120,
      frameHeight: 212,
    });
    this.load.image("dynamite", "./assets/sprites/dynamite.png");
    this.load.spritesheet("enemy", "./assets/sprites/enemy.png", {
      frameWidth: 180,
      frameHeight: 250,
    });
    this.load.image("flash-effect", "./assets/particles/flashEffect.png");
    this.load.image("Atlas", "./assets/sprites/Atlas.png");
    this.load.spritesheet("door", "./assets/sprites/door.png", {
      frameWidth: 580 / 2,
      frameHeight: 250,
    });
    this.load.image("anonymous-logo", "./assets/sprites/anonymousLogo.png");
    this.load.image("github-logo", "./assets/sprites/githubLogo.png");
    this.load.image("google-logo", "./assets/sprites/googleLogo.png");
    this.load.image ("wasd", "./assets/sprites/wasd.png");
    this.load.image ("space", "./assets/sprites/space.png");
    this.load.video(
      "main-menu-background",
      "./assets/sprites/mainMenuBackground.mp4"
    );
    this.load.video(
      "main-cinematic",
      "./assets/sprites/mainCinematic.mp4"
    );
    this.load.video(
      "final-cinematic",
      "./assets/sprites/finalCinematic.mp4"
    );
    this.load.video(
      "win-cinematic",
      "./assets/sprites/winCinematic.mp4"
    );
    this.load.video(
      "jumpscare",
      "./assets/sprites/jumpscare.mp4"
    );
    this.load.image("darkness", "./assets/particles/darkness.png");
    this.load.image("arrow", "./assets/particles/arrow.png");
    this.load.image("blue-arrow", "./assets/particles/blueArrow.png");
    this.load.image("spanish-button", "./assets/sprites/spanishButton.png");
    this.load.image(
      "portuguese-button",
      "./assets/sprites/portugueseButton.png"
    );
    this.load.image("english-button", "./assets/sprites/englishButton.webp");
    this.load.image("image-for-languages", "./assets/sprites/imageForLanguages.png");
    this.load.image("game-over", "./assets/sprites/gameOver.png");
    this.load.audio("main-menu-song", "./assets/audio/mainMenuSong.mp3");
    this.load.audio("game-song", "./assets/audio/gameSong.mp3");
    this.load.audio("game-song2", "./assets/audio/gameSong2.mp3");
    this.load.audio("pointerOver", "./assets/audio/ui-pointerOver.mp3");
    this.load.audio("lobby-song", "./assets/audio/lobbySong.mp3");
    this.load.audio ("dynamite-sound", "./assets/audio/dynamiteSound.mp3");
    this.load.audio ("dynamite-explosion", "./assets/audio/dynamiteExplosion.mp3");
    this.load.audio ("main-cinematic-song", "./assets/audio/mainCinematicSong.mp3");
    this.load.audio ("steps", "./assets/audio/steps.mp3");
    this.load.audio ("enemyFollow", "./assets/audio/enemyFollow.mp3");
    this.load.audio ("PointerdownFX", "./assets/audio/PointerdownFX.mp3")
    this.load.tilemapTiledJSON("level1", "./assets/tileMap/Level1.json");
    this.load.tilemapTiledJSON("lobby-tile", "./assets/tileMap/lobby.json");
    this.load.tilemapTiledJSON("level2", "./assets/tileMap/Level2.json");
    this.load.tilemapTiledJSON("level3", "./assets/tileMap/Level3.json");
  }

  init(language) {
    this.language = language;
  }

  create() {
    const startGame = () => this.scene.start("login");

    this.background = this.add.image(1920/2, 1080/2, "image-for-languages");

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

    this.spanishButton = this.add
      .image(1920 * 0.33, 300, "spanish-button")
      .setInteractive();

    this.spanishButton.on("pointerdown", () => {
      this.loadingText.setVisible(true); // Mostrar el texto "Cargando"
      getTranslations(ES_AR, () => {
        this.loadingText.setVisible(false);
        this.dotTimer.remove(false); // Ocultar el texto "Cargando"
        startGame();
      });
    });

    this.portugueseButton = this.add
      .image(1920 *0.33, 700, "portuguese-button")
      .setInteractive();

    this.portugueseButton.on("pointerdown", () => {
      this.loadingText.setVisible(true); // Mostrar el texto "Cargando"
      getTranslations(PT_BR, () => {
        this.loadingText.setVisible(false); // Ocultar el texto "Cargando"
        this.dotTimer.remove(false);
        startGame();
      });
    });

    this.englishButton = this.add
      .image(1920 * (1 - 0.33), 500, "english-button")
      .setInteractive()
      .setScale(0.4);

    this.englishButton.on("pointerdown", () => {
      this.loadingText.setVisible(true); // Mostrar el texto "Cargando"
      getTranslations(EN_US, () => {
        this.loadingText.setVisible(false); // Ocultar el texto "Cargando"
        this.dotTimer.remove(false);
        startGame();
      });
    });

    this.anims.create({
      key: "character-idle",
      frames: [
        { key: "principal-character", frame: 4 },
        { key: "principal-character", frame: 5 },
        { key: "principal-character", frame: 7 },
      ],
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "character-down",
      frames: this.anims.generateFrameNumbers("principal-character", {
        start: 12,
        end: 19,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "character-up",
      frames: this.anims.generateFrameNumbers("principal-character", {
        start: 21,
        end: 24,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "character-right",
      frames: this.anims.generateFrameNumbers("principal-character", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "character-left",
      frames: this.anims.generateFrameNumbers("principal-character", {
        start: 8,
        end: 11,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy-down",
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 8,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy-up",
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 12,
        end: 15,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy-right",
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy-left",
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 4,
        end: 7,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }
  

  updateLoadingText() {
    this.dotCount = (this.dotCount % 3) + 1; // Alterna entre 1, 2, 3, 4

    // Actualiza el texto "Cargando" con la cantidad apropiada de puntos
    this.loadingText.text = `Loading${".".repeat(this.dotCount)}`;
  }
}
