import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level2 extends LevelScene {
  constructor() {
    super("Level2", "moveDown");
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
