import PathManager from "./SceneClasses/PathManager.js";
import AnimationExecutor from "./SceneClasses/AnimationExecutor.js";
import CommandManager from "./SceneClasses/CommandManager.js";
import QueueManager from "./SceneClasses/QueueManager.js";
import LevelHelper from "./SceneClasses/LevelHelper.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";


export default class Level1 extends Phaser.Scene {
  graphics;
  pathManager;
  animationExecutor;
  commandManager;
  currentLevel = "Level1";

  // ---------------------------------------------------------
  // ADDED: Array to track preview candy sprites
  // ---------------------------------------------------------
  previewSprites = [];
  // ---------------------------------------------------------

  preload() {
    this.load.image("background", "assets/background.png");
    console.log(`[${this.currentLevel}] Preloading background image.`);
    this.load.image('Connector', 'assets/conveyer_photos/Connector.png');
    this.load.image('ConveyerDown', 'assets/conveyer_photos/ConveyerDown.png');
    this.load.image('ConveyerAll', 'assets/conveyer_photos/ConnectorAll.png');
    this.load.image('ConveyerLeft', 'assets/conveyer_photos/Left_Belt.png');
    this.load.image('ConveyerRight', 'assets/conveyer_photos/Right_belt.png');
    this.load.image('tester', 'assets/candy_photos/blue-square-dotted.png');
    this.load.image('tester2', 'assets/candy_photos/red-triangle-dotted.png');
    this.load.image('tester3', 'assets/candy_photos/green-triangle-dotted - Copy.png');
  }

  ConveyerMap = {
    0: "",
    1: "ConveyerDown",
    2: "ConveyerLeft",
    3: "ConveyerRight",
    4: "Connector",
    5: "ConveyerAll"
  };

  levelData = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [2, 4, 3],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1]
  ];

  initializeEditorWindow() {
    LevelHelper.initializeEditorWindow(
      this,
      "moveDown\nmoveLeft\nmoveLeft\ndumpCandy\nmoveDown\nmoveRight\nmoveRight\ndumpCandy\nmoveDown\nmoveDown\ndumpCandy",
    );
  }

  initializeBackgroundGraphics() {
    this.graphics = this.add.graphics();
    console.log(`[${this.currentLevel}] Graphics object created.`);
  }

  createLinesForConveyerBelt() {
    this.pathManager.addLine("center", { x: 400, y: 100 }, { x: 400, y: 400 });
    this.pathManager.addLineFrom("center", "left", { x: 200, y: 400 });
    this.pathManager.addLineFrom('center', 'right', { x: 600, y: 400 });
    this.pathManager.addLineFrom('center', 'leftDown', { x: 400, y: 500 });
  }

  createIncrementalCommands() {
    LevelHelper.createIncrementalCommands(this.pathManager, {
      moveLeft: (currentPos) => ({ x: currentPos.x - 100, y: currentPos.y }),
      moveRight: (currentPos) => ({ x: currentPos.x + 100, y: currentPos.y }),
      moveUp: (currentPos) => ({ x: currentPos.x, y: currentPos.y - 100 }),
      moveDown: (currentPos) => ({ x: currentPos.x, y: currentPos.y + 100 }),
    });
  }

  // ---------------------------------------------------------
  // ADDED: Render preview candies on the right side
  // ---------------------------------------------------------
  renderCandyPreview(candies) {
    this.previewSprites.forEach(sprite => sprite.destroy());
    this.previewSprites = [];

    const startX = 750;
    const startY = 150;
    const spacing = 100;

    candies.forEach((candy, index) => {
      const sprite = this.add.image(startX, startY + index * spacing, candy.path);
      sprite.setScale(0.8);
      sprite.setDepth(10);
      this.previewSprites.push(sprite);
    });
  }
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // ADDED: Remove first preview candy when used
  // ---------------------------------------------------------
  removeFirstPreviewCandy() {
    if (this.previewSprites.length > 0) {
      const sprite = this.previewSprites.shift();
      sprite.destroy();

      this.previewSprites.forEach((sprite, index) => {
        this.tweens.add({
          targets: sprite,
          y: 150 + index * 100,
          duration: 200,
          ease: 'Power2'
        });
      });
    }
  }
  // ---------------------------------------------------------

  setupLevelCandies() {
    const candies = [
      new Candy(Colors.BLUE, Shapes.SQUARE, Patterns.DOTTED, 'tester'),
      new Candy(Colors.RED, Shapes.TRIANGLE, Patterns.DOTTED, 'tester2'),
      new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.DOTTED, 'tester3')
    ];

    console.log(candies[0].path, candies[1].path, candies[2].path);

    // ---------------------------------------------------------
    // ADDED: Show preview candies
    // ---------------------------------------------------------
    this.renderCandyPreview(candies);
    // ---------------------------------------------------------

    const goalPositions = {
      'tester':  { x: 200, y: 400 },
      'tester2': { x: 600, y: 400 },
      'tester3': { x: 400, y: 200 },
    };

    this.pathManager.setCallbacks(
      (candy) => this.onCandySuccess(candy),
      (candy, position) => this.onCandyFailed(candy, position),
    );

    this.pathManager.setupCandyQueueAndGoalPositions(candies, goalPositions);
  }

  onCandySuccess(candy) {
    // ---------------------------------------------------------
    // ADDED: Remove preview candy on success
    // ---------------------------------------------------------
    this.removeFirstPreviewCandy();
    // ---------------------------------------------------------
    LevelHelper.onCandySuccess(this, candy);
  }

  onCandyFailed(candy, position) {
    // ---------------------------------------------------------
    // ADDED: Remove preview candy on failure
    // ---------------------------------------------------------
    this.removeFirstPreviewCandy();
    // ---------------------------------------------------------
    LevelHelper.onCandyFailed(this, candy, position);
  }

  defineInterpreterCommands() {
    LevelHelper.defineInterpreterCommands(this.commandManager, {
      immediate: {
        sampleCommand: () => {
          console.log("This is an example custom command, should run immediately");
        },
      },
      queued: {
        queuedCommand: () => {
          console.log("This is an example custom command that is queued according to animation, should run in animation sequence");
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
    this.queueManager = new QueueManager(this.pathManager, this.animationExecutor);
    this.commandManager = new CommandManager(this, this.pathManager, this.animationExecutor, this.queueManager);

    this.createLinesForConveyerBelt();
    this.createIncrementalCommands();
    this.setupLevelCandies();
    this.defineInterpreterCommands();
    this.initializeRunCodeButton();
    this.initializeResetButton();

    const tileSize = 64;
    const offsetX = 305;
    const offsetY = 0;

    for (var row = 0; row < this.levelData.length; row++) {
      for (var col = 0; col < this.levelData[row].length; col++) {
        var tileType = this.levelData[row][col];
        var textureKey = this.ConveyerMap[tileType];
        if (textureKey === "") continue;
        var image = this.add.image(offsetX + col * tileSize, offsetY + row * tileSize, textureKey).setOrigin(0);
        image.setScale(2);
        image.setDepth(-1);
      }
    }
  }

  moveToCenter = (gameObject) => {
    this.tweens.add({
      targets: gameObject,
      x: 400,
      y: 100,
      ease: 'Power2',
      duration: 2000
    });
  };

  moveUpSpot = (gameObject) => {
    this.tweens.add({
      targets: gameObject,
      x: 700,
      y: gameObject.y - 100,
      ease: 'Power2',
      duration: 2000
    });
  };

  update() {
    this.graphics.clear();
    this.graphics.lineStyle(4, 0xffffff, 1);

    this.pathManager.drawAll(this.graphics);
    this.animationExecutor.drawFollower(this.graphics);
  }
}
