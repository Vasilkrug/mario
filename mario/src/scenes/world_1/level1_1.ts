export class Level1_1 extends Phaser.Scene {
    player?: Phaser.Physics.Arcade.Sprite;
    constructor() {
        super('Level1_1');
    }

    preload() {
        this.load.image('tileset', 'src/assets/tileset.png');
        this.load.tilemapTiledJSON('level1_1Map', 'src/assets/1_1/1_1.json');
        this.load.atlas('player', 'src/assets/player/mario.png', 'src/assets/player/sprites.json');
    }

    create() {
        const map = this.make.tilemap({key: 'level1_1Map'});
        const tileset = map.addTilesetImage('tileset', 'tileset', 16,16);
        if (!tileset) return;
        map.createLayer('background', tileset,0,0);
        const ground = map.createLayer('ground', tileset,0,0);
        const pipes = map.createLayer('pipes', tileset,0,0);
        map.createLayer('skyes', tileset,0,0);
        map.createLayer('bushes', tileset,0,0);
        const platforms = map.createLayer('platforms', tileset,0,0);
        map.createLayer('blocks', tileset,0,0);
        map.createLayer('castle', tileset,0,0);
        this.cameras.main.zoomTo(4);
        this.anims.create({
            key: 'playerStay',
            frames: this.anims.generateFrameNames('player', { prefix: 'stay', start: 1,end: 1, zeroPad: 4}),
            repeat: -1
        });
        this.anims.create({
            key: 'playerRun',
            frames: this.anims.generateFrameNames('player', { prefix: 'run', start: 1,end: 5, zeroPad: 4}),
            repeat: -1,
            frameRate: 9
        });
        this.player = this.physics.add.sprite(100,232,'player').setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        if (!platforms || !ground || !pipes) return;
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.player, pipes);
        ground.setCollisionByExclusion([-1]);
        platforms.setCollisionByExclusion([-1]);
        pipes.setCollisionByExclusion([-1]);
        this.cameras.main.startFollow(this.player);
        this.player.play('playerStay');
        this.player.setGravityY(400)
    }

    update(_: number, delta: number) {
        const keys = this.input.keyboard?.createCursorKeys();
        if (keys?.left.isDown) {
            this.player?.setFlipX(false);
            this.player?.setVelocityX(-200);
            this.player?.play('playerRun');
        } else if (keys?.right.isDown) {
            this.player?.setFlipX(true);
            this.player?.play('playerRun');
            this.player?.setVelocityX(200);
        } else {
            this.player?.setVelocityX(0);
            this.player?.play('playerStay');
        }

        if (keys?.space.isDown && this.player?.body?.blocked.down) {
            this.player?.setVelocityY(-300);
            this.player.play('playerStay');
        }
    }

}