import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player, followDistance, level) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.speed = 300 + (level - 1) * 100;
        this.followDistance = followDistance;
        this.randomMoveDuration = 15000;
        this.randomMoveTimer = 0;
        this.isMovingRandomly = false;
        this.isFlashed = false;
        this.flashRange = 980;

        this.enemyFollowSong = scene.sound.add("enemyFollow");


        // Nueva variable y temporizador para el aturdimiento
        this.stunDuration = 2000; // Duración del aturdimiento en milisegundos

        const hitboxHeight = this.height * 0.3; // Puedes ajustar este valor según tus necesidades
        const hitboxWidth = this.width * 0.1; // Puedes ajustar este valor según tus necesidades
        
        // Calcular el offset para centrar la hitbox horizontalmente
        const offsetX = (this.width - hitboxWidth) / 2;
        
        this.body.setSize(hitboxWidth, hitboxHeight);
        this.body.setOffset(offsetX, this.height - hitboxHeight);

        scene.events.on('flashActivated', (flashData) => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, flashData.x, flashData.y);
            if (distance <= this.flashRange) {
                this.isFlashed = true;
              // Iniciar el temporizador de aturdimiento
                this.stunTimer = 0;
            }
        });
    }

    update(time, delta) {
        if (this.isFlashed) {
            this.stunTimer += 10;
            if (this.stunTimer >= this.stunDuration) {
                // Desactivar el aturdimiento cuando el temporizador ha transcurrido
            this.isFlashed = false;
            this.isMovingRandomly = false;
            this.attack();

            } else {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                const velocity = new Phaser.Math.Vector2();
                velocity.setToPolar(angle, this.speed);
                this.setVelocity(-velocity.x, -velocity.y);
                this.playAnimationByVelocity(velocity);
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

            // Seleccionar y reproducir la animación según la dirección
            this.playAnimationByVelocity(velocity);
        } else {
            if (!this.isMovingRandomly) {
                this.isMovingRandomly = true;
                this.changeRandomDirection();
            }
            // this.enemyFollowSong.stop({loop: false});
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
        this.playAnimationByVelocity(randomVelocity);
    }

    playAnimationByVelocity(velocity) {
      this.angle = Phaser.Math.Angle.Between(0, 0, velocity.x, velocity.y);

        if (this.isFlashed) {
            this.angle += Math.PI; // Agregar 180 grados para invertir la dirección
        }
        const normalizedVelocity = new Phaser.Math.Vector2();
        normalizedVelocity.setToPolar(this.angle, 1);
    
        if (Math.abs(normalizedVelocity.x) > Math.abs(normalizedVelocity.y)) {
            if (normalizedVelocity.x > 0) {
                this.play("enemy-right", true);
            } else {
                this.play("enemy-left", true);
            }
        } else if (normalizedVelocity.y > 0) {
                this.play("enemy-down", true);
            } else {
                this.play("enemy-up", true);
            }
    }

    attack(delta) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        if (distance <= this.followDistance) {
            this.isMovingRandomly = false;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            const velocity = new Phaser.Math.Vector2();
            velocity.setToPolar(angle, this.speed);
            this.setVelocity(velocity.x, velocity.y);

            // Seleccionar y reproducir la animación según la dirección
            this.playAnimationByVelocity(velocity);
        } else {
            if (!this.isMovingRandomly) {
                this.isMovingRandomly = true;
                this.changeRandomDirection();
            }
            // this.enemyFollowSong.stop({loop: false});
            this.randomMoveTimer += delta;
            if (this.randomMoveTimer >= this.randomMoveDuration) {
                this.isMovingRandomly = false;
                this.setVelocity(0, 0);
                this.randomMoveTimer = 0;
            }
        }

    }

}


