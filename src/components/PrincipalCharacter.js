import Phaser from "phaser";

export default class PrincipalCharacter extends Phaser.Physics.Arcade.Sprite {
    
    velocity;

    flashEffect;

    // stamina;

    cursor;

    canUseFlash;

    constructor(scene, x, y, texture, velocity /*   stamina  */) {
        super(scene, x, y, texture);

        this.setTexture("principal-character");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        

        this.velocity = velocity;
        this.cursor = scene.input.keyboard.createCursorKeys();

        this.flashEffect = scene.add.image(x, y, "flash-effect");
        this.flashEffect.setDepth(1); // Asegurarse de que esté por encima del personaje
        this.flashEffect.setVisible(false); // Inicialmente oculto

        this.canUseFlash = true;

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
        } else if (this.cursor.down.isDown) {
        this.setVelocityY(this.velocity);
        // this.anims.play('down', true);
        } else {
        this.setVelocityX(0);
        this.setVelocityY(0);
        // this.anims.stop();
        }

        if (this.cursor.space.isDown && this.canUseFlash) {
            // Mostrar el destello y configurar su posición
            this.flashEffect.setVisible(true);
            this.flashEffect.setPosition(this.x, this.y);
    
            // Deshabilitar el uso del destello durante 20 segundos
            this.canUseFlash = false;
            
            this.scene.time.delayedCall(20000, () => {
                this.canUseFlash = true; // Habilitar nuevamente el uso del destello
            });
    
            // Establecer un temporizador para ocultar el destello después de un breve período
            this.scene.time.delayedCall(100, () => {
                this.flashEffect.setVisible(false);
            });
        }
    }
}    




