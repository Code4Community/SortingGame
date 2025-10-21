import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";
import CommandManager from "./SceneClasses/CommandManager.js";

export default class Level1 extends Phaser.Scene {
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
        //C4C.Editor.setText('moveleft');
        console.log(`[${this.currentLevel}] Text editor initialized.`);
    }

    initializeBackgroundGraphics() {
        this.add.image(400, 300, 'background');
        console.log(`[${this.currentLevel}] Background image added.`);

        this.graphics = this.add.graphics();
        console.log(`[${this.currentLevel}] Graphics object created.`);
    }

    /**
     * idea is to move the candy to the location (from current to goal coord)
     * we have something to keep track of where we are and check if we are in a valid coordinate 
     *    - valid coordinates are defined in a data structure (map, where coords are keys and values determined if visitied)
     * 
     */

    // Initialize map values in the constructor
    constructor() {
        super("Level1");
        this.map = new Map();
        this.key1 = [{x: 400, y: 100}];
        this.val1 = [{x: 400, y: 200}];
        this.key2 = [{x: 400, y: 200}];
        this.val2 = [{x: 300, y: 400}]; 
        this.map.set(this.key1, this.val1);
        this.map.set(this.key2, this.val2);
    }
    
    


    createLinesForConveyerBelt() {
        this.pathManager.addLine('center', { x: 400, y: 100 }, { x: 400, y: 200 });
        this.pathManager.addLineFrom('left', 'center', { x: 300, y: 400 });
        this.pathManager.addLineFrom('right', 'center', { x: 500, y: 400 });
        this.pathManager.addLineFrom('right2', 'right', { x:600, y:500})
        this.pathManager.addLineFrom('rightleft', 'right', {x:400, y:500})
    }

    createPathsFromLines() {
        this.pathManager.definePath('moveleft', ['center', 'left']);
        this.pathManager.definePath('moveright', ['center', 'right']);
        this.pathManager.definePath('moveright1', ['right2']);
        this.pathManager.definePath('moveleft1', ['rightleft']);
    }

    defineInterpreterCommands() {
        this.commandManager.defineCommandForPath('moveleft');
        this.commandManager.defineCommandForPath('moveright');
        this.commandManager.defineCommandForPath('moveright1');
        this.commandManager.defineCommandForPath('moveleft1');
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

        // Set up the level
        this.createLinesForConveyerBelt();
        this.createPathsFromLines();
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
