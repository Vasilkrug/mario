import Phaser from 'phaser'
import './style.css'
import {scenes} from "./scenes";

new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: scenes,
    pixelArt: true
})