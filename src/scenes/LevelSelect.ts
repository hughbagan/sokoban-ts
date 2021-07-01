import Phaser from 'phaser';

export default class LevelSelect extends Phaser.Scene
{
    private levelSprites?:Phaser.GameObjects.Sprite[];

    constructor()
    {
        super('levelselect');
    }

    preload()
    {
        this.load.spritesheet('tiles', 'assets/sokoban_tilesheet.png', {
            frameWidth: 64,
            startFrame: 0
        });
    }

    create()
    {
        // Display available levels
        let sprite = this.add.sprite(128, 192, 'tiles', 39).setInteractive();
        console.log(sprite.width, sprite.height);
        const textStyle = {
            fontSize: "50px"
        };
        let sprite_text = this.add.text(sprite.x, sprite.y, "1", textStyle).setOrigin(0.5);
        this.levelSprites?.push(sprite);
        sprite.on('pointerdown', (obj:Phaser.GameObjects.Sprite) => {
            this.scene.start('preloader', { level: 1 });
        });
    }
};