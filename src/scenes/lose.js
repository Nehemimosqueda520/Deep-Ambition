import Phaser from "phaser";
import { getPhrase } from "../services/translations";

export default class Lose extends Phaser.Scene {

    constructor(){
        super("lose");
    }

    init (data) {
        this.health = data.health;
        this.level = data.level;
        this.levelsPased = data.levelsPased;
    }

    create () {
        // Fondo de la escena
        this.add.image(1920 / 2,
        1080 / 2, "game-over");

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

        this.pointerSound = this.sound.add("pointerOver");
        this.pointerdownSound = this.sound.add("PointerdownFX");

        // Mensaje de victoria
        const winText = this.add.text(1920 / 2, 1080 * 0.25,  getPhrase('¡Has Perdido!'), {
            fontFamily: 'Time New Roman',
            fontSize: '160px',
            color: '#7D080E'
        });
        winText.setOrigin(0.5);

        // Mostrar la puntuación
        const scoreText = this.add.text(1920 / 2, 1080 / 2 + 50,`${getPhrase("Nivel")} ${this.level + 1}`, {
            fontFamily: 'Time New Roman',
            fontSize: '140px',
            color: '#7D080E'
        });
        scoreText.setOrigin(0.5);

        // Botón para reiniciar
        const restartButton = this.add.text(1920/ 2, 1080 * 0.75, getPhrase('Reiniciar'), {
            fontFamily: 'Time New Roman',
            fontSize: '140px',
            color: '#7D080E',
            backgroundColor: '#1111111',
            
        });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive();

        restartButton.on('pointerdown', () => {
            this.pointerdownSound.play();

            this.tweens.add({
                targets: this.fadingOverlay,
                alpha: 1,
                duration: 1000,
                onComplete: () => {
                    this.scene.start('lobby', {
                        level: this.level,
                        health: this.health,
                    });
                },
              });
            // Aquí puedes agregar lógica para reiniciar el juego, por ejemplo, regresando a la escena inicial.
        });
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.5);
            this.pointerSound.play();
        });
        restartButton.on('pointerout', () => {
            restartButton.setScale(1);
        });
    }
}
