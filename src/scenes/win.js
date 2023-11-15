import Phaser from "phaser";

export default class Win extends Phaser.Scene {
  constructor() {
    super("win");
  }

  init(data) {
    this.health = data.health;
    this.level = data.level;
    this.levelsPased = data.levelsPased 
  }

  create() {
        this.pointerSound = this.sound.add("pointerOver");
        this.pointerdownSound = this.sound.add("PointerdownFX");
        this.winVideo = this.add.video(1920/2, 1080/2, "win-cinematic");
        this.winVideo.play();
        this.winVideo.setDepth(1);
        this.explosionSound = this.sound.add ("dynamite-explosion");
        this.explosionSound.play();

        this.winVideo.on('complete', () => {

          this.tweens.add({
            targets: this.fadingOverlay,
            alpha: 1,
            duration: 1000,
            onComplete: () => {
              this.explosionSound.stop();
              this.explosionSound.destroy();
                this.scene.start('lobby', {
                    level: this.level,
                    health: this.health,
                    levelsPased: this.levelsPased
                });
            },
          });
      });

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

        this.levelsPased += 1;
        if (this.levelsPased >= 3) {
          
          this.finalVideo = this.add.video (1980 / 2, 1080/2, "final-cinematic");
          this.winVideo.stop();

          // Reproduce el video
          this.finalVideo.play ();
          this.finalVideo.setDepth(7);
        
          // Establece un evento para cuando el finalVideo termine
          this.finalVideo.on('start', () => {
        });
        
        this.finalVideo.on('complete', () => {
            this.scene.start('principal-menu');
        });

        this.input.keyboard.once('keydown-SPACE', () => {
          // Si la tecla de espacio es presionada, ejecuta la función fadeOutCinematic
          this.scene.start("credits");
      }, this);
        }
  }

}
    

