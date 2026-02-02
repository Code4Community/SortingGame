export default class QueueManager {
  constructor(pathManager, animationExecutor) {
    this.pathManager = pathManager;
    this.animationExecutor = animationExecutor;
    this.queue = [];
    // plannedPosition represents the logical position after queued-but-not-yet-animated moves
    this.plannedPosition = this.pathManager.getCurrentPosition();
    console.log(
      "[QueueManager] Initialized. Planned position:",
      this.plannedPosition,
    );
    // wire animation callbacks
    this.animationExecutor.onMovementComplete = (pos) =>
      this._onMovementComplete(pos);
    this.animationExecutor.onDumpComplete = (result) =>
      this._onDumpComplete(result);
  }

  reset() {
    this.queue = [];
    this.plannedPosition = this.pathManager.getCurrentPosition();
    console.log(
      "[QueueManager] Reset. Planned position:",
      this.plannedPosition,
    );
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
    this.queue.push({
      type: "movement",
      targetPosition: { x: newPos.x, y: newPos.y },
      commandName,
    });
    console.log(
      `[QueueManager] Scheduled movement '${commandName}' -> (${newPos.x}, ${newPos.y}). New Queue size: ${this.queue.length}`,
    ); // MODIFIED/ADDED
  }

  scheduleDumpCandy() {
    this.queue.push({ type: "dumpCandy" });
    // assume dumpCandy will cause PathManager to start next candy (reset to startingPosition)
    // update plannedPosition now so subsequent scheduled moves target the next candy's coordinates
    if (typeof this.pathManager.getStartingPosition === "function") {
      this.plannedPosition = this.pathManager.getStartingPosition();
    } else {
      this.plannedPosition = this.pathManager.getCurrentPosition();
    }
    console.log(
      `[QueueManager] Scheduled dumpCandy. New Queue size: ${this.queue.length}. Planned position reset to:`,
      this.plannedPosition,
    );
  }

  scheduleCustom(action) {
    this.queue.push({ type: "custom", action });
    console.log(
      `[QueueManager] Scheduled custom action. New Queue size: ${this.queue.length}`,
    );
  }

  // Start executing the queued commands (called after interpreter finishes queuing)
  startExecution() {
    console.log(
      `[QueueManager] Starting execution of ${this.queue.length} commands.`,
    );
    // reset plannedPosition to current actual position to avoid drift if needed
    this.plannedPosition = this.pathManager.getCurrentPosition();
    console.log(
      `[QueueManager] Remaining Queue: ${JSON.stringify(this.queue, null, 2)}`,
    );
    this._executeNext();
  }

  _executeNext() {
    if (this.queue.length === 0) {
      console.log("[QueueManager] Queue empty. Execution finished.");
      return;
    }
    const cmd = this.queue.shift();
    console.log(
      `[QueueManager] Executing next command: ${cmd.type}. Remaining in queue: ${this.queue.length}`,
    );
    switch (cmd.type) {
      case "movement":
        console.log(
          `[QueueManager] Executing movement to (${cmd.targetPosition.x}, ${cmd.targetPosition.y})`,
        );
        // ensure visual follower is aligned to PathManager before starting a new movement
        if (this.pathManager && this.animationExecutor) {
          const pos = this.pathManager.getCurrentPosition();
          this.animationExecutor.followerPosition = { x: pos.x, y: pos.y };
        }
        // queue movement on animationExecutor (copy)
        this.animationExecutor.queueMovementToPosition({
          x: cmd.targetPosition.x,
          y: cmd.targetPosition.y,
        });
        // trigger executor to start (it will call back to us on complete)
        this.animationExecutor.executeNextCommand();
        break;
      case "dumpCandy":
        console.log("[QueueManager] Executing dumpCandy");
        this.animationExecutor.queueCandyDump();
        this.animationExecutor.executeNextCommand();
        break;
      case "custom":
        console.log("[QueueManager] Executing custom command");
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
    console.log(
      `[QueueManager] Movement complete. Final position: (${finalPos.x}, ${finalPos.y})`,
    );
    // commit the logical position to PathManager now that the animation finished
    this.pathManager.setCurrentPosition({ x: finalPos.x, y: finalPos.y });
    // sync plannedPosition to actual
    this.plannedPosition = this.pathManager.getCurrentPosition();
    console.log(
      "[QueueManager] PathManager position updated. Continuing execution.",
    );
    // continue with next queued op
    this._executeNext();
  }

  // Called by AnimationExecutor when dumpCandy finishes (result from PathManager.dumpCandy)
  _onDumpComplete(result) {
    console.log(
      `[QueueManager] Dump complete. Result: ${JSON.stringify(result)}`,
    );
    // dumpCandy already updated PathManager when called; ensure plannedPosition follows it
    this.plannedPosition = this.pathManager.getCurrentPosition();
    // sync visual follower to the new PathManager position (important for next candy)
    if (this.animationExecutor) {
      const pos = this.pathManager.getCurrentPosition();
      this.animationExecutor.followerPosition = { x: pos.x, y: pos.y };
      console.log(
        `[QueueManager] Synced animation follower to PathManager position: (${pos.x}, ${pos.y})`,
      );
    }
    // continue execution
    console.log("[QueueManager] Continuing execution after dump.");
    this._executeNext();
  }
}
