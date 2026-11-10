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
  candyBank;
  candyBankCandies = [];
  candyBankNextIndex = 0;

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
    this.candyBankCandies = [...candies];
    this.candyBankNextIndex = 0;
    this.refreshCandyBank();
    this.pathManager.setCallbacks(
      (candy) => this.onCandySuccess(candy),
      (candy, position) => this.onCandyFailed(candy, position),
    );
    this.pathManager.setupCandyQueueAndGoalPositions(candies, goalPositions);
  }

  createCandyBank() {
    this.candyBank = this.add.container(620, 12).setDepth(10);
    this.refreshCandyBank();
  }

  getCandyBankLayout() {
    const columns = 3;
    const slotWidth = 42;
    const slotHeight = 40;
    const horizontalGap = 8;
    const rowGap = 4;
    const rows = Math.ceil(this.candyBankCandies.length / columns);
    const width = 168;
    const gridTop = 52;
    const height = gridTop + rows * (slotHeight + rowGap) + 8;

    return {
      columns,
      slotWidth,
      slotHeight,
      horizontalGap,
      rowGap,
      width,
      gridTop,
      height,
    };
  }

  createCandyBankBackground(width, height) {
    const background = this.add.graphics();
    background.fillStyle(0x16202a, 0.92);
    background.fillRoundedRect(0, 0, width, height, 10);
    background.lineStyle(2, 0xffffff, 0.8);
    background.strokeRoundedRect(0, 0, width, height, 10);
    return background;
  }

  createCandyBankLabel(text, x, y, color = "#ffffff", fontSize = "13px") {
    return this.add.text(x, y, text, {
      fontFamily: "Arial",
      fontSize,
      fontStyle: "bold",
      color,
    });
  }

  getNextCandyLabel() {
    const nextCandy = this.candyBankCandies[this.candyBankNextIndex];
    return nextCandy ? `NEXT: ${nextCandy.color} ${nextCandy.shape}` : "NEXT: All sorted!";
  }

  createCandyBankSlot(candy, index, layout) {
    const { columns, slotWidth, slotHeight, horizontalGap, gridTop, rowGap } = layout;
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = 8 + column * (slotWidth + horizontalGap);
    const y = gridTop + row * (slotHeight + rowGap);
    const isNext = index === this.candyBankNextIndex;
    const isSorted = index < this.candyBankNextIndex;

    const tile = this.add.graphics();
    tile.fillStyle(isNext ? 0x735b16 : 0x283642, 1);
    tile.fillRoundedRect(x, y, slotWidth, slotHeight, 6);
    tile.lineStyle(isNext ? 2 : 1, isNext ? 0xffd54f : 0x607080, 1);
    tile.strokeRoundedRect(x, y, slotWidth, slotHeight, 6);
    this.candyBank.add(tile);

    this.candyBank.add(
      this.add
        .image(x + slotWidth / 2, y + slotHeight / 2, candy.imageKey)
        .setDisplaySize(30, 30)
        .setAlpha(isSorted ? 0.35 : 1),
    );
  }

  refreshCandyBank() {
    if (!this.candyBank) return;

    this.candyBank.removeAll(true);

    const layout = this.getCandyBankLayout();
    this.candyBank.add(this.createCandyBankBackground(layout.width, layout.height));
    this.candyBank.add(this.createCandyBankLabel("CANDY BANK", 10, 7));
    this.candyBank.add(
      this.createCandyBankLabel(this.getNextCandyLabel(), 10, 27, "#ffe082", "11px"),
    );

    this.candyBankCandies.forEach((candy, index) => {
      this.createCandyBankSlot(candy, index, layout);
    });
  }

  onCandySuccess(candy) {
    LevelHelper.onCandySuccess(this, candy);
    this.candyBankNextIndex++;
    this.refreshCandyBank();
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

    this.createCandyBank();
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
