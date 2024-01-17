import Phaser from "phaser";

export default class PrincipalCharacter extends Phaser.Physics.Arcade.Sprite {
    
    velocity;

    flashEffect;

    cursor;

    canUseFlash;

    constructor(scene, x, y, texture, velocity, canUseFlash ) {
        super(scene, x, y, texture);

        this.setTexture("principal-character");
        
        this.steps = scene.sound.add("steps");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        
        this.isBoosting = false;
        this.boostDuration = 10000; // Duración del impulso en milisegundos (10 segundos)
        this.boostCooldown = 10000; 

        this.velocity = velocity;
        this.cursor = scene.input.keyboard.createCursorKeys();

        this.flashEffect = scene.add.image(x, y, "flash-effect");
        this.flashEffect.setDepth(1); // Asegurarse de que esté por encima del personaje
        this.flashEffect.setVisible(false); // Inicialmente oculto

        this.darkness = scene.add.image(x, y, "darkness").setDepth(4);

        this.canUseFlash = canUseFlash || true;


        this.hitboxHeight = this.height * 0.4;
        this.hitboxWidth = this.width * 0.6;
        this.offsetX = (this.width - this.hitboxWidth) / 2;
        this.offsetY = this.height - this.hitboxHeight;
        this.body.setSize(this.hitboxWidth, this.hitboxHeight);
        this.body.setOffset(this.offsetX, this.offsetY);
        
}


update() {
    // Control de movimiento horizontal
    if (this.cursor.left.isDown && !this.cursor.right.isDown) {
        this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, -this.velocity, 0.2));
        this.darkness.setPosition(this.x, this.y);
        this.play('character-left', true);
        // this.steps.play({ loop: true })
    } else if (this.cursor.right.isDown && !this.cursor.left.isDown) {
        this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, this.velocity, 0.2));
        this.darkness.setPosition(this.x, this.y);
        this.play('character-right', true);
        // this.steps.play({ loop: true })
    } else {
        this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.2));
    }

    // Control de movimiento vertical
    if (this.cursor.up.isDown && !this.cursor.down.isDown) {
        this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, -this.velocity, 0.2));
        this.darkness.setPosition(this.x, this.y);
        this.play('character-up', true);
        // this.steps.play({ loop: true })
    } else if (this.cursor.down.isDown && !this.cursor.up.isDown) {
        this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, this.velocity, 0.2));
        this.darkness.setPosition(this.x, this.y);
        this.play('character-down', true);
        // this.steps.play({ loop: true })
    } else {
        this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, 0, 0.2));
    }

     // Control de movimientos diagonales
    if (this.cursor.left.isDown && this.cursor.up.isDown) {
        this.setVelocity(-this.velocity, -this.velocity);
        this.darkness.setPosition(this.x, this.y);
        this.play('character-up', true);
    } else if (this.cursor.right.isDown && this.cursor.up.isDown) {
        this.setVelocity(this.velocity, -this.velocity);
        this.darkness.setPosition(this.x, this.y);
        this.play('character-up', true);
    } else if (this.cursor.left.isDown && this.cursor.down.isDown) {
        this.setVelocity(-this.velocity, this.velocity);
        this.darkness.setPosition(this.x, this.y);
        this.play('character-down', true);
    } else if (this.cursor.right.isDown && this.cursor.down.isDown) {
        this.setVelocity(this.velocity, this.velocity);
        this.darkness.setPosition(this.x, this.y);
        this.play('character-down', true);
    }

    // Si ninguna tecla de dirección está presionada, reproducir la animación "character-idle"
    if (!this.cursor.left.isDown && !this.cursor.right.isDown && !this.cursor.up.isDown && !this.cursor.down.isDown) {
        this.play('character-idle', true);
        // this.steps.stop()
        // this.steps.loop = false;
    }


        if (this.cursor.space.isDown && this.canUseFlash) {
            // Mostrar el destello y configurar su posición
            this.flashEffect.setVisible(true);
            this.flashEffect.setPosition(this.x, this.y);
            this.darkness.setVisible(false);

            this.scene.events.emit('flashActivated', { x: this.x, y: this.y });
    
            // Deshabilitar el uso del destello durante 20 segundos
            this.canUseFlash = false;
            
            this.scene.time.delayedCall(4000, () => {
                this.canUseFlash = true; // Habilitar nuevamente el uso del destello
            });
    
            // Establecer un temporizador para ocultar el destello después de un breve período
            this.scene.time.delayedCall(100, () => {
                this.flashEffect.setVisible(false);
                this.darkness.setVisible(true);
            });
        }
    }
}    