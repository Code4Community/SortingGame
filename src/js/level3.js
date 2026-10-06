import LevelScene from "./SceneClasses/LevelScene.js";
import Candy, { Colors, Shapes, Patterns } from "./candy.js";

export default class Level3 extends LevelScene {
  constructor() {
    super("Level3", "moveDown");
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
