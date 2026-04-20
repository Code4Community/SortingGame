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

    console.log(
      `[AnimationExecutor] Initialized. Speed: ${this.speedPxPerSec} px/sec.`,
    );
  }

  //Queue movement to a specific position
  //look into tweenManager.chain method
  //https://docs.phaser.io/phaser/concepts/tweens
  queueMovementToPosition(targetPosition) {
    this.commandQueue.push({
      type: "movement",
      targetPosition: { x: targetPosition.x, y: targetPosition.y }, // copy
    });
    console.log(
      `[AnimationExecutor] Queued movement to (${targetPosition.x}, ${targetPosition.y}). Queue size: ${this.commandQueue.length}`,
    );
  }

  queueCandyDump() {
    this.commandQueue.push({
      type: "dumpCandy",
    });
    console.log(
      `[AnimationExecutor] Queued dumpCandy. Queue size: ${this.commandQueue.length}`,
    );
  }

  queueCustomCommand(action) {
    this.commandQueue.push({
      type: "custom",
      action: action,
    });
    console.log(
      `[AnimationExecutor] Queued custom command. Queue size: ${this.commandQueue.length}`,
    );
  }

  // Execute the next command in the queue
  executeNextCommand() {
    if (this.commandQueue.length === 0) {
      console.log("[AnimationExecutor] No more commands to execute.");
      return;
    }

    if (this.isAnimating) {
      console.log(
        "[AnimationExecutor] Animation in progress, skipping execution attempt.",
      );
      return;
    }

    const command = this.commandQueue.shift();
    console.log(
      `[AnimationExecutor] Executing command: ${command.type}. Remaining: ${this.commandQueue.length}`,
    );
    console.log(`[AnimationExecutor] Remaining Queue: ${this.commandQueue}`);

    switch (command.type) {
      case "movement":
        this.animateToPosition(command.targetPosition);
        break;
      case "dumpCandy":
        this.handleCandyDump();
        break;
      case "custom":
        console.log("[AnimationExecutor] Executing custom action.");
        command.action();
        // custom commands are immediate; report completion by calling the onDumpComplete handler conventionally
        if (this.onDumpComplete) {
          this.onDumpComplete({ success: true, custom: true });
          console.log(
            "[AnimationExecutor] Custom command complete. Notified QueueManager.",
          );
        }
        break;
      default:
        console.warn(
          `[AnimationExecutor] Unknown command type: ${command.type}. Skipping.`,
        );
    }
  }

  //Animate to a specific position
  animateToPosition(targetPosition) {
    this.isAnimating = true;

    const start = { x: this.followerPosition.x, y: this.followerPosition.y };
    const end = { x: targetPosition.x, y: targetPosition.y };
    console.log(
      `[AnimationExecutor] Starting movement animation from (${start.x}, ${start.y}) to (${end.x}, ${end.y})`,
    );

    this.animateAlongInvisibleLine(start, end);
  }

  animateAlongInvisibleLine(start, end) {
    const line = new window.Phaser.Curves.Line(
      new window.Phaser.Math.Vector2(start.x, start.y),
      new window.Phaser.Math.Vector2(end.x, end.y),
    );

    const distance = window.Phaser.Math.Distance.Between(
      start.x,
      start.y,
      end.x,
      end.y,
    );
    const duration = Math.max(1, (distance / this.speedPxPerSec) * 1000);
    console.log(
      `[AnimationExecutor] Movement distance: ${distance.toFixed(2)}px, Duration: ${duration.toFixed(0)}ms`,
    );

    const t = { value: 0 };
    const temp = new window.Phaser.Math.Vector2();
    // Store reference to the current tween so we can stop it later
    if (this.currentTween && this.currentTween.isPlaying()) {
      this.currentTween.stop();
    }
    this.currentTween = this.scene.tweens.add({
      targets: t,
      value: 1,
      duration,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        line.getPoint(t.value, temp);
        this.followerPosition.x = temp.x;
        this.followerPosition.y = temp.y;
      },
      onComplete: () => {
        if (this.isAnimating) {
          this.followerPosition.x = end.x;
          this.followerPosition.y = end.y;
          this.isAnimating = false;
          this.currentTween = null;
          console.log(
            `[AnimationExecutor] Animation complete. Final position set to (${end.x}, ${end.y}).`,
          );
          // notify the QueueManager (if set) instead of auto-driving next
          if (typeof this.onMovementComplete === "function") {
            console.log(
              "[AnimationExecutor] Calling onMovementComplete callback.",
            );
            this.onMovementComplete({ x: end.x, y: end.y });
          } else {
            console.warn(
              "[AnimationExecutor] onMovementComplete callback missing. Auto-executing next command.",
            );
            this.executeNextCommand();
          }
        }
      },
    });
  }

  handleCandyDump() {
    console.log(`[AnimationExecutor] Executing dumpCandy via PathManager.`);
    const result = this.pathManager.dumpCandy();

    if (result && result.success) {
      console.log(
        "[AnimationExecutor] Candy successfully dumped! Result:",
        result,
      );
    } else {
      console.log("[AnimationExecutor] Candy dump failed! Result:", result);
    }

    // notify queue manager instead of executing next here
    if (typeof this.onDumpComplete === "function") {
      console.log("[AnimationExecutor] Calling onDumpComplete callback.");
      this.onDumpComplete(result);
    } else {
      console.warn("[AnimationExecutor] onDumpComplete callback missing.");
    }
  }

  createFollowerSprite(candyType) {
    if (this.follower) return;

    this.follower = this.scene.add.image(
      this.followerPosition.x,
      this.followerPosition.y,
      candyType,
    );

    this.follower.setDisplaySize(64, 64); // normalize size
    console.log("CREATING FOLLOWER SPRITE");
  }

  // drawFollower(graphics) {
  //     const currentCandy = this.pathManager.getCurrentCandy();
  //     const candyType = currentCandy ? currentCandy.type : "default";

  //     let color = 0xff0000; // Default red
  //     if (candyType.includes("blue")) color = 0x0000ff;
  //     else if (candyType.includes("green")) color = 0x00ff00;
  //     else if (candyType.includes("red")) color = 0xff0000;

  //     graphics.fillStyle(color);
  //     graphics.fillCircle(this.followerPosition.x, this.followerPosition.y, 20);
  //   }
  drawFollower(graphics) {
    const currentCandy = this.pathManager.getCurrentCandy();
    if (!currentCandy) return;

    const candyType = currentCandy.path;

    // Create follower sprite once
    if (!this.follower) {
      this.createFollowerSprite(candyType);
      return;
    }

    // Update texture if candy changed
    if (this.follower.texture.key !== candyType) {
      this.follower.setTexture(candyType);
    }

    // Update follower position each frame
    this.follower.x = this.followerPosition.x;
    this.follower.y = this.followerPosition.y;
    console.log(
      "Rendered size:",
      this.follower.displayWidth,
      this.follower.displayHeight,
      "Scale:",
      this.follower.scaleX,
      this.follower.scaleY,
    );
  }

  stopAll() {
    // Stop and remove the current tween if it exists
    if (this.currentTween) {
      this.currentTween.remove();
      this.currentTween = null;
      console.log("[AnimationExecutor] Current tween removed.");
    }
    // Also kill all tweens in the scene for safety
    if (this.scene && this.scene.tweens) {
      this.scene.tweens.killAll();
      console.log("[AnimationExecutor] All tweens killed");
    }
    this.commandQueue = [];
    this.isAnimating = false;
    // This fixes sizing issues when resetting between candies,
    // but may cause a brief flash if the follower is visible during reset.
    // A more complex solution would be to hide the follower during reset
    // and show it again after repositioning.
    if (this.follower) {
      this.follower.destroy();
      this.follower = null;
    }
    const pos = this.pathManager.getCurrentPosition();
    this.followerPosition = { x: pos.x, y: pos.y };
  }

  reset() {
    console.log("[AnimationExecutor] Resetting.");
    this.stopAll();
    console.log(
      `[AnimationExecutor] Reset complete. Follower position synced to PathManager at (${this.followerPosition.x}, ${this.followerPosition.y}). Queue cleared.`,
    );
  }
}
