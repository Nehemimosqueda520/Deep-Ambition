import Phaser from "phaser";
import events from "../scenes/EventCenter";

export default class PrincipalCharacter extends Phaser.Physics.Arcade.Sprite {
    
    velocity;

    flashEffect;

    cursor;

    canUseFlash;

    constructor(scene, x, y, texture, velocity, canUseFlash, isDark) {
        super(scene, x, y, texture);

        this.setTexture("principal-character");
        
        this.steps = scene.sound.add("steps");
        this.flashSound = scene.sound.add("flashSound").setVolume(0.5);

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

        this.flash = scene.add.image(x, y, "flash");
        this.flash.setDepth(1); // Asegurarse de que esté por encima del personaje
        this.flash.setVisible(false);

        this.darkness = scene.add.image(x, y, "darkness").setDepth(4).setVisible(isDark);

        this.canUseFlash = canUseFlash;


        this.hitboxHeight = this.height * 0.4;
        this.hitboxWidth = this.width * 0.6;
        this.offsetX = (this.width - this.hitboxWidth) / 2;
        this.offsetY = this.height - this.hitboxHeight;
        this.body.setSize(this.hitboxWidth, this.hitboxHeight);
        this.body.setOffset(this.offsetX, this.offsetY);

        this.wasd = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
}


update() {
if ((this.cursor.left.isDown || this.wasd.left.isDown) && !(this.cursor.right.isDown || this.wasd.right.isDown)) {
    this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, -this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-left', true);
} else if ((this.cursor.right.isDown || this.wasd.right.isDown) && !(this.cursor.left.isDown || this.wasd.left.isDown)) {
    this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-right', true);
} else {
    this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.2));
}

if ((this.cursor.up.isDown || this.wasd.up.isDown) && !(this.cursor.down.isDown || this.wasd.down.isDown)) {
    this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, -this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-up', true);
} else if ((this.cursor.down.isDown || this.wasd.down.isDown) && !(this.cursor.up.isDown || this.wasd.up.isDown)) {
    this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, this.velocity, 0.2));
    this.darkness.setPosition(this.x, this.y);
    this.play('character-down', true);
} else {
    this.setVelocityY(Phaser.Math.Linear(this.body.velocity.y, 0, 0.2));
}

if ((this.cursor.left.isDown || this.wasd.left.isDown) && (this.cursor.up.isDown || this.wasd.up.isDown)) {
    this.setVelocity(-this.velocity, -this.velocity);
    this.darkness.setPosition(this.x, this.y);
    this.play('character-up', true);
} else if ((this.cursor.right.isDown || this.wasd.right.isDown) && (this.cursor.up.isDown || this.wasd.up.isDown)) {
    this.setVelocity(this.velocity, -this.velocity);
    this.darkness.setPosition(this.x, this.y);
    this.play('character-up', true);
} else if ((this.cursor.left.isDown || this.wasd.left.isDown) && (this.cursor.down.isDown || this.wasd.down.isDown)) {
    this.setVelocity(-this.velocity, this.velocity);
    this.darkness.setPosition(this.x, this.y);
    this.play('character-down', true);
} else if ((this.cursor.right.isDown || this.wasd.right.isDown) && (this.cursor.down.isDown || this.wasd.down.isDown)) {
    this.setVelocity(this.velocity, this.velocity);
    this.darkness.setPosition(this.x, this.y);
    this.play('character-down', true);
}

    if (!this.cursor.left.isDown && !this.cursor.right.isDown && !this.cursor.up.isDown && !this.cursor.down.isDown &&
        !this.wasd.left.isDown && !this.wasd.right.isDown && !this.wasd.up.isDown && !this.wasd.down.isDown) {
        this.play('character-idle', true);
    }


        if (this.cursor.space.isDown && this.canUseFlash) {
            this.flashSound.play();
            this.flashEffect.setVisible(true);
            this.flashEffect.setPosition(this.x, this.y);
            this.flash.setVisible(true);
            this.flash.setPosition(this.x, this.y);
            this.darkness.setVisible(false);

            this.scene.events.emit('flashActivated', { x: this.x, y: this.y });
            events.emit('canUseFlashChanged', {canUseFlash: this.canUseFlash, }); 
            this.canUseFlash = false;
            
            this.scene.time.delayedCall(5000, () => {
            events.emit('canUseFlashChanged', {canUseFlash: this.canUseFlash}); 
                this.canUseFlash = true;
            });
    
            this.scene.time.delayedCall(100, () => {
                this.flashEffect.setVisible(false);
                this.flash.setVisible(false);
                this.darkness.setVisible(true);
            });
        }
 
    }

}    