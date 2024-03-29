import Phaser from 'phaser';


export default class Preloader extends Phaser.Scene
{
    private levelPath:string = "";


    constructor()
    {
        super('preloader');
    }


    init(d: { level:number })
    {
        const data = Object.assign({ level:"" }, d); // In lieu of a default argument
        this.levelPath = data.level;
    }


    preload()
    {
        // Preload webfonts here
        this.load.audio('game-music', 'assets/music/8BitCave.wav');
        this.load.audio('confirmation', 'assets/sfx/confirmation_001.ogg');
        this.load.audio('move', 'assets/sfx/maximize_008.ogg');
        this.load.audio('error', 'assets/sfx/error_006.ogg');
    }


    create()
    {
        this.sound.play('game-music', {
            loop: true,
            volume: 0.2
        });
        this.scene.start('game', { level: this.levelPath });
    }
};