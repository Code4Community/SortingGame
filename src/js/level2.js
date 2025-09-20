import PathManager from "./SceneClasses/PathManager.js";
export default class Level2 extends Phaser.Scene {
    graphics;
    pathManager;
    follower = { t: 0, vec: new Phaser.Math.Vector2() };
    animationQueue = [];
    commandQueue = [];
    isExecutingCommand = false;
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

    initializePathManager() {
        this.pathManager = new PathManager(this);

        // Add lines
        this.pathManager.addLine('center', {x:400, y:100}, {x:400, y:400});
        this.pathManager.addLineFrom('left', 'center', {x:200, y:550});
        this.pathManager.addLineFrom('right', 'center', {x:600, y:550});

        // Define paths
        this.pathManager.definePath('moveleft', ['center', 'left']);
        this.pathManager.definePath('moveright', ['center', 'right']);
    }

    defineInterpreterCommands() {
        C4C.Interpreter.define("moveleft", () => {
            console.log(`[${this.currentLevel}] moveleft command queued.`);
            this.queuePseudocodeCommand("moveleft");
        });

        C4C.Interpreter.define("moveright", () => {
            console.log(`[${this.currentLevel}] moveright command queued.`);
            this.queuePseudocodeCommand("moveright");
        });
    }

    initializeRunCodeButton() {
        document.getElementById("enableCommands").addEventListener("click", () => {
            let programText = C4C.Editor.getText();
            console.log(`[${this.currentLevel}] Run button clicked. Program text: ${programText}`);
            this.commandQueue = [];
            this.isExecutingCommand = false;

            C4C.Interpreter.run(programText);
            this.executeNextCommand();
        });
    }

    create() {
        this.initializeEditorWindow();
        this.initializeBackgroundGraphics();
        this.initializePathManager();
        this.defineInterpreterCommands();
        this.initializeRunCodeButton();
    }

    queuePseudocodeCommand(commandType) {
        this.commandQueue.push(commandType);
        console.log(`[${this.currentLevel}] Command ${commandType} queued. Total queued: ${this.commandQueue.length}`);
    }

    executeNextCommand() {
        if (this.isExecutingCommand) return;
        if (this.commandQueue.length === 0) {
            console.log(`[${this.currentLevel}] All commands completed.`);
            return;
        }

        const nextCommand = this.commandQueue.shift();
        this.isExecutingCommand = true;
        console.log(`[${this.currentLevel}] Executing command: ${nextCommand}. Remaining: ${this.commandQueue.length}`);

        // Use pathManager to get the path for the command
        const pathLines = this.pathManager.getPath(nextCommand);
        if (pathLines.length > 0) {
            this.queueAnimation(pathLines);
        } else {
            console.warn(`[${this.currentLevel}] No path found for command: ${nextCommand}`);
            this.isExecutingCommand = false;
            this.executeNextCommand();
        }
    }

    queueAnimation(lines) {
        this.animationQueue = [...lines];
        console.log(`[${this.currentLevel}] Animation queued. Queue length: ${lines.length}`);
        this.runNextAnimation();
    }

    runNextAnimation() {
        if (this.animationQueue.length === 0) {
            this.isExecutingCommand = false;
            console.log(`[${this.currentLevel}] Animation sequence complete. Ready for next command.`);
            this.executeNextCommand();
            return;
        }

        const currentLine = this.animationQueue.shift();
        this.follower.t = 0;
        console.log(`[${this.currentLevel}] Starting animation on line. Remaining queue length: ${this.animationQueue.length}`);

        this.tweens.add({
            targets: this.follower,
            t: 1,
            ease: 'Sine.easeInOut',
            duration: 1200,
            onUpdate: () => {
                currentLine.getPoint(this.follower.t, this.follower.vec);
                console.log(`[${this.currentLevel}] Follower moving. t=${this.follower.t.toFixed(2)}, x=${this.follower.vec.x.toFixed(2)}, y=${this.follower.vec.y.toFixed(2)}`);
            },
            onComplete: () => {
                currentLine.getPoint(1, this.follower.vec);
                console.log(`[${this.currentLevel}] Animation complete for line. Follower at x=${this.follower.vec.x}, y=${this.follower.vec.y}`);
                this.runNextAnimation();
            }
        });
    }

    drawFollowerPosition() {
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillCircle(this.follower.vec.x, this.follower.vec.y, 16);
        console.log(`[${this.currentLevel}] update: Follower at x=${this.follower.vec.x.toFixed(2)}, y=${this.follower.vec.y.toFixed(2)}`);
    }

    update() {
        this.graphics.clear();
        this.graphics.lineStyle(4, 0xffffff, 1);
        
        this.pathManager.drawAll(this.graphics);

        this.drawFollowerPosition();
    }
}