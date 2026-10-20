import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";
import CommandManager from "./SceneClasses/CommandManager.js";
import QueueManager from "./SceneClasses/QueueManager.js";
import LevelHelper from "./SceneClasses/LevelHelper.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level4 extends Phaser.Scene {
  constructor() {
    super({ key: "Level4" });
  }

  graphics;
  pathManager;
  animationExecutor;
  commandManager;
  levelHelper;
  currentLevel = "Level4";

  preload() {
    this.load.image("background", "assets/background.jpg");
    this.load.image("blue-circle-nopattern", "assets/candy_photos/blue-circle-nopattern.png")
    this.load.image("red-circle-nopattern", "assets/candy_photos/red-circle-nopattern.png")
    this.load.image("green-circle-nopattern", "assets/candy_photos/green-circle-nopattern.png")
    this.load.image("blue-triangle-nopattern", "assets/candy_photos/blue-triangle-nopattern.png")
    this.load.image("red-triangle-nopattern", "assets/candy_photos/red-triangle-nopattern.png")
    this.load.image("green-triangle-nopattern", "assets/candy_photos/green-triangle-nopattern.png")
    this.load.image("blue-square-nopattern", "assets/candy_photos/blue-square-nopattern.png")
    this.load.image("red-square-nopattern", "assets/candy_photos/red-square-nopattern.png")
    this.load.image("green-square-nopattern", "assets/candy_photos/green-square-nopattern.png")
    this.load.image("blue-circle-dotted", "assets/candy_photos/blue-circle-dotted.png")
    this.load.image("red-circle-dotted", "assets/candy_photos/red-circle-dotted.png")
    this.load.image("green-circle-dotted", "assets/candy_photos/green-circle-dotted.png")
    this.load.image("blue-triangle-dotted", "assets/candy_photos/blue-triangle-dotted.png")
    this.load.image("red-triangle-dotted", "assets/candy_photos/red-triangle-dotted.png")
    this.load.image("green-triangle-dotted", "assets/candy_photos/green-triangle-dotted.png")
    this.load.image("blue-square-dotted", "assets/candy_photos/blue-square-dotted.png")
    this.load.image("red-square-dotted", "assets/candy_photos/red-square-dotted.png")
    this.load.image("green-square-dotted", "assets/candy_photos/green-square-dotted.png")
    this.load.image("blue-circle-striped", "assets/candy_photos/blue-circle-striped.png")
    this.load.image("red-circle-striped", "assets/candy_photos/red-circle-striped.png")
    this.load.image("green-circle-striped", "assets/candy_photos/green-circle-striped.png")
    this.load.image("blue-triangle-striped", "assets/candy_photos/blue-triangle-striped.png")
    this.load.image("red-triangle-striped", "assets/candy_photos/red-triangle-striped.png")
    this.load.image("green-triangle-striped", "assets/candy_photos/green-triangle-striped.png")
    this.load.image("blue-square-striped", "assets/candy_photos/blue-square-striped.png")
    this.load.image("red-square-striped", "assets/candy_photos/red-square-striped.png")
    this.load.image("green-square-striped", "assets/candy_photos/green-square-striped.png")
    console.log(`[${this.currentLevel}] Preloading background image.`);
  }

  initializeEditorWindow() {
    LevelHelper.initializeEditorWindow(
      this,
      "moveDown",
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
    this.pathManager.addLineFrom("left", "leftdown", { x: 200, y: 500});
    this.pathManager.addLineFrom("left", "upleft", { x: 200, y: 300});
    this.pathManager.addLineFrom("left", "centerleft", { x: 100, y: 400});
    this.pathManager.addLineFrom("right", "rightdown", { x: 600, y: 500});
    this.pathManager.addLineFrom("right", "upright", { x: 600, y: 300});
    this.pathManager.addLineFrom("right", "centerright", { x: 700, y: 400});
    this.pathManager.addLineFrom("down", "downleft", { x: 300, y: 500});
    this.pathManager.addLineFrom("down", "downright", { x: 500, y: 500});
    this.pathManager.addLineFrom("down", "downdown", { x: 400, y: 600});
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
    let candyOptions = [
        new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
        new Candy(Colors.RED, Shapes.CIRCLE, Patterns.PLAIN),
        new Candy(Colors.GREEN, Shapes.CIRCLE, Patterns.PLAIN),
        new Candy(Colors.BLUE, Shapes.SQUARE, Patterns.PLAIN),
        new Candy(Colors.RED, Shapes.SQUARE, Patterns.PLAIN),
        new Candy(Colors.GREEN, Shapes.SQUARE, Patterns.PLAIN),
        new Candy(Colors.BLUE, Shapes.TRIANGLE, Patterns.PLAIN),
        new Candy(Colors.RED, Shapes.TRIANGLE, Patterns.PLAIN),
        new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.PLAIN),
        new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.DOTTED),
        new Candy(Colors.RED, Shapes.CIRCLE, Patterns.DOTTED),
        new Candy(Colors.GREEN, Shapes.CIRCLE, Patterns.DOTTED),
        new Candy(Colors.BLUE, Shapes.SQUARE, Patterns.DOTTED),
        new Candy(Colors.RED, Shapes.SQUARE, Patterns.DOTTED),
        new Candy(Colors.GREEN, Shapes.SQUARE, Patterns.DOTTED),
        new Candy(Colors.BLUE, Shapes.TRIANGLE, Patterns.DOTTED),
        new Candy(Colors.RED, Shapes.TRIANGLE, Patterns.DOTTED),
        new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.DOTTED),
        new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.STRIPED),
        new Candy(Colors.RED, Shapes.CIRCLE, Patterns.STRIPED),
        new Candy(Colors.GREEN, Shapes.CIRCLE, Patterns.STRIPED),
        new Candy(Colors.BLUE, Shapes.SQUARE, Patterns.STRIPED),
        new Candy(Colors.RED, Shapes.SQUARE, Patterns.STRIPED),
        new Candy(Colors.GREEN, Shapes.SQUARE, Patterns.STRIPED),
        new Candy(Colors.BLUE, Shapes.TRIANGLE, Patterns.STRIPED),
        new Candy(Colors.RED, Shapes.TRIANGLE, Patterns.STRIPED),
        new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.STRIPED)
    ]

    const goalPositions = {
        "blue-circle": { x: 100, y: 400 },
        "blue-triangle": { x: 200, y: 300 },
        "blue-square": { x: 200, y: 500 },
        "red-square": { x: 600, y: 500 },
        "red-triangle": { x: 600, y: 300 },
        "red-circle": { x: 600, y: 400 },
        "green-triangle": { x: 300, y: 500 },
        "green-circle": { x: 500, y: 500 },
        "green-square": { x: 400, y: 600 }
    }

    let candies = [];

    for(let i = 0; i < 3; i++){
        let nextCandy = candyOptions[Math.floor(Math.random() * candyOptions.length)];
        candies.push(nextCandy);
        candyOptions = candyOptions.filter(option => option !== nextCandy);
    }

    // Set up callbacks for candy completion
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

  defineInterpreterCommands() {
    LevelHelper.defineInterpreterCommands(this.commandManager, {
      immediate: {
        sampleCommand: () => {
          console.log(
            "This is an example custom command, should run immediately",
          );
        },
        isBlue: () => this.queueManager.getPlannedCandy()?.color === Colors.BLUE,
        isRed: () => this.queueManager.getPlannedCandy()?.color === Colors.RED,
        isGreen: () => this.queueManager.getPlannedCandy()?.color === Colors.GREEN,
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
