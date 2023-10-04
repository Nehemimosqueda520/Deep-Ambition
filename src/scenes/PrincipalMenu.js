import Phaser from "phaser"

import events from "./EventCenter";

export default class PrincipalMenu extends Phaser.Scene {

  playText;

  settingsText;

  tutorialText;

  mainMenuSong;


  volume;

  constructor() {
    super("principal-menu");
  }

  init (data) {
    this.volume = data.volume || 1;
    this.visibleVolume = data.visibleVolume || 100;
  }

  create() {
    // Fondo negro
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0);

    this.mainMenuSong = this.sound.add("main-menu-song");
    this.mainMenuSong.play();
    this.mainMenuSong.loop = true;

    // Texto de bienvenida
    this.add.text(100, 100, "Deep Ambition", {
      fontSize: '32px',
      color: '#fff'
    });

    // Texto "Jugar" con interacciones de ratón
    this.playText = this.add.text(100, 200, "Jugar", {
      fontSize: '20px',
      color: '#fff'
    }).setInteractive();

  

    this.playText.on('pointerover', () => {
      this.playText.setScale(1.2); // Cambia el tamaño cuando el ratón está sobre él
    });

    this.playText.on('pointerout', () => {
      this.playText.setScale(1); // Restaura el tamaño cuando el ratón sale
    });

    this.playText.on('pointerdown', () => {
      this.scene.start("lobby");
      this.mainMenuSong.stop();
      this.mainMenuSong.loop = false; // Cambia a la escena "lobby" cuando se hace clic
    });

// texto de configuración
    this.settingsText = this.add.text(100, 250, "Configuración", {
      fontSize: '20px',
      color: '#fff'
    }).setInteractive();
//  hacer lo mismo que hicimos con playText
  this.settingsText.on('pointerover', () => {
    this.settingsText.setScale(1.2);
  })
  
  this.settingsText.on('pointerout', () => {
    this.settingsText.setScale(1);
  })

  this.settingsText.on('pointerdown', () => {
    this.scene.launch("settings", {
      mainMenuSong: this.mainMenuSong, // Pasa la música a la escena de configuración
      volume: this.volume,
      visibleVolume: this.visibleVolume,
  });
  this.scene.pause();
  })


    this.tutorialText = this.add.text(100, 300, "¿Como jugar?", {
      fontSize: '20px',
      color: '#fff'
    }).setInteractive();

    //  hacer lo mismo que con settings
    this.tutorialText.on('pointerover', () => {
      this.tutorialText.setScale(1.2);
    })

    this.tutorialText.on('pointerout', () => {
      this.tutorialText.setScale(1);
    })

    this.tutorialText.on('pointerdown', () => {
      this.scene.launch ("tutorial");
      this.scene.pause();
    });

    
    events.on("music-settings", this.musicTransfer, this);

  }

  musicTransfer (data) {
    this.mainMenuSong = data.mainMenuSong;
  }
}
