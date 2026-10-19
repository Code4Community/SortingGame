import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level1 extends LevelScene {
  constructor() {
    super(
      "Level1",
      "moveDown\nmoveLeft\nmoveLeft\ndumpCandy\nmoveDown\nmoveRight\nmoveRight\ndumpCandy\nmoveDown\nmoveDown\ndumpCandy",
    );
  }

  createLinesForConveyerBelt() {
    this.pathManager.addLine("center", { x: 400, y: 100 }, { x: 400, y: 400 });
    this.pathManager.addLineFrom("center", "left", { x: 200, y: 400 });
    this.pathManager.addLineFrom("center", "right", { x: 600, y: 400 });
    this.pathManager.addLineFrom("center", "down", { x: 400, y: 500 });
    this.pathManager.addLineFrom("center", "right", { x: 600, y: 400 });
    this.pathManager.addLineFrom("center", "down", { x: 400, y: 500 });
  }

  setupLevelCandies() {
    const candies = [
      new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.PLAIN),
      new Candy(Colors.RED, Shapes.SQUARE, Patterns.PLAIN),
      new Candy(Colors.GREEN, Shapes.TRIANGLE, Patterns.PLAIN),
    ];

    const goalPositions = {
      "blue-circle": { x: 200, y: 400 }, // Left bin
      "red-square": { x: 600, y: 400 }, // Right bin
      "green-triangle": { x: 400, y: 500 }, // Bottom bin
    };

    this.setupCandyQueue(candies, goalPositions);
  }

}
