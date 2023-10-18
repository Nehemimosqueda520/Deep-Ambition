import Phaser from "phaser"

import events from "./EventCenter";

import { getPhrase } from "../services/translations";

export default class PrincipalMenu extends Phaser.Scene {

  playText;

  settingsText;

  tutorialText;

  mainMenuSong;

  pointerSound;

  volume;

  constructor() {
    super("principal-menu");
  }

  init (data, language) {
    this.volume = data.volume || 1;
    this.visibleVolume = data.visibleVolume || 100;
    this.language =language;
  }

  create() {
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);

    this.fadingOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);
    this.fadingOverlay.setAlpha(0);

    this.sounds();

    this.add.text(100, 100, "Deep Ambition", {
      fontSize: '32px',
      color: '#fff'
    });

    this.playText = this.add.text(100, 200, getPhrase("Jugar"), {
      fontSize: '20px',
      color: '#fff'
    }).setInteractive();

  

    this.playText.on('pointerover', () => {
      this.playText.setScale(1.2); 
      this.pointerSound.play();
    });

    this.playText.on('pointerout', () => {
      this.playText.setScale(1); 
      this.pointerSound.play();
    });

    this.playText.on('pointerdown', () => {
      this.scene.start("lobby");
      this.mainMenuSong.stop();
      this.mainMenuSong.loop = false; 

      this.tweens.add({
        targets: this.fadingOverlay,
        alpha: 1,
        duration: 1000, 
        onComplete: () => {
          this.playCinematic();
        }
      });
    });


    this.settingsText = this.add.text(100, 250, getPhrase("Configuración"), {
      fontSize: '20px',
      color: '#fff'
    }).setInteractive();

  this.settingsText.on('pointerover', () => {
    this.settingsText.setScale(1.2);
    this.pointerSound.play();
  })
  
  this.settingsText.on('pointerout', () => {
    this.settingsText.setScale(1);
    this.pointerSound.play();
  })

  this.settingsText.on('pointerdown', () => {
    this.scene.launch("settings", {
      mainMenuSong: this.mainMenuSong, 
      volume: this.volume,
      visibleVolume: this.visibleVolume,
  });
  this.scene.pause();
  })


    this.tutorialText = this.add.text(100, 300, getPhrase("¿Cómo jugar?"), {
      fontSize: '20px',
      color: '#fff'
    }).setInteractive();

    //  hacer lo mismo que con settings
    this.tutorialText.on('pointerover', () => {
      this.tutorialText.setScale(1.2);
      this.pointerSound.play();
    })

    this.tutorialText.on('pointerout', () => {
      this.tutorialText.setScale(1);
      this.pointerSound.play();
    })

    this.tutorialText.on('pointerdown', () => {
      this.scene.launch ("tutorial");
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
      }
    });
  }

  musicTransfer (data) {
    this.mainMenuSong = data.mainMenuSong;
  }
}
