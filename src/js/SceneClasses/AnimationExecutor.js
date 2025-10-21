export default class AnimationExecutor {
    originalPosition = { x: 400, y: 300 };
    constructor(scene, pathManager) {
        this.scene = scene;
        this.pathManager = pathManager;
        this.commandQueue = [];
        this.isAnimating = false;
        this.followerPosition = { x: 400, y: 300 };
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
        this.followerPosition = { ...targetPosition };
        
        //Update the visual follower position
        this.scene.tweens.add({
            targets: this.followerPosition,
            x: targetPosition.x,
            y: targetPosition.y,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
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
        console.log(this.followerPosition)
        console.log("testing from reset")
    }
}
