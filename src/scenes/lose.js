import Phaser from "phaser";

export default class Lose extends Phaser.Scene {

    constructor(){
        super("lose");
    }

    init (data) {
        this.health = data.health;
        this.level = data.level;
    }

    create () {
        // Fondo de la escena
        this.add.image(1920 / 2,
        1080 / 2, "game-over");

        // Mensaje de victoria
        const winText = this.add.text(1920 / 2, 1080 * 0.25, '¡Has Perdido!', {
            fontFamily: 'Time New Roman',
            fontSize: '160px',
            color: '#7D080E'
        });
        winText.setOrigin(0.5);

        // Mostrar la puntuación
        const scoreText = this.add.text(1920 / 2, 1080 / 2 + 50, `Nivel: ${this.level + 1}`, {
            fontFamily: 'Time New Roman',
            fontSize: '140px',
            color: '#7D080E'
        });
        scoreText.setOrigin(0.5);

        // Botón para reiniciar
        const restartButton = this.add.text(1920/ 2, 1080 * 0.75, 'Reiniciar', {
            fontFamily: 'Time New Roman',
            fontSize: '140px',
            color: '#7D080E',
            backgroundColor: '#1111111',
            
        });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive();

        restartButton.on('pointerdown', () => {
            // Aquí puedes agregar lógica para reiniciar el juego, por ejemplo, regresando a la escena inicial.
            this.scene.start('lobby', {
                level: this.level,
                health: this.health,
            });
        });
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.5);
        });
        restartButton.on('pointerout', () => {
            restartButton.setScale(1);
        });
    }
}
