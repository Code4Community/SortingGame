import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level2 extends LevelScene {
  constructor() {
    super("Level2", "moveDown", false);
  }

	preload() {
    super.preload();
    this.load.image("Connector", "assets/conveyer_photos/Connector.png");
    this.load.image("ConveyerDown", "assets/conveyer_photos/ConveyerDown.png");
    this.load.image("ConveyerAll", "assets/conveyer_photos/ConnectorAll.png");
    this.load.image("ConveyerLeft", "assets/conveyer_photos/ConveyerLeft.png");
    this.load.image("ConveyerRight", "assets/conveyer_photos/ConveyerRight.png");
    this.load.image("BlueCircle", "assets/conveyer_photos/BlueCircle.png")
    this.load.image("RedCircle", "assets/conveyer_photos/RedCircle.png")
    this.load.image("GreenCircle", "assets/conveyer_photos/GreenCircle.png")
    this.load.image("LeftBelt", "assets/conveyer_photos/LeftBelt.png")
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
      { x: 200, y: 400, texture: "LeftBelt" },
      { x: 200, y: 500, texture: "BlueCircle" },
      { x: 500, y: 400, texture: "ConveyerRight" },
      { x: 600, y: 400, texture: "RedCircle" },
      { x: 400, y: 500, texture: "GreenCircle" },
      { x: 400, y: 400, texture: "ConveyerAll" },
    ];

    tiles.forEach(({ x, y, texture }) => {
      this.add.image(x, y, texture).setDisplaySize(100, 100).setDepth(1);
    });
  }

	createLinesForConveyerBelt() {
    this.pathManager.addLine("center", { x: 400, y: 100 }, { x: 400, y: 400 });
    this.pathManager.addLineFrom("center", "left", { x: 200, y: 400 });
    this.pathManager.addLineFrom("left", "downleft", { x: 200, y: 500});
    this.pathManager.addLineFrom("center", "right", { x: 600, y: 400 });
    this.pathManager.addLineFrom("center", "down", { x: 400, y: 500 });
  }

  setupLevelCandies() {
    //Define the candies for this level
    const candies = [
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN)
    ];

    //Define goal positions for each candy type. Again, adjust to using the Candy class
    const goalPositions = {
      "blue-circle": { x: 200, y: 500 }, // Left bin
    };

    this.setupCandyQueue(candies, goalPositions);
  }
}
