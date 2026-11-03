import PathManager from "./PathManager.js";
import AnimationExecutor from "./AnimationExecutor.js";
import CommandManager from "./CommandManager.js";
import QueueManager from "./QueueManager.js";
import LevelHelper from "./LevelHelper.js";
import { Colors, Shapes } from "../candy.js";

export default class LevelScene extends Phaser.Scene {
  constructor(levelName, initialProgram = "", showPathLines = true) {
    super({ key: levelName });
    this.currentLevel = levelName;
    this.initialProgram = initialProgram;
    this.showPathLines = showPathLines;
  }

  graphics;
  pathManager;
  animationExecutor;
  commandManager;
  queueManager;
  levelHelper;
  currentLevel;
  initialProgram;
  showPathLines;

  preload() {
    // this.load.image("background", "assets/factorybackground.png");
    console.log(`[${this.currentLevel}] Preloading background image.`);
    this.load.image("Connector", "assets/conveyer_photos/Connector.png");
    this.load.image("ConveyerDown", "assets/conveyer_photos/ConveyerDown.png");
    this.load.image("ConveyerAll", "assets/conveyer_photos/ConnectorAll.png");
    this.load.image("ConveyerLeft", "assets/conveyer_photos/ConveyerLeft.png");
    this.load.image("ConveyerRight", "assets/conveyer_photos/ConveyerRight.png");
    this.load.image("GoalBucket", "assets/conveyer_photos/GoalBucket.png");
    this.load.image("ConveyerCurvedLeft", "assets/conveyer_photos/LeftBelt.png");
    this.load.image("ConveyerCurvedRight", "assets/conveyer_photos/RightBelt.png");

    this.load.image("blueCircleDotted", "assets/candy_photos/blue-circle-dotted.png");
    this.load.image("blueCircle", "assets/candy_photos/blue-circle-nopattern.png");
    this.load.image("blueSquareDotted", "assets/candy_photos/blue-square-dotted.png");
    this.load.image("blueSquare", "assets/candy_photos/blue-square-nopattern.png");
    this.load.image("blueSquareStriped", "assets/candy_photos/blue-square-striped.png");
    this.load.image("blueTriangleDotted", "assets/candy_photos/blue-triangle-dotted.png");
    this.load.image("blueTriangle", "assets/candy_photos/blue_triangle_nopattern.png");
    this.load.image("blueTriangleStriped", "assets/candy_photos/blue-triangle-striped.png");
    this.load.image("blueCircleStriped", "assets/candy_photos/blue_circle_striped.png");
    this.load.image("greenCircleDotted", "assets/candy_photos/green-circle-dotted.png");
    this.load.image("greenCircle", "assets/candy_photos/green-circle-nopattern.png");
    this.load.image("greenCircleStriped", "assets/candy_photos/green-circle-striped.png");
    this.load.image("greenSquareDotted", "assets/candy_photos/green-square-dotted.png");
    this.load.image("greenSquare", "assets/candy_photos/green-square-nopattern.png");
    this.load.image("greenSquareStriped", "assets/candy_photos/green-square-striped.png");
    this.load.image("greenTriangleDotted", "assets/candy_photos/green-triangle-dotted.png");
    this.load.image("greenTriangle", "assets/candy_photos/green-triangle-nopattern.png");
    this.load.image("greenTriangleStriped", "assets/candy_photos/green-triangle-striped.png");
    this.load.image("redCircleDotted", "assets/candy_photos/red-circle-dotted.png");
    this.load.image("redCircle", "assets/candy_photos/red-circle-nopattern.png");
    this.load.image("redCircleStripes", "assets/candy_photos/red-circle-stripes.png");
    this.load.image("redSquareDotted", "assets/candy_photos/red-square-dotted.png");
    this.load.image("redSquare", "assets/candy_photos/red-square-nopattern.png");
    this.load.image("redSquareStriped", "assets/candy_photos/red-square-striped.png");
    this.load.image("redTriangleDotted", "assets/candy_photos/red-triangle-dotted.png");
    this.load.image("redTriangle", "assets/candy_photos/red-triangle-nopattern.png");
    this.load.image("redTriangleStriped", "assets/candy_photos/red-triangle-striped.png");
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

  defineCommonInterpreterCommands() {
    const getPlannedCandy = () => this.queueManager.getPlannedCandy();

    LevelHelper.defineInterpreterCommands(this.commandManager, {
      immediate: {
        sampleCommand: () => {
          console.log(
            "This is an example custom command, should run immediately",
          );
        },
        isBlue: () => getPlannedCandy()?.color === Colors.BLUE,
        isRed: () => getPlannedCandy()?.color === Colors.RED,
        isGreen: () => getPlannedCandy()?.color === Colors.GREEN,
        isCircle: () => getPlannedCandy()?.shape === Shapes.CIRCLE,
        isSquare: () => getPlannedCandy()?.shape === Shapes.SQUARE,
        isTriangle: () => getPlannedCandy()?.shape === Shapes.TRIANGLE,
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
    this.defineCommonInterpreterCommands();
    this.levelHelper.initializeRunCodeButton(this);
    this.levelHelper.initializeResetButton(this);
  }

  update() {
    this.graphics.clear();
    this.graphics.lineStyle(4, 0xffffff, 1);

    if (this.showPathLines) {
      this.pathManager.drawAll(this.graphics);
    }
    this.animationExecutor.drawFollower(this.graphics);
  }
}
