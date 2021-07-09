import Phaser, { Game } from 'phaser';
import { levelService } from '../levels/LevelService';

export default class LevelSelect extends Phaser.Scene
{
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
        const allLevels = levelService.getLevels();
        const textStyle = {
            fontSize: "50px"
        };
        for (let i=0; i<allLevels.length; ++i) {
            const levelName = allLevels[i];
            const levelPath = levelService.getLevelPath(levelName);
            const spriteX = 112+((i%4)*96);
            const spriteY = 112+(Math.floor(i/4)*96);
            let sprite = this.add.sprite(spriteX, spriteY, 'tiles', 39).setInteractive();
            this.add.text(sprite.x, sprite.y, levelName, textStyle).setOrigin(0.5);
            sprite.on('pointerdown', () => {
                this.scene.start('preloader', { level: levelPath });
            });
        }
    }
};