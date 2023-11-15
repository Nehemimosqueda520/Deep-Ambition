import Phaser from "phaser";
import { getPhrase } from "../services/translations";

export default class Credits extends Phaser.Scene {

    constructor () {
        super({ key: 'credits' });
    }

    init() {
      this.level = 0;
    }

    create() {

        this.fadingOverlay = this.add
        .rectangle(
          0,
          0,
          this.cameras.main.width,
          this.cameras.main.height,
          0x000000
        )
        this.fadingOverlay.setOrigin(0)
        .setDepth(7);

        this.tweens.add({
            targets: this.fadingOverlay,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
              // Después de 5 segundos, inicia el segundo tween
              this.time.delayedCall(5000, () => {
                // Segundo tween: Desvanecimiento de salida
                this.tweens.add({
                  targets: this.fadingOverlay,
                  alpha: 1,
                  duration: 1000,
                  onComplete: () => {
                    // Cuando se completa el segundo tween, cambia a la escena 'principal-menu'
                    this.scene.start('principal-menu');
                  },
                });
              });
            },
          });

        //  agregar texto que diga "programado por: Nehemias (DAN) Mosqueda"
        this.add.text(0, 1080 * 0.25, getPhrase('Programado por: Nehemías "DAN" Mosqueda'), {   
        fontFamily: 'Time New Roman',
        fontSize: '100px',
        color: '#7D080E'
    });

        this.add.text(0, 1080 / 2, getPhrase('Arte por: Camila Renna'), {   
            fontFamily: 'Time New Roman',
            fontSize: '100px',
            color: '#7D080E' 
        });

        this.add.text(0, 1080 * 0.75, getPhrase('Diseño y audio por: Luka Martina'), {   
            fontFamily: 'Time New Roman',
            fontSize: '100px',
            color: '#7D080E' 
        });

    }
}