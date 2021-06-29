import Phaser from 'phaser';
import * as Colors from '../consts/Color';
import { boxToSwitchColor, switchToBoxColor, bigBoxPartner } from '../utils/ColorUtils';

import { sharedInstance as levels } from '../levels/LevelService';

export default class Game extends Phaser.Scene
{
    private player?:Phaser.GameObjects.Sprite;
    private cursors?:Phaser.Types.Input.Keyboard.CursorKeys;
    private layer?:Phaser.Tilemaps.TilemapLayer;
    private boxesByColor: { [key:number]: Phaser.GameObjects.Sprite[] } = {};
    private switchesCoveredByColor: { [key:number]: number } = {};
    private allSwitches: { [key:number]: number } = {};
    private movesCount = 0;

    private currentLevel = 0; // re-assigned below


	constructor()
	{
		super('game');
	}


    init(d: { level:number })
    {
        const data = Object.assign({ level:1 }, d); // In lieu of a default argument
        this.currentLevel = data.level;
        this.movesCount = 0;
    }


	preload()
    {
        this.load.tilemapTiledJSON('tilemap', `assets/levels/level${this.currentLevel}.json`);

        this.load.spritesheet('tiles', 'assets/sokoban_tilesheet.png', {
            frameWidth: 64,
            startFrame: 0
        });
        
        this.cursors = this.input.keyboard.createCursorKeys();
    }


    create(d: { level:number })
    {
        // LEVEL
        // const data = Object.assign({ level:1 }, d); // In lieu of a default argument
        // this.currentLevel = data.level;
        // const level = levels.getLevel(this.currentLevel);
        // const map = this.make.tilemap({
        //     data: level,
        //     tileWidth: 64,
        //     tileHeight: 64
        // });

        const map = this.make.tilemap({ key: 'tilemap' });
        // "sokoban" is the name of the tileset in Tiled
        const tiles = map.addTilesetImage('sokoban', 'tiles');
        // "Level" is the name of the layer in Tiled
        this.layer = map.createLayer('Level', tiles, 0, 0);
        
        // PLAYER
        this.player = this.layer.createFromTiles(53, 0, {key:'tiles', frame:52}).pop();
        this.player?.setOrigin(0);
        this.anims.create({
            key: 'idle',
            frames: [{key:'tiles', frame:52}]
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('tiles', {start:81, end:83}),
            frameRate: 10, 
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('tiles', {start:78, end:80}),
            frameRate: 10, 
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('tiles', {start:55, end:57}),
            frameRate: 10, 
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('tiles', {start:52, end:54}),
            frameRate: 10, 
            repeat: -1
        });

        this.extractBoxes(this.layer);
        this.countSwitches(this.layer);

        // text for movesCount or allSwitchesCovered would go here!

        // Listen for the scene shutdown / cleanup, and delete the map
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.cache.tilemap.remove('tilemap');
            this.sound.stopByKey('error');
        });
    }


    private extractBoxes(layer:Phaser.Tilemaps.TilemapLayer)
    {
        const boxColors = [
            Colors.BOX_ORANGE,
            Colors.BOX_RED,
            Colors.BOX_BLUE,
            Colors.BOX_GREEN,
            Colors.BOX_GREY
        ];
        // Also extract wide and tall boxes
        for (const big in Colors.Big) {
            boxColors.push(Colors.Big[big]);
        }
        boxColors.forEach(color => {
            this.boxesByColor[color] = layer.createFromTiles(color+1, 0, {key:'tiles', frame:color})
                .map(box => box.setOrigin(0));
            const switchColor = boxToSwitchColor(color);
            this.switchesCoveredByColor[switchColor] = 0;
        });
        // There are no white boxes, so we can just do this
        this.switchesCoveredByColor[Colors.SWITCH_WHITE] = 0;
    }


    private countSwitches(layer:Phaser.Tilemaps.TilemapLayer)
    {
        // Iterate over all tiles and count all the switches
        const switchColors = [
            Colors.SWITCH_ORANGE,
            Colors.SWITCH_RED,
            Colors.SWITCH_BLUE,
            Colors.SWITCH_GREEN,
            Colors.SWITCH_GREY,
            Colors.SWITCH_WHITE
        ];
        switchColors.forEach(color => {
            this.allSwitches[color] = 0;
        });
        const layerData = layer.layer;
        const tiles = layerData.data;
        for (let i=0; i<layerData.height; ++i) {
            for (let j=0; j<layerData.width; ++j) {
                const tile = tiles[i][j];
                // +1 to the index to adjust for Tiled
                for (let color of switchColors) {
                    if (color === tile.index-1) {
                        this.allSwitches[tile.index-1] += 1;
                    }
                }
            }
        }
    }


    private changeSwitchCoveredCount(color:number, change:number)
    {
        if (!(color in this.switchesCoveredByColor)) {
            this.switchesCoveredByColor[color] = 0;
        }
        this.switchesCoveredByColor[color] += change;
        if (change > 0) {
            this.sound.play('confirmation', {
                volume: 0.3
            });
        }
    }


    private getBoxAt(x:number, y:number)
    {
        // TODO: review lambda expressions to figure out what's happening here.
        // Pretty sure it's returning the whole box though not a boolean
        const keys = Object.keys(this.boxesByColor);
        for (let i=0; i<keys.length; ++i) {
            const color = keys[i];
            const box = this.boxesByColor[color].find(box => {
                const rect = box.getBounds();
                return rect.contains(x, y);
            });
            if (box) {
                return { 
                    box, 
                    color: parseInt(color)
                };
            }
        }
        return undefined; // Nope, nothing here!
    }


    private isWallAt(x:number, y:number)
    {
        return this.isTileAt(x, y, 100); // 100 is the wall tile
    }


    private isTileAt(x:number, y:number, tileIndex:number)
    {
        // NOTE: CAN'T BE USED TO CHECK FOR BOXES! (use getBoxAt)
        if (!this.layer) {
            return false;
        }
        const tile = this.layer.getTileAtWorldXY(x, y);
        if (!tile) {
            return false;
        }
        // + 1 to account for Tiled...
        return tile.index === tileIndex + 1;
    }


    private getNearestCoords(direction:String) 
    {
        if (!this.player) {
            return;
        }
        let roundCoords = {
            x: this.player.x,
            y: this.player.y
        };
        switch(direction) {
            case 'left':
                if (this.player.x % 64 === 0) {
                    roundCoords.x = this.player.x - 64;
                } else {
                    roundCoords.x = this.player.x - (this.player.x % 64);
                }
                break;
            case 'right':
                roundCoords.x = this.player.x + (64 - (this.player.x % 64));
                break;
            case 'up':
                if (this.player.y % 64 === 0) {
                    roundCoords.y = this.player.y - 64;
                } else {
                    roundCoords.y = this.player.y - (this.player.y % 64); 
                }
                break;
            case 'down':
                roundCoords.y = this.player.y + (64 - (this.player.y % 64));
                break;
            default:
                return;
        }
        return roundCoords;
    }


    private offsetPosition(x:number, y:number, direction:String)
    {
        let newX = x;
        let newY = y;
        switch (direction) {
            case 'left':
                newX -= 64;
                break;
            case 'right':
                newX += 64;
                break;                
            case 'up':
                newY -= 64;
                break;
            case 'down':
                newY += 64;
                break;
            default:
                break;
        }
        return [newX, newY];
    }


    private movePlayer(direction:String, playerXOffset:number, playerYOffset:number, tweenX, tweenY)
    {
        if (!this.player) {
            return;
        }
        const goto = this.getNearestCoords(direction);
        if (!goto) {
            return false;
        }
        if (this.isWallAt(goto.x, goto.y)) {
            return false;
        }
        // Check for a potential box in the way
        let targetX = this.player.x+playerXOffset;
        let targetY = this.player.y+playerYOffset;
        const boxData = this.getBoxAt(targetX, targetY);
        if (boxData) {
            const targets = [boxData.box];
            const boxColor = boxData.color;
            // Recognize wide and tall boxes
            const lookingFor = bigBoxPartner(boxColor);
            for (let color in Colors.Big) {
                if (Colors.Big[color] === boxColor) {
                    const offsets = [ [-64, 0], [64, 0], [0, -64], [0, 64] ];
                    offsets.forEach(coord => {
                        const otherHalf = this.getBoxAt(targetX+coord[0], targetY+coord[1]);
                        if (otherHalf) {
                            // NOTE! Could cause a bug if a box of the same type is adjacent.
                            if (otherHalf.color === lookingFor) {
                                targets.push(otherHalf.box);
                            }
                        }
                    });
                }
            }
            // Make sure the box(es) isn't against a wall or another box
            const twoTilesOver = this.offsetPosition(targetX, targetY, direction);
            const twoTilesOverX = twoTilesOver[0];
            const twoTilesOverY = twoTilesOver[1];
            let blocked = false; // apparently anon funcs don't return outside their contexts
            if (targets.length === 1) {
                if (this.isWallAt(twoTilesOverX, twoTilesOverY) || this.getBoxAt(twoTilesOverX, twoTilesOverY)) {
                    blocked = true;
                }
            }
            else if (targets.length === 2) { // 2-tile-large boxes
                // Check the direction vector for each piece of the box
                targets.forEach(box => {
                    const nextTileOver = this.offsetPosition(box.x+32, box.y+32, direction);
                    if (this.isWallAt(nextTileOver[0], nextTileOver[1])) {
                        blocked = true;
                    }
                    const potentialBox = this.getBoxAt(nextTileOver[0], nextTileOver[1]);
                    if (potentialBox) {
                        // If there's a DIFFERENT box here, we're blocked.
                        if (potentialBox.color !== lookingFor) {
                            blocked = true;
                        }
                    }
                });
            }
            if (blocked) {
                return false;
            }
            // Is the box already covering a same-colored switch?
            let switchColor = boxToSwitchColor(boxColor);
            // const coveredSwitch = this.isTileAt(targets[0].x, targets[0].y, switchColor);
            let coveredSwitch = false;
            let numCovered = 0;
            targets.forEach(box => {
                if (this.isTileAt(box.x, box.y, Colors.SWITCH_WHITE)) {
                    coveredSwitch = true;
                    numCovered++;
                    switchColor = Colors.SWITCH_WHITE;
                }
                else if (this.isTileAt(box.x, box.y, switchColor)) {
                    coveredSwitch = true;
                    numCovered++;
                }
            });
            if (coveredSwitch) {
                this.changeSwitchCoveredCount(switchColor, -numCovered);
            }
            // Move the box(es)
            targets.forEach(box => {
                this.tweens.add({
                    targets: box,
                    x: tweenX,
                    y: tweenY,
                    duration: 375,
                    onComplete: () => {
                        // Check whether the box is over a same-colored switch
                        const coveredSwitch = this.isTileAt(box.x, box.y, switchColor);
                        if (this.isTileAt(box.x, box.y, Colors.SWITCH_WHITE)) {
                            this.changeSwitchCoveredCount(Colors.SWITCH_WHITE, 1);
                        }
                        else if (coveredSwitch) {
                            this.changeSwitchCoveredCount(switchColor, 1);
                        }
                        if (this.allSwitchesCovered()) {
                            // Level complete! Start next level
                            if (this.currentLevel < levels.getNumLevels()) {
                                console.log("WINNER!");
                                this.scene.start('game', { level: this.currentLevel+1 })
                            } else {
                                console.log('No more levels');
                            }
                        }
                    }
                });
            });
        }
        // Move the player
        this.sound.play('error', {
            loop: true,
            volume: 0.1,
            rate: 2
        });
        this.tweens.add({
            targets: this.player,
            x: goto.x,
            y: goto.y,
            duration: 400, // ms
            onComplete: () => { // using a lambda
                this.player?.anims?.pause(this.player?.anims?.currentFrame);
                this.movesCount += 1;
                // console.log(this.movesCount);
                this.sound.stopByKey('error');
            }
        });
    }


    private allSwitchesCovered()
    {
        // Check if # of covered switches matches total # of switches.
        // Because Big boxes mean there can be more boxes than switches.
        const switchColors = Object.keys(this.switchesCoveredByColor);
        for (let i=0; i<switchColors.length; ++i) {
            const color = parseInt(switchColors[i]);
            if (this.switchesCoveredByColor[color] !== this.allSwitches[color]) {
                return false;
            }
        }
        return true;
    }


    update()
    {
        if (!this.cursors || !this.player) {
            return;
        }

        const justLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left);
        const justRight = Phaser.Input.Keyboard.JustDown(this.cursors.right);
        const justUp = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        const justDown = Phaser.Input.Keyboard.JustDown(this.cursors.down);
        if (!this.tweens.isTweening(this.player)) {
            if (justLeft || this.cursors.left.isDown) {
                this.player?.anims.play('left', true);
                this.movePlayer('left', -32, 32, '-=64', '-=0');
            } else if (justRight || this.cursors.right.isDown) {
                this.player?.anims.play('right', true);
                this.movePlayer('right', 96, 32, '+=64', '-=0');
            } else if (justUp || this.cursors.up.isDown) {
                this.player?.anims.play('up', true);
                this.movePlayer('up', 32, -32, '-=0', '-=64');
            } else if (justDown || this.cursors.down.isDown) {
                this.player?.anims.play('down', true);
                this.movePlayer('down', 32, 96, '+=0', '+=64');
            } else if (this.player?.anims.isPlaying) {
                this.player?.anims?.pause(this.player?.anims?.currentFrame);
            }    
        }
    }
};
