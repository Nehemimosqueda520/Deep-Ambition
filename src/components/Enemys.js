import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player, speed, followDistance) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.speed = speed;
        this.followDistance = followDistance;
        this.randomMoveDuration = 2000; // Duración del movimiento aleatorio en milisegundos
        this.randomMoveTimer = 0;
        this.isMovingRandomly = false;

        this.changeRandomDirection(); // Iniciar con una dirección aleatoria

        this.flashRange = 980;

        const hitboxHeight = this.height * 0.4; // La mitad de la altura del personaje
        this.body.setSize(this.width, hitboxHeight);
        this.body.setOffset(0, this.height - hitboxHeight);

        scene.events.on('flashActivated', (flashData) => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, flashData.x, flashData.y);
            if (distance <= this.flashRange) {
                // Si el enemigo está dentro del rango del flash, alejarlo en la dirección opuesta
                this.fleeFrom(flashData);
            }
        });
    }

    update(time, delta) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

        if (distance <= this.followDistance) {
            // Si el jugador está dentro de la distancia de seguimiento, sigue al jugador
            this.isMovingRandomly = false;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            const velocity = new Phaser.Math.Vector2();
            velocity.setToPolar(angle, this.speed);
            this.setVelocity(velocity.x, velocity.y);
        } else {
            // Si el jugador está fuera de la distancia de seguimiento, muévete aleatoriamente
            if (!this.isMovingRandomly) {
                this.isMovingRandomly = true;
                this.changeRandomDirection();
            }

            // Detener el movimiento aleatorio después de un tiempo
            this.randomMoveTimer += delta;
            if (this.randomMoveTimer >= this.randomMoveDuration) {
                this.isMovingRandomly = false;
                this.setVelocity(0, 0);
                this.randomMoveTimer = 0;
            }
        }
    }

    changeRandomDirection() {
        const randomAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const randomVelocity = new Phaser.Math.Vector2();
        randomVelocity.setToPolar(randomAngle, this.speed);
        this.setVelocity(randomVelocity.x, randomVelocity.y);
    }

    fleeFrom(flashData) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, flashData.x, flashData.y);
        const velocity = new Phaser.Math.Vector2();
        velocity.setToPolar(angle, this.speed);
        this.setVelocity(-velocity.x, -velocity.y);
        this.isMovingRandomly = false;
        this.randomMoveTimer = 0;
    }
}






