import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";
import CommandManager from "./SceneClasses/CommandManager.js";
import QueueManager from "./SceneClasses/QueueManager.js";
import LevelHelper from "./SceneClasses/LevelHelper.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  graphics;
  pathManager;
  animationExecutor;
  commandManager;
  levelHelper;
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
    this.pathManager.addLineFrom("center", "right", { x: 600, y: 400 });
    this.pathManager.addLineFrom("center", "down", { x: 400, y: 500 });
    this.pathManager.addLineFrom("center", "right", { x: 600, y: 400 });
    this.pathManager.addLineFrom("center", "down", { x: 400, y: 500 });
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
    const candies = [
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.RED, Shapes.SQUARE, Patterns.PLAIN),
      new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.PLAIN),
    ];

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
    this.levelHelper.onCandyFailed(this, candy, position);
  }

  defineInterpreterCommands() {
    LevelHelper.defineInterpreterCommands(this.commandManager, {
      immediate: {
        sampleCommand: () => {
          console.log(
            "This is an example custom command, should run immediately",
          );
        },
        isBlue: () => this.pathManager.getCurrentCandy()?.color === Colors.BLUE,
        isRed: () => this.pathManager.getCurrentCandy()?.color === Colors.RED,
        isGreen: () => this.pathManager.getCurrentCandy()?.color === Colors.GREEN,
        isCircle: () => this.pathManager.getCurrentCandy()?.shape == Shapes.CIRCLE,
        isSquare: () => this.pathManager.getCurrentCandy()?.shape == Shapes.SQUARE,
        isTriangle: () => this.pathManager.getCurrentCandy()?.shape == Shapes.TRIANGLE,
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
    this.levelHelper.initializeRunCodeButton(this);
  }
  // Add a button to reset the level completely
  initializeResetButton() {
    this.levelHelper.initializeResetButton(this);
  }

  resetLevel() {
    this.levelHelper.resetLevel();
  }

  create() {
    this.initializeEditorWindow();
    this.initializeBackgroundGraphics();
    this.pathManager = new PathManager(this);
    this.animationExecutor = new AnimationExecutor(this, this.pathManager);
    this.queueManager = new QueueManager(
      this.pathManager,
      this.animationExecutor,
      null, // levelHelper will be set later
    );

    this.commandManager = new CommandManager(
      this,
      this.pathManager,
      this.animationExecutor,
      this.queueManager,
    );
    this.levelHelper = new LevelHelper(
      this.setupLevelCandies,
      this.animationExecutor,
      this.queueManager,
    );

    // Inject dependency
    this.queueManager.levelHelper = this.levelHelper;
    console.log(this.levelHelper);

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
