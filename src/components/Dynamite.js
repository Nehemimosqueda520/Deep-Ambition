import Phaser from "phaser";

export default class DynamiteGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene, quantity) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: quantity,
      active: false,
      visible: false,
      key: "dynamite"
    });
  }
}
