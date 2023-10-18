import Phaser from "phaser";

export default class DynamiteGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene, quantity) {
    super(scene.physics.world, scene);

    // Crea un grupo de dinamitas con la cantidad especificada
    this.createMultiple({
      frameQuantity: quantity,
      active: false,
      visible: false,
      key: "dynamite"
    });
  }

  // Puedes agregar métodos personalizados aquí para interactuar con el grupo de dinamitas si es necesario
}
