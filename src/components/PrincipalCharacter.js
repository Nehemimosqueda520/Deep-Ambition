import Phaser from "phaser";

export default class PrincipalCharacter extends Phaser.Physics.Arcade.Sprite {
    
    velocity;

    constructor(scene, x, y, texture, velocity) {
        super(scene, x, y, texture);

        this.setTexture("principal-character");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.5);
        this.setCollideWorldBounds(true);
        

        this.velocity = velocity;
        this.cursor = scene.input.keyboard.createCursorKeys();

        //  animacion maqueta comentada
        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('maqueta', { start: 0, end: 3 }
        //     frameRate: 10, repeat: -1
        // });

        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('maqueta', { start: 0, end: 3 }
        //     frameRate: 10, repeat: -1

        // });

        // this.anims.create({
        //     key: 'up',
        //     frames: this.anims.generateFrameNumbers('maqueta', { start: 0, end: 3 }
        //     frameRate: 10, repeat: -1
        // });

        // this.anims.create({
        //     key: 'down',
        //     frames: this.anims.generateFrameNumbers('maqueta', { start: 0, end: 3 }
        //     frameRate: 10, repeat: -1
        // });

}

update() {

    //  movimiento
    if (this.cursor.left.isDown) {
        this.setVelocityX(-this.velocity);
        // this.anims.play('left', true);
    }

    if (this.cursor.right.isDown) {
        this.setVelocityX(this.velocity);
        // this.anims.play('right', true);
    }
    if (this.cursor.up.isDown) {
        this.setVelocityY(-this.velocity);
        // this.anims.play('up', true);
    }
    if (this.cursor.down.isDown) {
        this.setVelocityY(this.velocity);
        // this.anims.play('down', true);
    }else {
        this.setVelocityX(0);
        this.setVelocityY(0);
        // this.anims.stop();
    }

}

}
