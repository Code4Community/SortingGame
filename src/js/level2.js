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
        C4C.Editor.setText('moveleft');
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
        this.pathManager.addLineFrom('left', 'center', { x: 200, y: 550 });
        this.pathManager.addLineFrom('right', 'center', { x: 600, y: 550 });
    }

    createPathsFromLines() {
        this.pathManager.definePath('moveleft', ['center', 'left']);
        this.pathManager.definePath('moveright', ['center', 'right']);
    }

    defineInterpreterCommands() {
        this.commandManager.defineCommandForPath('moveleft');
        this.commandManager.defineCommandForPath('moveright');
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