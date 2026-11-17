import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level4 extends LevelScene {
  constructor() {
    super(
      "Level4",
      "moveDown",
      false,
    );
  }

  preload() {
    super.preload();
    this.load.image("Connector", "assets/conveyer_photos/Connector.png");
    this.load.image("ConveyerDown", "assets/conveyer_photos/ConveyerDown.png");
    this.load.image("ConveyerAll", "assets/conveyer_photos/ConnectorAll.png");
    this.load.image("ConveyerLeft", "assets/conveyer_photos/ConveyerLeft.png");
    this.load.image("ConveyerRight", "assets/conveyer_photos/ConveyerRight.png");
    this.load.image("GoalBucket", "assets/conveyer_photos/GoalBucket.png")
    this.load.image("BlueBucket", "assets/conveyer_photos/BlueBucket.png")
    this.load.image("RedBucket", "assets/conveyer_photos/RedBucket.png")
    this.load.image("GreenBucket", "assets/conveyer_photos/GreenBucket.png")
		this.load.image("blueTriangleBucket", "assets/conveyer_photos/blueTriangle.png")
    this.load.image("redTriangleBucket", "assets/conveyer_photos/redTriangle.png")
    this.load.image("greenTriangleBucket", "assets/conveyer_photos/greenTriangle.png")
		this.load.image("blueCircleBucket", "assets/conveyer_photos/blueCircle.png")
    this.load.image("redCircleBucket", "assets/conveyer_photos/redCircle.png")
    this.load.image("greenCircleBucket", "assets/conveyer_photos/greenCircle.png")
  }

  create() {
    super.create();
    this.addConveyorArtwork();
    this.graphics.setDepth(2);
  }

  addConveyorArtwork() {
    const tiles = [
      { x: 400, y: 100, texture: "ConveyerDown" },
      { x: 400, y: 200, texture: "ConveyerDown" },
      { x: 400, y: 300, texture: "ConveyerDown" },
      { x: 300, y: 400, texture: "ConveyerLeft" },
      { x: 200, y: 400, texture: "ConveyerAll" },
      { x: 500, y: 400, texture: "ConveyerRight" },
      { x: 600, y: 400, texture: "ConveyerAll" },
      { x: 400, y: 500, texture: "ConveyerAll" },
      { x: 400, y: 400, texture: "ConveyerAll" },
      { x: 200, y: 500, texture: "BlueBucket" },
      { x: 200, y: 300, texture: "blueTriangleBucket" },
      { x: 100, y: 400, texture: "blueCircleBucket" },
      { x: 700, y: 400, texture: "redCircleBucket" },
      { x: 600, y: 500, texture: "RedBucket" },
      { x: 600, y: 300, texture: "redTriangleBucket" },
      { x: 300, y: 500, texture: "greenTriangleBucket" },
      { x: 400, y: 600, texture: "greenCircleBucket" },
      { x: 500, y: 500, texture: "GreenBucket" },
    ];

    tiles.forEach(({ x, y, texture }) => {
      this.add.image(x, y, texture).setDisplaySize(100, 100).setDepth(1);
    });
  }

  createLinesForConveyerBelt() {
    this.pathManager.addLine("center", { x: 400, y: 100 }, { x: 400, y: 400 });
    this.pathManager.addLineFrom("center", "left", { x: 200, y: 400 });
    this.pathManager.addLineFrom("center", "right", { x: 600, y: 400 });
    this.pathManager.addLineFrom("center", "down", { x: 400, y: 500 });
    this.pathManager.addLineFrom("center", "right", { x: 600, y: 400 });
    this.pathManager.addLineFrom("center", "down", { x: 400, y: 500 });
    this.pathManager.addLineFrom("left", "leftUp", {x: 200, y: 300});
    this.pathManager.addLineFrom("left", "leftDown", {x: 200, y: 500});
    this.pathManager.addLineFrom("left", "leftLeft", {x: 100, y: 400});
    this.pathManager.addLineFrom("right", "rightUp", {x: 600, y: 300});
    this.pathManager.addLineFrom("right", "rightDown", {x: 600, y: 500});
    this.pathManager.addLineFrom("right", "rightLeft", {x: 700, y: 400});
    this.pathManager.addLineFrom("down", "downDown", {x: 400, y: 600});
    this.pathManager.addLineFrom("down", "downLeft", {x: 300, y: 500});
    this.pathManager.addLineFrom("down", "downRight", {x: 500, y: 500});
  }

  setupLevelCandies() {
    let candyOptions = [
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.BLUE, Shapes.SQUARE, Patterns.PLAIN),
      new Candy(Colors.BLUE, Shapes.TRIANGLE, Patterns.PLAIN),
      new Candy(Colors.RED, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.RED, Shapes.SQUARE, Patterns.PLAIN),
      new Candy(Colors.RED, Shapes.TRIANGLE, Patterns.PLAIN),
      new Candy(Colors.GREEN, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.GREEN, Shapes.SQUARE, Patterns.PLAIN),
      new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.PLAIN),
    ];

    const goalPositions = {
      "blue-circle": { x: 100, y: 400 },
      "blue-square": { x: 200, y: 500 },
      "blue-triangle": { x: 200, y: 300 },
      "red-circle": { x: 700, y: 400 },
      "red-square": { x: 600, y: 500 },
      "red-triangle": { x: 600, y: 300 },
      "green-circle": { x: 400, y: 600 },
      "green-square": { x: 500, y: 500 },
      "green-triangle": { x: 300, y: 500 },
    };

    let candies = [];

    for(let i = 0; i < 3; i++){
        let nextCandy = candyOptions[Math.floor(Math.random() * candyOptions.length)];
        candies.push(nextCandy);
        candyOptions = candyOptions.filter(option => option !== nextCandy);
    }

    this.setupCandyQueue(candies, goalPositions);
  }
}