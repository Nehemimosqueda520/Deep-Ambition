import Phaser from "phaser";
import { EN_US, ES_AR, PT_BR } from "../enums/languages";
import { getTranslations } from "../services/translations";

// import events from "./EventCenter";

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
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
  

  this.spanishButton =this.add.image(150, 500, "spanish-button").setInteractive();

  this.spanishButton.on("pointerdown", () => {
    getTranslations(ES_AR, startGame);
    
  });

  this.portugueseButton =this.add.image(500, 500, "portuguese-button").setInteractive();

  this.portugueseButton.on("pointerdown", () => {
    getTranslations(PT_BR, startGame);
    
  });

  this.englishButton =this.add.image(1000, 500, "english-button").setInteractive().setScale(0.4);

  this.englishButton.on("pointerdown", () => {
    getTranslations(EN_US, startGame);
    
  });
  
  
  //  animacion maqueta comentada
        this.anims.create({
            key: 'character-idle',
            frames: this.anims.generateFrameNumbers('principal-character', { start: 0, end: 2 }),
            frameRate: 3, repeat: -1
        });

        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('maqueta', { start: 0, end: 3 }
        //     frameRate: 10, repeat: -1

        // });

        // this.anims.create({
        //     key: 'up',
        //     frames: this.anims.generateFrameNumbers('maqueta', { start: 0, end: 3 }
        //     frameRate: 10, repeat: -1
        // });

        this.anims.create({
            key: 'character-down',
            frames: this.anims.generateFrameNumbers('principal-character', { start: 3, end: 10 }),
            frameRate: 10, repeat: -1
         })



  }

}
