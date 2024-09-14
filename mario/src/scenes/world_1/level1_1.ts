import {Player} from "../../entities/player.ts";

type tweensObjectAnimsType = Phaser.GameObjects.GameObject | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type tweensConfigType = Phaser.Types.Tweens.TweenBuilderConfig
    | Phaser.Types.Tweens.TweenChainBuilderConfig
    | Phaser.Tweens.Tween
    | Phaser.Tweens.TweenChain;

export class Level1_1 extends Phaser.Scene {
    player?: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super('Mario');
    }

    preload() {
        this.load.image('tileset', 'src/assets/tileset.png');
        this.load.image('box', 'src/assets/mysteryBox.png');
        this.load.image('emptyBlock', 'src/assets/emptyBlock.png');
        this.load.tilemapTiledJSON('level1_1Map', 'src/assets/1_1/1_1.json');
        this.load.atlas('player', 'src/assets/player/mario.png', 'src/assets/player/sprites.json');
        this.load.atlas('coin', 'src/assets/coin/coin.png', 'src/assets/coin/coin.json');
        this.load.audio('jump', 'src/assets/player/sounds/jump.mp3');
        this.load.audio('mainTheme', 'src/assets/sounds/main-theme.mp3');
        this.load.audio('coin', 'src/assets/sounds/coin.mp3');
        this.load.audio('emptyBlock', 'src/assets/sounds/emptyBlock.mp3');
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
            if (!block || !block?.body) return;
            block.body.allowGravity = false;
            block.body.immovable = true;
            const blockTweensConfig = {
                targets: block,
                duration: 70,
                y: block.y - block.height / 2,
                onComplete: () => {
                    this.tweens.add({
                        targets: block,
                        duration: 70,
                        start: performance.now(),
                        y: block.y + block.height / 2
                    });
                },
                onCompleteScope: this
            };

            this.physics.add.collider(this.player as Player, block, () => {
                if (block.body.touching && this.player?.body?.touching.up && block.active) {
                    this.emergenceObjectFromBlock(block);
                    block.setActive(false)
                    block.setTexture('emptyBlock');
                    this.tweensMoveAnimation(blockTweensConfig);
                } else if (block.body.touching && this.player?.body?.touching.up && !block.active) {
                    this.sound.play('emptyBlock');
                    this.tweensMoveAnimation(blockTweensConfig);
                }
            });
        })
        // this.sound.play('mainTheme');
    }

    private emergenceObjectFromBlock(block: tweensObjectAnimsType) {
        const name = block.name;

        switch (name) {
            case 'coin':
                const coin = this.physics.add.sprite(
                    block.getBounds().x + block.width / 2,
                    block.getBounds().y - block.height / 2,
                    'coin');
                coin.immovable = true;
                coin.allowGravity = false;
                coin.smoothed = true;
                coin.depth = 0;
                this.sound.play('coin');
                this.tweensMoveAnimation({
                    targets: coin,
                    duration: 500,
                    start: performance.now(),
                    y: coin.y - coin.height,
                    onComplete: () => {
                        this.tweens.add({
                            targets: coin,
                            duration: 500,
                            start: performance.now(),
                            y: coin.y + coin.height,
                            onComplete: () => {
                                coin.destroy();
                            }
                        });
                    },
                    onCompleteScope: this
                });
                break;
        }
    }

    private tweensMoveAnimation(config: tweensConfigType) {
        this.tweens.add(config);
    }

    private

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