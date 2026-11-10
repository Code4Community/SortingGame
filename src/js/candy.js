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

  get imageKey() {
    const shape = `${this.shape[0].toUpperCase()}${this.shape.slice(1)}`;

    if (this.pattern === Patterns.PLAIN) {
      return `${this.color}${shape}`;
    }

    const pattern =
      this.color === Colors.RED &&
      this.shape === Shapes.CIRCLE &&
      this.pattern === Patterns.STRIPED
        ? "Stripes"
        : `${this.pattern[0].toUpperCase()}${this.pattern.slice(1)}`;

    return `${this.color}${shape}${pattern}`;
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
