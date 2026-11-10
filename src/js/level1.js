import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level1 extends LevelScene {
  constructor() {
    super(
      "Level1",
      "moveDown\nmoveLeft\nmoveLeft\ndumpCandy\nmoveDown\nmoveRight\nmoveRight\ndumpCandy\nmoveDown\nmoveDown\ndumpCandy",
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
    this.load.image("BlueBucket", "assets/conveyer_photos/BlueBucket.png")
    this.load.image("RedBucket", "assets/conveyer_photos/RedBucket.png")
    this.load.image("GreenBucket", "assets/conveyer_photos/GreenBucket.png")
  }

  create() {
    super.create();
    this.addConveyorArtwork();
    this.graphics.setDepth(2);
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
    const candies = [
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.RED, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.GREEN, Shapes.CIRCLE, Patterns.PLAIN),
    ];

    const goalPositions = {
      "blue-circle": { x: 200, y: 400 }, // Left bin
      "red-circle": { x: 600, y: 400 }, // Right bin
      "green-circle": { x: 400, y: 500 }, // Bottom bin
    };

    this.setupCandyQueue(candies, goalPositions);
  }

}
