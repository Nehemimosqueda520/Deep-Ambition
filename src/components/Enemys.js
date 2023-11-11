import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player, followDistance, level) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.speed = 300 + (level - 1) * 100;
        this.followDistance = followDistance;
        this.randomMoveDuration = 2000;
        this.randomMoveTimer = 0;
        this.isMovingRandomly = false;
        this.isFlashed = false;
        this.flashRange = 980;



        // Nueva variable y temporizador para el aturdimiento
        this.stunDuration = 2000; // Duración del aturdimiento en milisegundos
        this.stunTimer = 0;

        const hitboxHeight = this.height * 0.4;
        const hitboxWidth = this.width * 0.8;
        this.body.setSize(hitboxWidth, hitboxHeight);
        this.body.setOffset(0, this.height - hitboxHeight);

        scene.events.on('flashActivated', (flashData) => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, flashData.x, flashData.y);
            if (distance <= this.flashRange) {
                this.isFlashed = true;
                this.fleeFrom(flashData);

                // Iniciar el temporizador de aturdimiento
                this.stunTimer = 0;
            }
        });
    }

    update(time, delta) {
        if (this.isFlashed) {
            this.stunTimer += delta;
            if (this.stunTimer >= this.stunDuration) {
                // Desactivar el aturdimiento cuando el temporizador ha transcurrido
                this.isFlashed = false;
            } else {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                const velocity = new Phaser.Math.Vector2();
                velocity.setToPolar(angle, this.speed);
                this.setVelocity(-velocity.x, -velocity.y);
                return; // No seguir al jugador mientras esté aturdido
            }
        }

        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

        if (distance <= this.followDistance) {
            this.isMovingRandomly = false;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            const velocity = new Phaser.Math.Vector2();
            velocity.setToPolar(angle, this.speed);
            this.setVelocity(velocity.x, velocity.y);
        } else {
            if (!this.isMovingRandomly) {
                this.isMovingRandomly = true;
                this.changeRandomDirection();
            }

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
        if (!this.body) {
            console.log('ENEMY', this)
             return;
        }
        const angle = Phaser.Math.Angle.Between(this.x, this.y, flashData.x, flashData.y);
        const velocity = new Phaser.Math.Vector2();
        velocity.setToPolar(angle, this.speed);
        this.setVelocity(-velocity.x, -velocity.y);
        this.isMovingRandomly = false;
        this.randomMoveTimer = 0;
    }
}
