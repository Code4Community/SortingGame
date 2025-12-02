// ...existing code...
export default class AnimationExecutor {
    constructor(scene, pathManager) {
        this.scene = scene;
        this.pathManager = pathManager;
        this.commandQueue = [];
        this.isAnimating = false;
        this.followerPosition = { x: 400, y: 300 };
        this.speedPxPerSec = 300;

        // Callbacks set by QueueManager
        this.onMovementComplete = null;
        this.onDumpComplete = null;
    }

    //Queue movement to a specific position
    queueMovementToPosition(targetPosition) {
        this.commandQueue.push({
            type: 'movement',
            targetPosition: { x: targetPosition.x, y: targetPosition.y } // copy
        });
    }

    queueCandyDump() {
        this.commandQueue.push({
            type: 'dumpCandy'
        });
    }

    queueCustomCommand(action) {
        this.commandQueue.push({
            type: 'custom',
            action: action
        });
    }

    // Execute the next command in the queue
    executeNextCommand() {
        if (this.commandQueue.length === 0) {
            console.log("[AnimationExecutor] No more commands to execute.");
            return;
        }

        if (this.isAnimating) {
            console.log("[AnimationExecutor] Animation in progress, waiting...");
            return;
        }

        const command = this.commandQueue.shift();
        
        switch (command.type) {
            case 'movement':
                this.animateToPosition(command.targetPosition);
                break;
            case 'dumpCandy':
                this.handleCandyDump();
                break;
            case 'custom':
                command.action();
                // custom commands are immediate; report completion by calling the onDumpComplete handler conventionally
                if (this.onDumpComplete) this.onDumpComplete({ success: true });
                break;
            default:
                console.warn(`[AnimationExecutor] Unknown command type: ${command.type}`);
        }
    }

    //Animate to a specific position
    animateToPosition(targetPosition) {
        this.isAnimating = true;

        const start = { x: this.followerPosition.x, y: this.followerPosition.y };
        const end = { x: targetPosition.x, y: targetPosition.y };

        this.animateAlongInvisibleLine(start, end);
    }

    animateAlongInvisibleLine(start, end) {
        const line = new window.Phaser.Curves.Line(
            new window.Phaser.Math.Vector2(start.x, start.y),
            new window.Phaser.Math.Vector2(end.x, end.y)
        );

        const distance = window.Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
        const duration = Math.max(1, (distance / this.speedPxPerSec) * 1000);

        const t = { value: 0 };
        const temp = new window.Phaser.Math.Vector2();
        this.scene.tweens.add({
            targets: t,
            value: 1,
            duration,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                line.getPoint(t.value, temp);
                this.followerPosition.x = temp.x;
                this.followerPosition.y = temp.y;
            },
            onComplete: () => {
                this.followerPosition.x = end.x;
                this.followerPosition.y = end.y;
                this.isAnimating = false;
                // notify the QueueManager (if set) instead of auto-driving next
                if (typeof this.onMovementComplete === 'function') {
                    this.onMovementComplete({ x: end.x, y: end.y });
                } else {
                    this.executeNextCommand();
                }
            }
        });
    }


    handleCandyDump() {
        const result = this.pathManager.dumpCandy();
        
        if (result && result.success) {
            console.log("[AnimationExecutor] Candy successfully dumped!");
        } else {
            console.log("[AnimationExecutor] Candy dump failed!");
        }

        // notify queue manager instead of executing next here
        if (typeof this.onDumpComplete === 'function') {
            this.onDumpComplete(result);
        }
    }

    drawFollower(graphics) {
        const currentCandy = this.pathManager.getCurrentCandy();
        const candyType = currentCandy ? currentCandy.type : 'default';
        
        let color = 0xff0000; // Default red
        if (candyType.includes('blue')) color = 0x0000ff;
        else if (candyType.includes('green')) color = 0x00ff00;
        else if (candyType.includes('red')) color = 0xff0000;
        
        graphics.fillStyle(color);
        graphics.fillCircle(this.followerPosition.x, this.followerPosition.y, 20);
    }

    reset() {
        this.commandQueue = [];
        this.isAnimating = false;
        const pos = this.pathManager.getCurrentPosition();
        this.followerPosition = { x: pos.x, y: pos.y };
    }
}