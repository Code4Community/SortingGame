import PathManager from "./PathManager.js";
import AnimationExecutor from "./AnimationExecutor.js";
import CommandManager from "./CommandManager.js";
import QueueManager from "./QueueManager.js";
import LevelHelper from "./LevelHelper.js";

export default class LevelScene extends Phaser.Scene {
  constructor(levelName, initialProgram = "") {
    super({ key: levelName });
    this.currentLevel = levelName;
    this.initialProgram = initialProgram;
  }

  graphics;
  pathManager;
  animationExecutor;
  commandManager;
  queueManager;
  levelHelper;
  currentLevel;
  initialProgram;

  preload() {
    this.load.image("background", "assets/background.png");
    console.log(`[${this.currentLevel}] Preloading background image.`);
  }

  initializeBackgroundGraphics() {
    this.add.image(400, 300, "background");
    console.log(`[${this.currentLevel}] Background image added.`);

    this.graphics = this.add.graphics();
    console.log(`[${this.currentLevel}] Graphics object created.`);
  }

  createIncrementalCommands() {
    LevelHelper.createIncrementalCommands(this.pathManager, {
      moveLeft: (currentPos) => ({ x: currentPos.x - 100, y: currentPos.y }),
      moveRight: (currentPos) => ({ x: currentPos.x + 100, y: currentPos.y }),
      moveUp: (currentPos) => ({ x: currentPos.x, y: currentPos.y - 100 }),
      moveDown: (currentPos) => ({ x: currentPos.x, y: currentPos.y + 100 }),
    });
  }

  setupCandyQueue(candies, goalPositions) {
    this.pathManager.setCallbacks(
      (candy) => this.onCandySuccess(candy),
      (candy, position) => this.onCandyFailed(candy, position),
    );
    this.pathManager.setupCandyQueueAndGoalPositions(candies, goalPositions);
  }

  onCandySuccess(candy) {
    LevelHelper.onCandySuccess(this, candy);
  }

  onCandyFailed(candy, position) {
    this.levelHelper.onCandyFailed(this, candy, position);
  }

  resetLevel() {
    this.levelHelper.resetLevel();
  }

  create() {
    LevelHelper.initializeEditorWindow(this, this.initialProgram);
    this.initializeBackgroundGraphics();
    this.pathManager = new PathManager(this);
    this.animationExecutor = new AnimationExecutor(this, this.pathManager);
    this.queueManager = new QueueManager(this.pathManager, this.animationExecutor);

    this.commandManager = new CommandManager(
      this,
      this.pathManager,
      this.animationExecutor,
      this.queueManager,
    );
    this.levelHelper = new LevelHelper(
      this.setupLevelCandies.bind(this),
      this.animationExecutor,
      this.queueManager,
    );
    this.queueManager.levelHelper = this.levelHelper;

    this.createLinesForConveyerBelt();
    this.createIncrementalCommands();
    this.setupLevelCandies();
    this.defineInterpreterCommands();
    this.levelHelper.initializeRunCodeButton(this);
    this.levelHelper.initializeResetButton(this);
  }

  update() {
    this.graphics.clear();
    this.graphics.lineStyle(4, 0xffffff, 1);

    this.pathManager.drawAll(this.graphics);
    this.animationExecutor.drawFollower(this.graphics);
  }
}
