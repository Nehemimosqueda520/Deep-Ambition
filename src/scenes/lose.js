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
        const winText = this.add.text(1920 / 2, 1080 / 2, '¡Has Perdido!', {
            fontSize: '36px',
            color: '#ffffff'
        });
        winText.setOrigin(0.5);

        // Mostrar la puntuación
        const scoreText = this.add.text(1920 / 2, 1080 / 2 + 50, `nivel: ${this.level}`, {
            fontSize: '24px',
            color: '#ffffff'
        });
        scoreText.setOrigin(0.5);

        // Botón para reiniciar
        const restartButton = this.add.text(1920/ 2, 1080/ 2 + 100, 'Reiniciar', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#00ff00',
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
    }
}
