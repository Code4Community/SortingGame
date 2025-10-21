import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";
import CommandManager from "./SceneClasses/CommandManager.js";

export default class Level2 extends Phaser.Scene {
    graphics;
    pathManager;
    animationExecutor;
    commandManager;
    currentLevel = "Level2";

    preload() {
        this.load.image('background', 'assets/background.png');
        console.log(`[${this.currentLevel}] Preloading background image.`);
    }

    initializeEditorWindow() {
        C4C.Editor.Window.init(this);
        C4C.Editor.Window.open();
        C4C.Editor.setText('moveLeft\ndumpCandy');
        console.log(`[${this.currentLevel}] Text editor initialized.`);
    }

    initializeBackgroundGraphics() {
        this.add.image(400, 300, 'background');
        console.log(`[${this.currentLevel}] Background image added.`);

        this.graphics = this.add.graphics();
        console.log(`[${this.currentLevel}] Graphics object created.`);
    }

    createLinesForConveyerBelt() {
        this.pathManager.addLine('center', { x: 400, y: 100 }, { x: 400, y: 400 });
        this.pathManager.addLineFrom('center', 'left', { x: 200, y: 400 });
        this.pathManager.addLineFrom('center', 'right', { x: 600, y: 400 });
        // this.pathManager.addLineFrom('center', 'leftDown', { x: 200, y: 350 });
        // this.pathManager.addLineFrom('center', 'rightDown', { x: 600, y: 150 });
    }

    createIncrementalCommands() {
        // Define incremental movement commands
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
            'blue-circle': { x: 200, y: 400 },    // Left bin
            'red-square': { x: 600, y: 400 },     // Right bin
            'green-triangle': { x: 400, y: 500 }  // Bottom bin
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
        //This is when we want to transitiotn to the next candy, and then once all those are sorted END THE GAME!
          //Make something simialr to the animationExecutor.reset() method 
    }

    onCandyFailed(candy, position) {
        console.log(`[${this.currentLevel}] Candy ${candy.type} failed! Position:`, position);
        alert(`Candy ${candy.type} is not in the correct position! Try again.`);
        //TODO: We should replace this with something better- this alert popup is hideous
            //Make something simialr to the animationExecutor.reset() method 
        
        // we want to reset the candies position and the level too

        // should reset the candy
        this.animationExecutor.reset();
        console.log("testing onCandyFailed")


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
