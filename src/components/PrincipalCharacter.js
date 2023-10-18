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

        this.darkness = scene.add.image(x, y, "darkness").setDepth(1);

        this.canUseFlash = true;


        const hitboxHeight = this.height * 0.4; // La mitad de la altura del personaje
        this.body.setSize(this.width, hitboxHeight);
        this.body.setOffset(0, this.height - hitboxHeight);
        // this.stamina = stamina;
}


update() {

// Control de movimiento horizontal
if (this.cursor.left.isDown && !this.cursor.right.isDown) {
    this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, -this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-idle', false);
} else if (this.cursor.right.isDown && !this.cursor.left.isDown) {
    this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-idle', false);
} else {
    this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.2));
    this.darkness.setPosition(this.x, this.y);
    
}

// Control de movimiento vertical
if (this.cursor.up.isDown && !this.cursor.down.isDown) {
    this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, -this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-idle', false);
} else if (this.cursor.down.isDown && !this.cursor.up.isDown) {
    this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play ('character-down', true);
} else {
    this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, 0, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-idle', true);
}



        if (this.cursor.space.isDown && this.canUseFlash) {
            // Mostrar el destello y configurar su posición
            this.flashEffect.setVisible(true);
            this.flashEffect.setPosition(this.x, this.y);
    
            // Deshabilitar el uso del destello durante 20 segundos
            this.canUseFlash = false;
            
            this.scene.time.delayedCall(10000, () => {
                this.canUseFlash = true; // Habilitar nuevamente el uso del destello
            });
    
            // Establecer un temporizador para ocultar el destello después de un breve período
            this.scene.time.delayedCall(100, () => {
                this.flashEffect.setVisible(false);
            });
        }
    }
}    




