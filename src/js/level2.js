export default class Level2 extends Phaser.Scene {
    graphics;
    centerLine;
    leftLine;
    rightLine;
    follower = { t: 0, vec: new Phaser.Math.Vector2() };
    animationQueue = [];
    commandQueue = [];
    isExecutingCommand = false;
    currentLevel = "Level2";

    //Future possible abstractions:
    //1) Class to handle creating the path lines (composite design pattern, factory design pattern?)
    //2) Class to handle creating commands for interpreter (which design pattern?)
    //3) Abstract "executeNextCommand" for when we have many interpreter commands
    //4) Abstract out a class for handling tween creation, since we want the follower sprites grabbed from a part of the screen eventually, and we want the follower sprites to change!
    //5) Add a "clear scene" button

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
        // Add the background image. This is where we want to place our sprite map when ready
        this.add.image(400, 300, 'background');
        console.log(`[${this.currentLevel}] Background image added.`);

        this.graphics = this.add.graphics();
        console.log(`[${this.currentLevel}] Graphics object created.`);
    }

    createPathLines() { //Use composite pattern to create our paths + handle follower management!
        // Center line
        this.centerLine = new Phaser.Curves.Line(
            new Phaser.Math.Vector2(400, 100),
            new Phaser.Math.Vector2(400, 400)
        );
        console.log(`[${this.currentLevel}] Center line created.`);

        // Left diagonal.
        //We should export this to it's own class eventually to handle when we want to adjust lines on top of already existing lines!
        this.leftLine = new Phaser.Curves.Line(
            new Phaser.Math.Vector2(400, 400),
            new Phaser.Math.Vector2(200, 550)
        );
        console.log(`[${this.currentLevel}] Left line created.`);

        // Right diagonal
        this.rightLine = new Phaser.Curves.Line(
            new Phaser.Math.Vector2(400, 400),
            new Phaser.Math.Vector2(600, 550)
        );
        console.log(`[${this.currentLevel}] Right line created.`);
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
            //We should also add a "clear scene" button!
            let programText = C4C.Editor.getText();
            console.log(`[${this.currentLevel}] Run button clicked. Program text: ${programText}`);
            this.commandQueue = [];
            this.isExecutingCommand = false;

            //Queues all commands
            C4C.Interpreter.run(programText);
            // Start executing the queued commands one by one
            this.executeNextCommand();
        });
    }

    create() {
        this.initializeEditorWindow();
        this.initializeBackgroundGraphics();
        this.createPathLines();
        this.defineInterpreterCommands();
        this.initializeRunCodeButtion();
    }

    queuePseudocodeCommand(commandType) {
        this.commandQueue.push(commandType);
        console.log(`[${this.currentLevel}] Command ${commandType} queued. Total queued: ${this.commandQueue.length}`);
    }

    executeNextCommand() {
        // If already executing a command or no commands in queue, return
        let currentlyExecutingCommand = this.isExecutingCommand;
        let noCommandsInQueue = this.commandQueue.length === 0;
        if (currentlyExecutingCommand) return;
        if (noCommandsInQueue) {
            console.log(`[${this.currentLevel}] All commands completed.`);
            return;
        }

        const nextCommand = this.commandQueue.shift();
        this.isExecutingCommand = true;
        console.log(`[${this.currentLevel}] Executing command: ${nextCommand}. Remaining: ${this.commandQueue.length}`);

        //We should abstract this eventually for when we have MANY commands!
        if (nextCommand === "moveleft") {
            this.queueAnimation([this.centerLine, this.leftLine]);
        } else if (nextCommand === "moveright") {
            this.queueAnimation([this.centerLine, this.rightLine]);
        }
    }

    queueAnimation(lines) {
        this.animationQueue = lines;
        console.log(`[${this.currentLevel}] Animation queued. Queue length: ${lines.length}`);
        this.runNextAnimation();
    }

    runNextAnimation() {
        if (this.animationQueue.length === 0) {
            // Animation sequence complete, mark command as finished and execute next command
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
        // Log follower position every frame
        console.log(`[${this.currentLevel}] update: Follower at x=${this.follower.vec.x.toFixed(2)}, y=${this.follower.vec.y.toFixed(2)}`);
    }

    update() {
        this.graphics.clear();
        this.graphics.lineStyle(4, 0xffffff, 1);

        // Draw all three lines
        this.centerLine.draw(this.graphics);
        this.leftLine.draw(this.graphics);
        this.rightLine.draw(this.graphics);

        this.drawFollowerPosition();
    }
}