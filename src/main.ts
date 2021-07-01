import Phaser from 'phaser';

import LevelSelect from './scenes/LevelSelect';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 512,
	height: 512,
	scene: [LevelSelect, Preloader, Game]
};

export default new Phaser.Game(config);
