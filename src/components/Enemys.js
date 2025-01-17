import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player, followDistance, level) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.speed = 300 + (level - 1) * 50;
        this.followDistance = followDistance;
        this.randomMoveDuration = 2000;
        this.randomMoveTimer = 0;
        this.isMovingRandomly = false;
        this.isFlashed = false;
        this.flashRange = 980;

        this.enemyFollowSong = scene.sound.add("enemyFollow");


        this.stunDuration = 50000; 
        this.stunTimer = 0;
        const hitboxHeight = this.height * 0.3; 
        const hitboxWidth = this.width * 0.1; 
        
        const offsetX = (this.width - hitboxWidth) / 2;
        
        this.body.setSize(hitboxWidth, hitboxHeight);
        this.body.setOffset(offsetX, this.height - hitboxHeight);

        scene.events.on('flashActivated', (flashData) => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, flashData.x, flashData.y);
            if (distance <= this.flashRange) {
                this.isFlashed = true;
                this.fleeFrom(flashData);
                this.stunTimer = 0;
            }
        });
    }

    update(time, delta) {
        if (this.isFlashed) {
            this.stunTimer += 100;
            if (this.stunTimer >= this.stunDuration) {
                // Desactivar el aturdimiento cuando el temporizador ha transcurrido
                this.isFlashed = false;
            } else {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                const velocity = new Phaser.Math.Vector2();
                velocity.setToPolar(angle, this.speed);
                this.setVelocity(-velocity.x, -velocity.y);
                this.playAnimationByVelocity(velocity);
                return; 
            }
        }

        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

        if (distance <= this.followDistance) {
            this.isMovingRandomly = false;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            const velocity = new Phaser.Math.Vector2();
            velocity.setToPolar(angle, this.speed);
            this.setVelocity(velocity.x, velocity.y);

            this.playAnimationByVelocity(velocity);
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
        this.playAnimationByVelocity(randomVelocity);
    }

    fleeFrom(flashData) {
        if (!this.body) {
             return;
        }
        const angle = Phaser.Math.Angle.Between(this.x, this.y, flashData.x, flashData.y);
        const velocity = new Phaser.Math.Vector2();
        velocity.setToPolar(angle, this.speed);
        this.setVelocity(-velocity.x, -velocity.y);
        this.isMovingRandomly = false;
        this.randomMoveTimer = 0;
        this.playAnimationByVelocity(velocity);
    }

    playAnimationByVelocity(velocity) {
      this.angle = Phaser.Math.Angle.Between(0, 0, velocity.x, velocity.y);

        if (this.isFlashed) {
            this.angle += Math.PI; 
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

}


