import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";
import CommandManager from "./SceneClasses/CommandManager.js";
import QueueManager from "./SceneClasses/QueueManager.js";
import LevelHelper from "./SceneClasses/LevelHelper.js";

export default class Level1 extends Phaser.Scene {
  graphics;
  pathManager;
  animationExecutor;
  commandManager;
  currentLevel = "Level1";

  preload() {
    this.load.image("background", "assets/background.png");
    console.log(`[${this.currentLevel}] Preloading background image.`);
  }

  initializeEditorWindow() {
    LevelHelper.initializeEditorWindow(
      this,
      "moveDown\nmoveLeft\nmoveLeft\ndumpCandy\nmoveDown\nmoveRight\nmoveRight\ndumpCandy\nmoveDown\nmoveDown\ndumpCandy",
    );
  }

  initializeBackgroundGraphics() {
    this.add.image(400, 300, "background");
    console.log(`[${this.currentLevel}] Background image added.`);

    this.graphics = this.add.graphics();
    console.log(`[${this.currentLevel}] Graphics object created.`);
  }

  createLinesForConveyerBelt() {
    this.pathManager.addLine("center", { x: 400, y: 100 }, { x: 400, y: 400 });
    this.pathManager.addLineFrom("center", "left", { x: 200, y: 400 });
    this.pathManager.addLineFrom('center', 'right', { x: 600, y: 400 });
    this.pathManager.addLineFrom('center', 'down', { x: 400, y: 500 });
  }

  createIncrementalCommands() {
    LevelHelper.createIncrementalCommands(this.pathManager, {
      moveLeft: (currentPos) => ({ x: currentPos.x - 100, y: currentPos.y }),
      moveRight: (currentPos) => ({ x: currentPos.x + 100, y: currentPos.y }),
      moveUp: (currentPos) => ({ x: currentPos.x, y: currentPos.y - 100 }),
      moveDown: (currentPos) => ({ x: currentPos.x, y: currentPos.y + 100 }),
    });
  }

  setupLevelCandies() {
    //Define the candies for this level
    //TODO: Adjust this to use the Candy class!
    const candies = [
      { type: "blue-circle", id: 1 },
      { type: "red-square", id: 2 },
      { type: "green-triangle", id: 3 },
    ];

    //Define goal positions for each candy type. Again, adjust to using the Candy class
    const goalPositions = {
      "blue-circle": { x: 200, y: 400 }, // Left bin
      "red-square": { x: 600, y: 400 }, // Right bin
      "green-triangle": { x: 400, y: 500 }, // Bottom bin
    };

    // Set up callbacks for candy completion
    this.pathManager.setCallbacks(
      (candy) => this.onCandySuccess(candy),
      (candy, position) => this.onCandyFailed(candy, position),
    );

    this.pathManager.setupCandyQueueAndGoalPositions(candies, goalPositions);
  }

  //Having these two methods below in Level1.js is fine for now- to be discussed if we just
  //want the same behavior for each case anyways, if so we can just export it to CommandManager
  onCandySuccess(candy) {
    LevelHelper.onCandySuccess(this, candy);
  }

  onCandyFailed(candy, position) {
    LevelHelper.onCandyFailed(this, candy, position);
  }

  defineInterpreterCommands() {
    LevelHelper.defineInterpreterCommands(this.commandManager, {
      immediate: {
        sampleCommand: () => {
          console.log(
            "This is an example custom command, should run immediately",
          );
        },
      },
      queued: {
        queuedCommand: () => {
          console.log(
            "This is an example custom command that is queued according to animation, should run in animation sequence",
          );
        },
      },
    });
  }

  initializeRunCodeButton() {
    LevelHelper.initializeRunCodeButton(
      this,
      this.setupLevelCandies.bind(this),
      this.animationExecutor,
      this.queueManager,
    );
  }
  // Add a button to reset the level completely
  initializeResetButton() {
    LevelHelper.initializeResetButton(
      this,
      this.setupLevelCandies.bind(this),
      this.animationExecutor,
      this.queueManager,
    );
  }

  resetLevel() {
    LevelHelper.resetLevel(
      this,
      this.setupLevelCandies.bind(this),
      this.animationExecutor,
      this.queueManager,
    );
  }

  create() {
    this.initializeEditorWindow();
    this.initializeBackgroundGraphics();
    this.pathManager = new PathManager(this);
    this.animationExecutor = new AnimationExecutor(this, this.pathManager);
    this.queueManager = new QueueManager(
      this.pathManager,
      this.animationExecutor,
    );
    this.commandManager = new CommandManager(
      this,
      this.pathManager,
      this.animationExecutor,
      this.queueManager,
    );

    //Set up the level
    this.createLinesForConveyerBelt();
    this.createIncrementalCommands();
    this.setupLevelCandies();
    this.defineInterpreterCommands();
    this.initializeRunCodeButton();
    this.initializeResetButton();
  }

  update() {
    this.graphics.clear();
    this.graphics.lineStyle(4, 0xffffff, 1);

    this.pathManager.drawAll(this.graphics);
    this.animationExecutor.drawFollower(this.graphics);
  }
}
