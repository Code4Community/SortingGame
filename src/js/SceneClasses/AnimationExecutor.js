export default class AnimationExecutor {
    constructor(scene, pathManager) {
        this.scene = scene;
        this.pathManager = pathManager;
        //Two types of commands in the queue: custom and path
        this.commandQueue = [];
        //Ex: {type: 'path', command: 'moveleft'} 
        //Ex: {type: 'custom', command: 'sampleCustomCommand', callback: function() { console.log("blah")}}
        this.animationQueue = [];
        this.isExecutingCommand = false;
        this.follower = { t: 0, vec: new window.Phaser.Math.Vector2() }; //I think this is why the follower is appearing where it is right now...
    }

    queueCommand(commandType) {
        this.commandQueue.push({ type: 'path', command: commandType });
        console.log(`[${this.scene.currentLevel}] Path command ${commandType} queued. Total queued: ${this.commandQueue.length}`);
    }

    queueCustomCommand(commandName, callback) {
        this.commandQueue.push({ type: 'custom', command: commandName, callback: callback });
        console.log(`[${this.scene.currentLevel}] Custom command ${commandName} queued. Total queued: ${this.commandQueue.length}`);
    }

    executeNextCommand() {
        if (this.isExecutingCommand) return;
        if (this.commandQueue.length === 0) {
            console.log(`[${this.scene.currentLevel}] All commands completed.`);
            return;
        }

        const nextCommandObj = this.commandQueue.shift();
        this.isExecutingCommand = true;
        console.log(`[${this.scene.currentLevel}] Executing command: ${nextCommandObj.command}. Remaining: ${this.commandQueue.length}`);

        if (nextCommandObj.type === 'path') {
            console.log("Executing path command");
            this._executePathCommand(nextCommandObj);
        } else if (nextCommandObj.type === 'custom') {
            console.log("Executing custom command");
            this._executeCustomCommand(nextCommandObj);
        }
    }

    _executePathCommand(nextCommandObj) {
        const pathLines = this.pathManager.getPath(nextCommandObj.command);
        if (pathLines.length > 0) {
            this.queueAnimation(pathLines);
        } else {
            console.warn(`[${this.scene.currentLevel}] No path found for command: ${nextCommandObj.command}`);
            this.isExecutingCommand = false;
            this.executeNextCommand();
        }
    }

    _executeCustomCommand(nextCommandObj) {
        try {
            nextCommandObj.callback.call(this.scene);
            console.log(`[${this.scene.currentLevel}] Custom command ${nextCommandObj.command} executed.`);
        } catch (error) {
            console.error(`[${this.scene.currentLevel}] Error executing custom command:`, error);
        }
        this.isExecutingCommand = false;
        this.executeNextCommand();
    }

    queueAnimation(lines) {
        this.animationQueue = [...lines];
        console.log(`[${this.scene.currentLevel}] Animation queued. Queue length: ${lines.length}`);
        this.runNextAnimation();
    }

    runNextAnimation() {
        if (this.animationQueue.length === 0) {
            this.isExecutingCommand = false;
            console.log(`[${this.scene.currentLevel}] Animation sequence complete. Ready for next command.`);
            this.executeNextCommand();
            return;
        }

        const currentLine = this.animationQueue.shift();
        this.follower.t = 0;
        console.log(`[${this.scene.currentLevel}] Starting animation on line. Remaining queue length: ${this.animationQueue.length}`);

        this.scene.tweens.add({
            targets: this.follower,
            t: 1,
            ease: 'Sine.easeInOut',
            duration: 1200,
            onUpdate: () => {
                currentLine.getPoint(this.follower.t, this.follower.vec);
                console.log(`[${this.scene.currentLevel}] Follower moving. t=${this.follower.t.toFixed(2)}, x=${this.follower.vec.x.toFixed(2)}, y=${this.follower.vec.y.toFixed(2)}`);
            },
            onComplete: () => {
                currentLine.getPoint(1, this.follower.vec);
                console.log(`[${this.scene.currentLevel}] Animation complete for line. Follower at x=${this.follower.vec.x}, y=${this.follower.vec.y}`);
                this.runNextAnimation();
            }
        });
    }

    reset() { //Could be useful, Idk.
        this.commandQueue = [];
        this.animationQueue = [];
        this.isExecutingCommand = false;
        this.follower.t = 0;
        this.follower.vec.set(0, 0);
    }

    drawFollower(graphics) {
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(this.follower.vec.x, this.follower.vec.y, 16);
        console.log(`[${this.scene.currentLevel}] update: Follower at x=${this.follower.vec.x.toFixed(2)}, y=${this.follower.vec.y.toFixed(2)}`);
    }
}
