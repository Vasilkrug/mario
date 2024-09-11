export class Player extends Phaser.Physics.Arcade.Sprite {
    speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setOrigin(1);
        this.speed = 10;

        this.create();
    }

    create(): void {
        this.anims.create({
            key: 'playerStay',
            frames: this.anims.generateFrameNames('player', {prefix: 'stay', start: 1, end: 1, zeroPad: 4}),
        });
        this.anims.create({
            key: 'playerRun',
            frames: this.anims.generateFrameNames('player', {prefix: 'run', start: 3, end: 1, zeroPad: 4}),
            repeat: -1,
            frameRate: 9
        });

        this.anims.create({
            key: 'playerJump',
            frames: this.anims.generateFrameNames('player', {prefix: 'run', start: 5, end: 1, zeroPad: 4}),
        })
    }

    update(delta: number) {
        const keys = this.scene.input.keyboard?.createCursorKeys();
        if (keys?.left.isDown) {
            this.setFlipX(false);
            this.setVelocityX(-delta * this.speed);
            this.play('playerRun', true);
        } else if (keys?.right.isDown) {
            this.setFlipX(true);
            this.play('playerRun', true);
            this.setVelocityX(delta * this.speed);
        } else {
            this.setVelocityX(0);
            this.play('playerStay', true);
        }

        if (keys?.space.isDown && this.body?.blocked.down) {
            this.setVelocityY(-delta * this.speed * 2.025);
            this.scene.sound.play('jump');
        }
        if (!this.body?.blocked.down) {
            this.play('playerJump', true);
        }
    }
}