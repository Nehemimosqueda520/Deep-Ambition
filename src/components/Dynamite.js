import Phaser from "phaser";

export default class DynamiteGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
      super(scene.physics.world, scene);
  
      // Crea un grupo de dinamitas
      this.createMultiple({
        frameQuantity: 10, // Cambia esto al número de dinamitas que quieras inicializar
        active: false,
        visible: false,
        key: "dynamite" // Esto debe coincidir con la clave de tu textura
      });
    }
  
    // Puedes agregar métodos personalizados aquí para interactuar con el grupo de dinamitas si es necesario
  }

