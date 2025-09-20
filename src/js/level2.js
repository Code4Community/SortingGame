import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";

export default class Level2 extends Phaser.Scene {
    graphics;
    pathManager;
    animationExecutor;
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

    defineInterpreterCommands() {
        C4C.Interpreter.define("moveleft", () => {
            console.log(`[${this.currentLevel}] moveleft command queued.`);
            this.animationExecutor.queueCommand("moveleft");
        });

        C4C.Interpreter.define("moveright", () => {
            console.log(`[${this.currentLevel}] moveright command queued.`);
            this.animationExecutor.queueCommand("moveright");
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

    createLinesForConveyerBelt() {
        this.pathManager.addLine('center', {x:400, y:100}, {x:400, y:400});
        this.pathManager.addLineFrom('left', 'center', {x:200, y:550});
        this.pathManager.addLineFrom('right', 'center', {x:600, y:550});
    }

    createPathsFromLines() {
        this.pathManager.definePath('moveleft', ['center', 'left']);
        this.pathManager.definePath('moveright', ['center', 'right']);
    }

    create() {
        this.initializeEditorWindow();
        this.initializeBackgroundGraphics();
        this.defineInterpreterCommands();
        this.initializeRunCodeButton();
        this.pathManager = new PathManager(this);
        this.createLinesForConveyerBelt();
        this.createPathsFromLines();

        
        this.animationExecutor = new AnimationExecutor(this, this.pathManager);
    }

    update() {
        this.graphics.clear();
        this.graphics.lineStyle(4, 0xffffff, 1);
        
        this.pathManager.drawAll(this.graphics);
        this.animationExecutor.drawFollower(this.graphics);
    }
}