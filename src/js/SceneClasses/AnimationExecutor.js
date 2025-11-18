export default class AnimationExecutor {
    originalPosition = { x: 400, y: 300 };
    constructor(scene, pathManager) {
        this.scene = scene;
        this.pathManager = pathManager;
        this.commandQueue = [];
        this.isAnimating = false;
        this.followerPosition = { x: 400, y: 300 };
        this.speedPxPerSec = 300;
    }

    //Queue movement to a specific position
    queueMovementToPosition(targetPosition) {
        this.commandQueue.push({
            type: 'movement',
            targetPosition: targetPosition
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
                this.executeNextCommand();
                break;
            default:
                console.warn(`[AnimationExecutor] Unknown command type: ${command.type}`);
                this.executeNextCommand();
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
                this.executeNextCommand();
            }
        });
    }


    handleCandyDump() {
        const result = this.pathManager.dumpCandy();
        
        if (result.success) {
            console.log("[AnimationExecutor] Candy successfully dumped!");
            if (result.hasMoreCandies) {
                //Reset follower position for next candy!!
                this.followerPosition = this.pathManager.getCurrentPosition();
                this.executeNextCommand();
            } else {
                console.log("[AnimationExecutor] All candies completed!");
            }
        } else {
            console.log("[AnimationExecutor] Candy dump failed!");
            this.executeNextCommand();
        }
    }

    drawFollower(graphics) {
        const currentCandy = this.pathManager.getCurrentCandy();
        const candyType = currentCandy ? currentCandy.type : 'default';
        
        //TODO: Implement loading the sprites. 
            //RN, we just draw follower as a colored circle
            //The code below is to demonstrate how we could switch the candy view

            // TODO: Make sure the same candy doesn't show up after success
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
        this.followerPosition = this.originalPosition
        // console.log(this.followerPosition)
        // console.log("testing from reset")
    }
}
