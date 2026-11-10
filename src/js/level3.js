import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level3 extends LevelScene {
  constructor() {
    super("Level3", "moveDown", false);
  }

  create() {
    super.create();
    this.addConveyorArtwork();
    this.graphics.setDepth(2);
  }

  preload() {
    super.preload();
    this.load.image("Connector", "assets/conveyer_photos/Connector.png");
    this.load.image("ConveyerDown", "assets/conveyer_photos/ConveyerDown.png");
    this.load.image("ConveyerAll", "assets/conveyer_photos/ConnectorAll.png");
    this.load.image("ConveyerLeft", "assets/conveyer_photos/ConveyerLeft.png");
    this.load.image("ConveyerRight", "assets/conveyer_photos/ConveyerRight.png");
    this.load.image("BlueBucket", "assets/conveyer_photos/BlueBucket.png")
    this.load.image("RedBucket", "assets/conveyer_photos/RedBucket.png")
    this.load.image("GreenBucket", "assets/conveyer_photos/GreenBucket.png")
  }

  addConveyorArtwork() {
    const tiles = [
      { x: 400, y: 100, texture: "ConveyerDown" },
      { x: 400, y: 200, texture: "ConveyerDown" },
      { x: 400, y: 300, texture: "ConveyerDown" },
      { x: 300, y: 400, texture: "ConveyerLeft" },
      { x: 200, y: 400, texture: "BlueBucket" },
      { x: 500, y: 400, texture: "ConveyerRight" },
      { x: 600, y: 400, texture: "RedBucket" },
      { x: 400, y: 500, texture: "GreenBucket" },
      { x: 400, y: 400, texture: "ConveyerAll" },
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
  }

  addConveyorArtwork() {
    const tiles = [
      { x: 400, y: 100, texture: "ConveyerDown" },
      { x: 400, y: 200, texture: "ConveyerDown" },
      { x: 400, y: 300, texture: "ConveyerDown" },
      { x: 300, y: 400, texture: "ConveyerLeft" },
      { x: 200, y: 400, texture: "BlueBucket" },
      { x: 500, y: 400, texture: "ConveyerRight" },
      { x: 600, y: 400, texture: "RedBucket" },
      { x: 400, y: 500, texture: "GreenBucket" },
      { x: 400, y: 400, texture: "ConveyerAll" },
    ];

    tiles.forEach(({ x, y, texture }) => {
      this.add.image(x, y, texture).setDisplaySize(100, 100).setDepth(1);
    });
  }

  setupLevelCandies() {
    let candyOptions = [
        new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
        new Candy(Colors.RED, Shapes.SQUARE, Patterns.PLAIN),
        new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.PLAIN),
    ]

    const goalPositions = {
        "blue-circle": { x: 200, y: 400 },
        "red-square": { x: 600, y: 400 },
        "green-triangle": { x: 400, y: 500 }
    }

    let candies = [];

    for(let i = 0; i < 3; i++){
        let nextCandy = candyOptions[Math.floor(Math.random() * candyOptions.length)];
        candies.push(nextCandy);
        candyOptions = candyOptions.filter(option => option !== nextCandy);
    }

    this.setupCandyQueue(candies, goalPositions);
  }

}
