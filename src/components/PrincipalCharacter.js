import Phaser from "phaser";

export default class PrincipalCharacter extends Phaser.Physics.Arcade.Sprite {
    
    velocity;

    // stamina;


    constructor(scene, x, y, texture, velocity /*   stamina  */) {
        super(scene, x, y, texture);

        this.setTexture("principal-character");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        

        this.velocity = velocity;
        this.cursor = scene.input.keyboard.createCursorKeys();

        // this.stamina = stamina;
}


update() {

    //  movimiento
    if (this.cursor.left.isDown) {
        this.setVelocityX(-this.velocity);
        // this.anims.play('left', true);     
    } else if (this.cursor.right.isDown) {
        this.setVelocityX(this.velocity);
        // this.anims.play('right', true);
    } else if (this.cursor.up.isDown) {
        this.setVelocityY(-this.velocity);
        // this.anims.play('up', true);
    }
    else if (this.cursor.down.isDown) {
        this.setVelocityY(this.velocity);
        // this.anims.play('down', true);
    }else {
        this.setVelocityX(0);
        this.setVelocityY(0);
        // this.anims.stop();
    }

    // if (this.cursor.space.isDown) {
    //     this.activateStamina();
    // }
}

// activateStamina () {
//     if (this.stamina >= 10) {
//         this.velocity *= 1.5;
//         this.stamina -= 10;
// }



}


