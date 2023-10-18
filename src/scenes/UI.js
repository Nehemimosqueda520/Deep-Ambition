import Phaser from "phaser";
import events from "./EventCenter";

export default class UI extends Phaser.Scene {

  health;

  score;

  level;

  stamina;

  dynamiteCuantity;

  constructor() {
    super("ui");
  }

  init (data) {
    this.health = data.health || 3;
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.stamina = data.stamina || 100;
    this.dynamiteCuantity = data.dynamiteCuantity || 22;
  }


  create () {
    this.dynamiteText = this.add.text(
      1800,
      10,
      `${this.dynamiteCuantity}`,
      {
        font: "60px Arial",
        color: "#ffffff",
      }
    );

    this.levelText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `Nivel ${this.level}`, {
      fontSize: '48px',
      color: '#fff',
      backgroundColor: 'red' // Cambia el color del fondo a rojo
  });
    this.levelText.setOrigin(0.5);
  
    // Ajusta la duración durante la cual el letrero de nivel estará en pantalla
    this.tweens.add({
      targets: this.levelText,
      alpha: 0, // Establece la opacidad del texto a 0 (totalmente transparente)
      duration: 2000, // Duración de la animación en milisegundos
      ease: 'Linear', // Opcional: función de interpolación
      onComplete: () => {
          this.levelText.destroy(); // Elimina el texto después de desvanecerse
      }
  });

    this.dynamite =this.add.image(1750, 43, "dynamite")
    events.on("actualizarDatos", this.updates, this);
  }

updates (data) {
  this.level = data.level;
  this.score = data.score;
  this.dynamiteCuantity = data.dynamiteCuantity;

  this.dynamiteText.setText(`${this.dynamiteCuantity}`);
}
}
