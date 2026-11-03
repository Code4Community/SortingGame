import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level2 extends LevelScene {
  constructor() {
    super("Level2", "moveDown");
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
      { x: 200, y: 400, texture: "ConveyerCurvedLeft" },
      { x: 500, y: 400, texture: "ConveyerRight" },
      { x: 600, y: 400, texture: "GoalBucket" },
      { x: 400, y: 500, texture: "GoalBucket" },
      { x: 400, y: 400, texture: "ConveyerAll" },
      { x: 200, y: 500, texture: "GoalBucket" },
    ];

    tiles.forEach(({ x, y, texture }) => {
      this.add.image(x, y, texture).setDisplaySize(100, 100).setDepth(1);
    });
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
