//import Level1 from './scenes/Level1.js';
import Level1 from './level1.js';
import Level2 from './level2.js';

//Here, we import the level files. 
//Later, we'll want to abstract this process into a function or switch case to call specific levels.
//Currently, that "nav bar" level selector is just a placeholder and doesn't really work.
const config = {
    parent: 'main_view',
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    dom: {
        createContainer: true,
      },
    scene: Level2
};

//Setting up the theme for the text editor
const theme = {
    "&": {
      color: "#00007F",
      backgroundColor: "#DDFFFF",
      maxWidth: "300px",
    },
    ".cm-content, .cm-gutter": {
      minHeight: "600px",
    }
  }

//Event listener for level select
document.getElementById('level-select').addEventListener('change', (event) => {
  const selectedLevel = event.target.value;
  var scene;

  switch (selectedLevel) {
      case '1':
          scene = 'DemoLevel';
          console.log('DemoLevel');
          game.scene.start(scene, Level1);
          break;
      case '2':
          scene = 'Level1';
          console.log('Level1');
          game.scene.start(scene, Level1);
          break;
      case '3':
          scene = 'Level2';
          game.scene.start(scene, Level2);
          break;
      // Add more cases for additional levels later when added
      default:
          scene = 'DemoLevel';
          game.scene.start(scene, Level1);
          break;
  }
});

//Setting up text editor
C4C.Editor.create(document.getElementById("editor-here"), theme, true); //the element id doesn't actually make a difference. Idk why.
console.log("Created text editor! Yet to be initialized.");
const game = new Phaser.Game(config);
let runner = C4C.Runner.createRunner(); 

function preload() {
  this.load.image("Connector", "src\assets\conveyer_photos\Connector.png");
  this.load.image("ConveyerDown", "src\assets\conveyer_photos\ConveyerDown.png");
  this.load.image("ConveyerAll", "src\assets\conveyer_photos\ConnectorAll.png");
  this.load.image("ConveyerLeft", "src\assets\conveyer_photos\Left Belt.png");
  this.load.image("ConveyerRight", "src/assets/conveyer_photos/Right belt.png");

  this.load.image("blueCircleStriped", "src\assets\candy_photos\blue_circle_striped.png");
  this.load.image("blueTriangle", "src\assets\candy_photos\blue_triangle_nopattern.png");
  this.load.image("blueCircleDotted", "src\assets\candy_photos\blue-circle-dotted.png");
  this.load.image("blueCircle", "src\assets\candy_photos\blue-circle-nopattern.png");
  this.load.image("blueSquareDotted", "src\assets\candy_photos\blue-square-dotted.png");
  this.load.image("blueSquare", "src\assets\candy_photos\blue-square-nopattern.png");
  this.load.image("blueSquareStriped", "src\assets\candy_photos\blue-square-striped.png");
  this.load.image("blueTriangleDotted", "src\assets\candy_photos\blue-triangle-dotted.png");
  this.load.image("blueTriangleStriped", "src\assets\candy_photos\blue-triangle-striped.png");
  this.load.image("greenCircleDotted", "src\assets\candy_photos\green-circle-dotted.png");
  this.load.image("greenCircle", "src\assets\candy_photos\green-circle-nopattern.png");
  this.load.image("greenCircleStriped", "src\assets\candy_photos\green-circle-striped.png");
  this.load.image("greenSquareDotted", "src\assets\candy_photos\green-square-dotted - Copy.png");
  this.load.image("greenSquare", "src\assets\candy_photos\green-square-nopattern.png");
  this.load.image("greenSquareStriped", "src\assets\candy_photos\green-square-striped.png");
  this.load.image("greenTriangleDotted", "src\assets\candy_photos\green-triangle-dotted - Copy.png");
  this.load.image("greenTriangle", "src/assets/candy_photos/green-triangle-nopattern.png");
  this.load.image("greenTriangleStriped", "src/assets/candy_photos/green-triangle-striped.png");
  this.load.image("redCircleDotted", "src/assets/candy_photos/red-circle-dotted.png");
  this.load.image("redCircle", "src/assets/candy_photos/red-circle-nopattern.png");
  this.load.image("redCircleStripes", "src/assets/candy_photos/red-circle-stripes.png");
  this.load.image("redSquareDotted", "src/assets/candy_photos/red-square-dotted.png");
  this.load.image("redSquare", "src/assets/candy_photos/red-square-nopattern.png");
  this.load.image("redSquareStriped", "src/assets/candy_photos/red-square-striped.png");
  this.load.image("redTriangleDotted", "src/assets/candy_photos/red-triangle-dotted.png");
  this.load.image("redTriangle", "src/assets/candy_photos/red-triangle-nopattern.png");
  this.load.image("redTriangleStriped", "src/assets/candy_photos/red-triangle-striped.png");


}