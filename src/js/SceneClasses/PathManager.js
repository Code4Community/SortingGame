export default class PathManager {
    constructor(scene) {
        this.scene = scene;
        this.lines = new Map(); //Stores phaser line objects with the count of times referenced
        this.paths = new Map(); //Stores our paths with a count value attached to it
        this.currentPosition = { x: 400, y: 300 }; // Starting position
        this.startingPosition = { x: 400, y: 300 }; //Remember the starting position, TODO: Grab the one frorm Animation Executor!
        this.incrementalCommands = new Map(); //Store increment functions
        this.goalPositions = new Map(); //Store goal positions for each candy type
        this.currentCandy = null; //Track current candy being processed
        this.candyQueue = []; //Queue of candies to process
        this.onCandyComplete = null; //Callback for when candy reaches goal
        this.onCandyFailed = null; //Callback for when candy is in wrong position
    }

    addLine(name, start, end) {
        console.log('Start object:', start);
        console.log('Start.x:', start.x);

        const startVec = new window.Phaser.Math.Vector2(start.x, start.y);
        const endVec = new window.Phaser.Math.Vector2(end.x, end.y);

        this.lines[name] = new window.Phaser.Curves.Line(startVec, endVec);
        console.log('Created line:', name, this.lines[name]);
        return this.lines[name];
    }

    //Creates a new line that starts where another line ends, where "end" is the final destination point
    addLineFrom(fromLineName, newLineName, end) {
        const fromLine = this.lines[fromLineName];
        if (!fromLine) throw new Error(`Line ${fromLineName} not found`);

        console.log('fromLine:', fromLine);

        var endPoint;
        if (fromLine.getPoint) {
            endPoint = this._getEndpointOfFromLine(fromLine);
        } else {
            throw new Error(`Cannot determine end point of line ${fromLineName}`);
        }

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
    }

    // Execute an incremental command and return the new position
    executeIncrementalCommand(commandName) {
        const incrementFunction = this.incrementalCommands.get(commandName);
        if (incrementFunction) {
            const newPosition = incrementFunction(this.currentPosition);
            this.currentPosition = { ...newPosition };
            console.log(`[PathManager] Executed '${commandName}', new position:`, this.currentPosition);
            return this.currentPosition;
        }
        console.warn(`[PathManager] Incremental command '${commandName}' not found`);
        return this.currentPosition;
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
        
        this.startNextCandy();
    }

    //Start processing the next candy
    startNextCandy() {
        if (this.candyQueue.length > 0) {
            this.currentCandy = this.candyQueue.shift();
            this.resetPosition();
            console.log(`[PathManager] Starting candy: ${this.currentCandy.type}`, this.currentCandy);
            return true;
        } else {
            this.currentCandy = null;
            console.log(`[PathManager] All candies completed!`);
            return false;
        }
    }

    //Reset position to starting point (called when starting new candy)
    resetPosition() {
        this.currentPosition = { ...this.startingPosition };
        console.log(`[PathManager] Position reset to starting position:`, this.startingPosition);
    }

    //Check if current candy is at its goal position
    checkCandyAtGoal() {
        if (!this.currentCandy) {
            console.warn(`[PathManager] No current candy to check`);
            return false;
        }

        const goalPosition = this.goalPositions.get(this.currentCandy.type);
        console.log(`[Path Manager] Goal Position for Candy ${this.currentCandy}`);
        if (!goalPosition) {
            console.warn(`[PathManager] No goal position defined for candy type: ${this.currentCandy.type}`);
            return false;
        }

        const tolerance = 50; // Allow some tolerance for position matching
        const distanceX = Math.abs(this.currentPosition.x - goalPosition.x);
        const distanceY = Math.abs(this.currentPosition.y - goalPosition.y);
        
        const isAtGoal = distanceX <= tolerance && distanceY <= tolerance;
        
        console.log(`[PathManager] Checking if candy ${this.currentCandy.type} is at goal:`, {
            currentPosition: this.currentPosition,
            goalPosition: goalPosition,
            isAtGoal: isAtGoal
        });

        return isAtGoal;
    }

    dumpCandy() {
        if (!this.currentCandy) {
            console.warn(`[PathManager] No current candy to dump`);
            return false;
        }

        const isAtGoal = this.checkCandyAtGoal();
        
        if (isAtGoal) {
            console.log(`[PathManager] Candy ${this.currentCandy.type} successfully delivered!`);
            
            //Callback for successful delivery
            if (this.onCandyComplete) {
                this.onCandyComplete(this.currentCandy);
            }
            
            //Start next candy
            const hasMoreCandies = this.startNextCandy();
            return { success: true, hasMoreCandies };
            
        } else {
            console.log(`[PathManager] Candy ${this.currentCandy.type} is not at correct position!`);
            //Callback for failed delivery
            if (this.onCandyFailed) {
                this.onCandyFailed(this.currentCandy, this.currentPosition);
            }
            
            return { success: false, hasMoreCandies: true };
        }
    }

    /* Getters and Setters */
    //Get current position
    getCurrentPosition() {
        return { ...this.currentPosition };
    }

    //Set position
    setCurrentPosition(position) {
        this.currentPosition = { ...position };
        console.log(`[PathManager] Position manually set to:`, this.currentPosition);
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
    }

    drawAll(graphics) {
        Object.values(this.lines).forEach(line => line.draw(graphics));
    }
}
