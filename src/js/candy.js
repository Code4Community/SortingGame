export default class Candy {
  constructor(color, shape, pattern, imagePath) {
    this.color = color;
    this.shape = shape;
    this.pattern = pattern;
    this.imagePath = imagePath;
  }

  get type() {
    return `${this.color}-${this.shape}`;
  }
}

export const Colors = Object.freeze({
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
});

export const Shapes = Object.freeze({
  CIRCLE: "circle",
  SQUARE: "square",
  TRIANGLE: "triangle",
});

export const Patterns = Object.freeze({
  STRIPED: "striped",
  DOTTED: "dotted",
  PLAIN: "plain",
});
