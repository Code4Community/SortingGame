export default class PathManager {
  constructor(scene) {
    this.scene = scene;
    this.lines = new Map(); //Stores phaser line objects with the count of times referenced
    this.currentPosition = { x: 400, y: 300 }; // Starting position
    this.startingPosition = { x: 400, y: 300 }; //Remember the starting position, TODO: Grab the one from Animation Executor!
    this.incrementalCommands = new Map(); //Store increment functions
    this.goalPositions = new Map(); //Store goal positions for each candy type
    this.currentCandy = null; //Track current candy being processed
    this.candyQueue = []; //Queue of candies to process
    this.onCandyComplete = null; //Callback for when candy reaches goal
    this.onCandyFailed = null; //Callback for when candy is in wrong position

    console.log(
      `[PathManager] Initialized. Starting Position: (${this.startingPosition.x}, ${this.startingPosition.y})`,
    );
  }

  addLine(name, start, end) {
    const startVec = new window.Phaser.Math.Vector2(start.x, start.y);
    const endVec = new window.Phaser.Math.Vector2(end.x, end.y);

    this.lines[name] = new window.Phaser.Curves.Line(startVec, endVec);
    console.log(
      `[PathManager] Created line: '${name}' from (${start.x}, ${start.y}) to (${end.x}, ${end.y})`,
    );
    return this.lines[name];
  }

  //Creates a new line that starts where another line ends, where "end" is the final destination point
  addLineFrom(fromLineName, newLineName, end) {
    const fromLine = this.lines[fromLineName];
    if (!fromLine) {
      console.error(
        `[PathManager] Cannot add line. Line '${fromLineName}' not found`,
      );
      throw new Error(`Line ${fromLineName} not found`);
    }
    var endPoint;
    if (fromLine.getPoint) {
      endPoint = this._getEndpointOfFromLine(fromLine);
    } else {
      console.error(
        `[PathManager] Cannot determine end point of line '${fromLineName}'.`,
      );
      throw new Error(`Cannot determine end point of line ${fromLineName}`);
    }

    console.log(
      `[PathManager] Adding line '${newLineName}' starting from end of '${fromLineName}' at (${endPoint.x}, ${endPoint.y})`,
    );
    return this.addLine(newLineName, endPoint, end);
  }

  _getEndpointOfFromLine(fromLine) {
    const endPointIndex = 1;
    const tempVec = new window.Phaser.Math.Vector2();
    fromLine.getPoint(endPointIndex, tempVec);
    return { x: tempVec.x, y: tempVec.y };
  }

  // Define incremental movement commands
  defineIncrementalCommand(commandName, incrementFunction) {
    this.incrementalCommands.set(commandName, incrementFunction);
    console.log(`[PathManager] Defined incremental command: '${commandName}'`);
  }

  // Execute an incremental command and return the new position
  executeIncrementalCommand(commandName) {
    const incrementFunction = this.incrementalCommands.get(commandName);
    if (incrementFunction) {
      const oldPosition = { ...this.currentPosition };
      const newPosition = incrementFunction(this.currentPosition);
      this.currentPosition = { ...newPosition };
      console.log(
        `[PathManager] Executed '${commandName}'. Position changed from (${oldPosition.x}, ${oldPosition.y}) to (${this.currentPosition.x}, ${this.currentPosition.y})`,
      );
      return this.currentPosition;
    }
    console.warn(
      `[PathManager] Incremental command '${commandName}' not found. Position remains:`,
      this.currentPosition,
    );
    return this.currentPosition;
  }

  getStartingPosition() {
    return { ...this.startingPosition };
  }

  getIncrementFunction(commandName) {
    return this.incrementalCommands.get(commandName);
  }

  setupCandyQueueAndGoalPositions(candies, goalPositions) {
    this.candyQueue = [...candies];
    this.goalPositions.clear();

    //Set up goal positions for each candy type
    Object.entries(goalPositions).forEach(([candyType, position]) => {
      this.goalPositions.set(candyType, position);
    });

    console.log(
      `[PathManager] Setup complete. ${candies.length} candies queued. ${this.goalPositions.size} goal positions defined.`,
    );
    console.log(
      `[PathManager] Goal positions:`,
      Object.fromEntries(this.goalPositions),
    );

    this.startNextCandy();
  }

  //Start processing the next candy
  startNextCandy() {
    if (this.candyQueue.length > 0) {
      this.currentCandy = this.candyQueue.shift();
      this.resetPosition();
      console.log(
        `[PathManager] Starting next candy: ${this.currentCandy.type}. Remaining in queue: ${this.candyQueue.length}`,
      );
      return true;
    } else {
      this.currentCandy = null;
      console.log(`[PathManager] All candies completed! Queue is empty.`);
      return false;
    }
  }

  //Reset position to starting point (called when starting new candy)
  resetPosition() {
    this.currentPosition = { ...this.startingPosition };
    console.log(
      `[PathManager] Position reset to starting position: (${this.startingPosition.x}, ${this.startingPosition.y})`,
    );
  }

  //Check if current candy is at its goal position
  checkCandyAtGoal() {
    if (!this.currentCandy) {
      console.warn(`[PathManager] No current candy to check.`);
      return false;
    }

    const goalPosition = this.goalPositions.get(this.currentCandy.type);
    // console.log(`[Path Manager] Goal Position for Candy ${this.currentCandy}`); // Original log removed/consolidated

    if (!goalPosition) {
      console.warn(
        `[PathManager] No goal position defined for candy type: ${this.currentCandy.type}`,
      );
      return false;
    }

    const tolerance = 50; // Allow some tolerance for position matching
    const distanceX = Math.abs(this.currentPosition.x - goalPosition.x);
    const distanceY = Math.abs(this.currentPosition.y - goalPosition.y);

    const isAtGoal = distanceX <= tolerance && distanceY <= tolerance;

    console.log(
      `[PathManager] Checking goal for ${this.currentCandy.type} (Tolerance: ${tolerance}). Current: (${this.currentPosition.x}, ${this.currentPosition.y}) | Goal: (${goalPosition.x}, ${goalPosition.y}). Match: ${isAtGoal}`,
    );

    return isAtGoal;
  }

  dumpCandy() {
    if (!this.currentCandy) {
      console.warn(`[PathManager] Dump failed: No current candy to dump.`);
      return { success: false, hasMoreCandies: this.candyQueue.length > 0 }; // Return consistent structure
    }

    console.log(
      `[PathManager] Attempting to dump candy: ${this.currentCandy.type}`,
    );
    const isAtGoal = this.checkCandyAtGoal();

    if (isAtGoal) {
      console.log(
        `[PathManager] Dump SUCCESS! Candy ${this.currentCandy.type} successfully delivered.`,
      );

      //Callback for successful delivery
      if (this.onCandyComplete) {
        console.log(`[PathManager] Calling onCandyComplete callback.`);
        this.onCandyComplete(this.currentCandy);
      }

      //Start next candy
      const hasMoreCandies = this.startNextCandy();
      return { success: true, hasMoreCandies };
    } else {
      console.log(
        `[PathManager] Dump FAILED! Candy ${this.currentCandy.type} is not at goal position.`,
      );
      //Callback for failed delivery
      if (this.onCandyFailed) {
        console.log(`[PathManager] Calling onCandyFailed callback.`);
        this.onCandyFailed(this.currentCandy, this.currentPosition);
      }

      // The failed candy remains the current candy until manually addressed, but we return the queue status.
      return { success: false, hasMoreCandies: this.candyQueue.length > 0 }; // Return current queue status
    }
  }

  /**
   * Validates if the candy's current position exists on any defined path.
   * @param {object} positionOfCandy - The {x, y} coordinates to validate.
   * @returns {boolean} - True if the candy is safely on a conveyer line.
   */
  checkCandyPositionOnLines(positionOfCandy) {
    const LINE_PROXIMITY_TOLERANCE = 2;
    const candyPoint = new window.Phaser.Math.Vector2(
      positionOfCandy.x,
      positionOfCandy.y,
    );

    // Convert lines object to array for iteration
    const linesList = Object.values(this.lines);

    const isOnPath = linesList.some((curve) => {
      const geomLine = new window.Phaser.Geom.Line(
        curve.p0.x,
        curve.p0.y,
        curve.p1.x,
        curve.p1.y,
      );
      // Find the projection factor t for the segment
      const dx = geomLine.x2 - geomLine.x1;
      const dy = geomLine.y2 - geomLine.y1;
      const lengthSq = dx * dx + dy * dy;
      let t = 0;
      if (lengthSq !== 0) {
        t =
          ((candyPoint.x - geomLine.x1) * dx +
            (candyPoint.y - geomLine.y1) * dy) /
          lengthSq;
      }
      // Clamp t to [0,1] to stay within the segment
      t = Math.max(0, Math.min(1, t));
      // Compute the clamped closest point
      const clampedX = geomLine.x1 + t * dx;
      const clampedY = geomLine.y1 + t * dy;
      const distanceToSegment = window.Phaser.Math.Distance.BetweenPoints(
        candyPoint,
        { x: clampedX, y: clampedY },
      );
      // Only consider the point on the path if the closest point is within the segment
      return distanceToSegment <= LINE_PROXIMITY_TOLERANCE;
    });

    if (!isOnPath) {
      this._logCandyOffPath(positionOfCandy);
    }

    return isOnPath;
  }

  _logCandyOffPath(pos) {
    alert(
      `[PathManager] Validation Failed: Candy at (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) is off the path.`,
    );
    console.error(
      `[PathManager] Validation Failed: Candy at (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) is off the path.`,
    );
  }

  getCurrentPosition() {
    return { ...this.currentPosition };
  }

  getStartingPosition() {
    return { ...this.startingPosition };
  }

  //Set position
  setCurrentPosition(position) {
    this.currentPosition = { ...position };
    console.log(
      `[PathManager] Position manually set to: (${this.currentPosition.x}, ${this.currentPosition.y})`,
    );
  }

  //Get current candy being processed
  getCurrentCandy() {
    return this.currentCandy;
  }

  //Get remaining candies in queue
  getRemainingCandies() {
    return [...this.candyQueue];
  }

  //Set callbacks for candy completion events.
  setCallbacks(onComplete, onFailed) {
    this.onCandyComplete = onComplete;
    this.onCandyFailed = onFailed;
    console.log("[PathManager] Candy completion callbacks set.");
  }

  drawAll(graphics) {
    Object.values(this.lines).forEach((line) => line.draw(graphics));
  }
}
