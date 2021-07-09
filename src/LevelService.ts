class LevelService
{
    // A list of level filenames (without filename extension)
    private levels = [
        "1",
        "2"
    ];
    private currentLevel:number = 0; // Current level is zero-indexed


    getLevels()
    {
        return this.levels;
    }


    getNumLevels()
    {
        return this.levels.length;
    }


    getLevelPath(levelName:string)
    {
        return `assets/levels/${levelName}.json`;
    }


    indexToPath(levelIndex:number)
    {
        const levelName = this.levels[levelIndex];
        return this.getLevelPath(levelName);
    }


    pathToIndex(levelPath:string)
    {
        // Assuming the path matches what's in getLevelPath()
        const levelName = levelPath.replace("assets/levels/", "").replace(".json", "");
        return this.levels.indexOf(levelName);
    }


    getCurrentLevel()
    {
        return this.currentLevel;
    }


    setCurrentLevel(newLevelIndex:number)
    {
        this.currentLevel = newLevelIndex;
    }
}

const levelService = new LevelService();

export { levelService };
