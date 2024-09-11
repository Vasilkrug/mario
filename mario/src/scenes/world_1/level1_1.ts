import {Player} from "../../entities/player.ts";

export class Level1_1 extends Phaser.Scene {
    player?: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super('Level1_1');
    }

    preload() {
        this.load.image('tileset', 'src/assets/tileset.png');
        this.load.image('box', 'src/assets/mysteryBox.png');
        this.load.tilemapTiledJSON('level1_1Map', 'src/assets/1_1/1_1.json');
        this.load.atlas('player', 'src/assets/player/mario.png', 'src/assets/player/sprites.json');
        this.load.audio('jump', 'src/assets/player/sounds/jump.mp3');
        this.load.audio('mainTheme', 'src/assets/sounds/main-theme.mp3');
        this.load.audio('coin', 'src/assets/sounds/coin.mp3');
    }

    create() {
        const map = this.make.tilemap({key: 'level1_1Map'});
        const tileset = map.addTilesetImage('tileset', 'tileset', 16, 16);
        if (!tileset) return;
        map.createLayer('background', tileset, 0, 0);
        const ground = map.createLayer('ground', tileset, 0, 0);
        const pipes = map.createLayer('pipes', tileset, 0, 0);
        map.createLayer('skyes', tileset, 0, 0);
        map.createLayer('bushes', tileset, 0, 0);
        const platforms = map.createLayer('platforms', tileset, 0, 0);
        const blocks = map.createLayer('blocks', tileset, 0, 0);
        map.createLayer('castle', tileset, 0, 0);
        this.cameras.main.zoomTo(4);

        this.player = new Player(this, 100, 232, 'player')
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        if (!platforms || !ground || !pipes || !blocks) return;
        this.addPhysicToLayers(platforms, ground, pipes, blocks)
        this.cameras.main.startFollow(this.player);
        this.player.play('playerStay');
        this.player.setGravityY(400);
        const mysteryBoxes = map.createFromObjects('mysteryBox', {
            key: 'box'
        });

        mysteryBoxes?.forEach(block => {
            this.physics.world.enable(block);
            // @ts-ignore
            block.body.allowGravity = false;
            block.body.immovable = true;
            this.physics.add.collider(this.player as Player, block, () => {
                if (block.body.touching && this.player?.body?.touching.up) {
                    this.sound.play('coin');
                }
            });
        })
        // this.sound.play('mainTheme');
    }

    addPhysicToLayers(...layers: Phaser.Tilemaps.TilemapLayer[]) {
        layers.forEach(layer => {
            this.physics.add.collider(this.player as Player, layer, () => {
            });
            layer.setCollisionByExclusion([-1]);
        });
    }

    update(_: number, delta: number) {
        this.player?.update(delta);
    }

}