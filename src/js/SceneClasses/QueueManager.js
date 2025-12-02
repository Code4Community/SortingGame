export default class QueueManager {
    constructor(pathManager, animationExecutor) {
        this.pathManager = pathManager;
        this.animationExecutor = animationExecutor;
        this.queue = [];
        // plannedPosition represents the logical position after queued-but-not-yet-animated moves
        this.plannedPosition = this.pathManager.getCurrentPosition();
        // wire animation callbacks
        this.animationExecutor.onMovementComplete = (pos) => this._onMovementComplete(pos);
        this.animationExecutor.onDumpComplete = (result) => this._onDumpComplete(result);
    }

    // schedule an incremental command by name (does not mutate PathManager)
    scheduleIncremental(commandName) {
        const inc = this.pathManager.getIncrementFunction(commandName);
        if (!inc) {
            console.warn(`[QueueManager] No increment function for '${commandName}'`);
            return;
        }
        const newPos = inc(this.plannedPosition);
        this.plannedPosition = { x: newPos.x, y: newPos.y };
        this.queue.push({ type: 'movement', targetPosition: { x: newPos.x, y: newPos.y }, commandName });
        console.log(`[QueueManager] Scheduled movement '${commandName}' -> (${newPos.x}, ${newPos.y})`);
    }

    scheduleDumpCandy() {
        this.queue.push({ type: 'dumpCandy' });
        console.log("[QueueManager] Scheduled dumpCandy");
    }

    scheduleCustom(action) {
        this.queue.push({ type: 'custom', action });
    }

    // Start executing the queued commands (called after interpreter finishes queuing)
    startExecution() {
        // reset plannedPosition to current actual position to avoid drift if needed
        this.plannedPosition = this.pathManager.getCurrentPosition();
        this._executeNext();
    }

    _executeNext() {
        if (this.queue.length === 0) {
            console.log("[QueueManager] Queue empty.");
            return;
        }
        const cmd = this.queue.shift();
        switch (cmd.type) {
            case 'movement':
                // queue movement on animationExecutor (copy)
                this.animationExecutor.queueMovementToPosition({ x: cmd.targetPosition.x, y: cmd.targetPosition.y });
                // trigger executor to start (it will call back to us on complete)
                this.animationExecutor.executeNextCommand();
                break;
            case 'dumpCandy':
                this.animationExecutor.queueCandyDump();
                this.animationExecutor.executeNextCommand();
                break;
            case 'custom':
                this.animationExecutor.queueCustomCommand(cmd.action);
                this.animationExecutor.executeNextCommand();
                break;
            default:
                console.warn("[QueueManager] Unknown cmd type:", cmd.type);
                this._executeNext();
        }
    }

    // Called by AnimationExecutor when a movement animation finishes
    _onMovementComplete(finalPos) {
        // commit the logical position to PathManager now that the animation finished
        this.pathManager.setCurrentPosition({ x: finalPos.x, y: finalPos.y });
        // sync plannedPosition to actual
        this.plannedPosition = this.pathManager.getCurrentPosition();
        // continue with next queued op
        this._executeNext();
    }

    // Called by AnimationExecutor when dumpCandy finishes (result from PathManager.dumpCandy)
    _onDumpComplete(result) {
        // dumpCandy already updated PathManager when called; ensure plannedPosition follows it
        this.plannedPosition = this.pathManager.getCurrentPosition();
        // If dumpCandy started next candy it will have reset PathManager position; keep that.
        this._executeNext();
    }
}