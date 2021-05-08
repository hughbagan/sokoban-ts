import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('preloader')
    }

    // preload()
    // {
    //     // Preload webfonts here
    // }

    create()
    {
        this.scene.start('game', { level: 1 });
    }
};