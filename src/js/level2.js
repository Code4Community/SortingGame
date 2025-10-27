import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";
import CommandManager from "./SceneClasses/CommandManager.js";

export default class Level2 extends Phaser.Scene {
    graphics;
    pathManager;
    animationExecutor;
    commandManager;
    currentLevel = "Level2";

    // Define the conveyor map
    ConveyerMap = {
        1: "ConveyerDown",
        2: "ConveyerLeft",
        3: "ConveyerRight",
        4: "Connector",
        5: "ConveyerAll"
    };

    // Define level layout
    levelData = [
        [0, 1, 0],
        [2, 4, 3],
        [0, 1, 0]
    ];

    preload() {
        // Load conveyor belt images
        this.load.image('Connector', 'assets/conveyer_photos/Connector.png');
        this.load.image('ConveyerDown', 'assets/conveyer_photos/ConveyerDown.png');
        this.load.image('ConveyerAll', 'assets/conveyer_photos/ConnectorAll.png');
        this.load.image('ConveyerLeft', 'assets/conveyer_photos/Left_Belt.png');
        this.load.image('ConveyerRight', 'assets/conveyer_photos/Right_belt.png');
        
        // Load candy sprites
        this.load.image('blue-circle', 'assets/candy_photos/blue-circle.png');
        this.load.image('red-square', 'assets/candy_photos/red-square.png');
        this.load.image('green-triangle', 'assets/candy_photos/green-triangle.png');
        
        console.log(`[${this.currentLevel}] Preloading conveyor belts and candy sprites.`);
    }

    initializeEditorWindow() {
        C4C.Editor.Window.init(this);
        C4C.Editor.Window.open();
        C4C.Editor.setText('moveLeft\ndumpCandy');
        console.log(`[${this.currentLevel}] Text editor initialized.`);
    }

    initializeBackgroundGraphics() {
        this.graphics = this.add.graphics();
        console.log(`[${this.currentLevel}] Graphics object created.`);
        
        // Render the conveyor belt level
        this.renderLevelData();
    }

    renderLevelData() {
        const tileSize = 64;
        const offsetX = 200;
        const offsetY = 100;

        for (let row = 0; row < this.levelData.length; row++) {
            for (let col = 0; col < this.levelData[row].length; col++) {
                const tileType = this.levelData[row][col];
                if (tileType === 0) continue;
                
                const textureKey = this.ConveyerMap[tileType];
                const image = this.add.image(
                    offsetX + col * tileSize, 
                    offsetY + row * tileSize, 
                    textureKey
                ).setOrigin(0);
                
                image.setScale(2); // Scale up the conveyor images
            }
        }
        
        console.log(`[${this.currentLevel}] Level data rendered.`);
    }

    createLinesForConveyerBelt() {
        this.pathManager.addLine('center', { x: 400, y: 100 }, { x: 400, y: 300 });
        
        // Left branch
        this.pathManager.addLineFrom('center', 'left', { x: 200, y: 300 });
        
        // Right branch
        this.pathManager.addLineFrom('center', 'right', { x: 600, y: 300 });
    }

    createIncrementalCommands() {
        this.pathManager.defineIncrementalCommand('moveLeft', (currentPos) => {
            return { x: currentPos.x - 100, y: currentPos.y };
        });

        this.pathManager.defineIncrementalCommand('moveRight', (currentPos) => {
            return { x: currentPos.x + 100, y: currentPos.y };
        });

        this.pathManager.defineIncrementalCommand('moveUp', (currentPos) => {
            return { x: currentPos.x, y: currentPos.y - 100 };
        });

        this.pathManager.defineIncrementalCommand('moveDown', (currentPos) => {
            return { x: currentPos.x, y: currentPos.y + 100 };
        });
    }

    setupLevelCandies() {
        //Define the candies for this level
        //TODO: Adjust this to use the Candy class!
        const candies = [
            { type: 'blue-circle', id: 1 },
            { type: 'red-square', id: 2 },
            { type: 'green-triangle', id: 3 }
        ];

        //Define goal positions for each candy type. Again, adjust to using the Candy class
        const goalPositions = {
            'blue-circle': { x: 200, y: 300 },    // Left bin
            'red-square': { x: 600, y: 300 },     // Right bin
            'green-triangle': { x: 400, y: 400 }  // Bottom bin
        };

        // Set up callbacks for candy completion
        this.pathManager.setCallbacks(
            (candy) => this.onCandySuccess(candy),
            (candy, position) => this.onCandyFailed(candy, position)
        );

        this.pathManager.setupCandyQueueAndGoalPositions(candies, goalPositions);
    }

    //Having these two methods below in Level2.js is fine for now- to be discussed if we just
    //want the same behavior for each case anyways, if so we can just export it to CommandManager
    onCandySuccess(candy) {
        console.log(`[${this.currentLevel}] Candy ${candy.type} successfully sorted!`);
        //TODO: Implement some actual behavior here.
        //This is when we want to transition to the next candy, and then once all those are sorted END THE GAME!
        //Make something similar to the animationExecutor.reset() method 
    }

    onCandyFailed(candy, position) {
        console.log(`[${this.currentLevel}] Candy ${candy.type} failed! Position:`, position);
        alert(`Candy ${candy.type} is not in the correct position! Try again.`);
        //TODO: We should replace this with something better- this alert popup is hideous
        //Make something similar to the animationExecutor.reset() method 
    }

    defineInterpreterCommands() {
        this.commandManager.defineIncrementalCommand('moveLeft');
        this.commandManager.defineIncrementalCommand('moveRight');
        this.commandManager.defineIncrementalCommand('moveUp');
        this.commandManager.defineIncrementalCommand('moveDown');
        this.commandManager.defineDumpCandyCommand();

        this.commandManager.defineCustomCommand('sampleCommand', () => {
            console.log("This is an example custom command, should run immediately");
        });

        this.commandManager.defineQueuedCustomCommand('queuedCommand', () => {
            console.log("This is an example custom command that is queued according to animation, should run in animation sequence");
        });
    }

    initializeRunCodeButton() {
        document.getElementById("enableCommands").addEventListener("click", () => {
            let programText = C4C.Editor.getText();
            console.log(`[${this.currentLevel}] Run button clicked. Program text: ${programText}`);
            
            this.setupLevelCandies();
            this.animationExecutor.reset();

            C4C.Interpreter.run(programText);
            this.animationExecutor.executeNextCommand();
        });
    }

    create() {
        this.initializeEditorWindow();
        this.initializeBackgroundGraphics();
        this.pathManager = new PathManager(this);
        this.animationExecutor = new AnimationExecutor(this, this.pathManager);
        this.commandManager = new CommandManager(this, this.pathManager, this.animationExecutor);

        //Set up the level
        this.createLinesForConveyerBelt();
        this.createIncrementalCommands();
        this.setupLevelCandies();
        this.defineInterpreterCommands();
        this.initializeRunCodeButton();
    }

    update() {
        this.graphics.clear();
        this.graphics.lineStyle(4, 0xffffff, 1);

        this.pathManager.drawAll(this.graphics);
        this.animationExecutor.drawFollower(this.graphics);
    }
}
