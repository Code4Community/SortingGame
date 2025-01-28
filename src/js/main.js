//import Level1 from './scenes/Level1.js';
import Level1 from './level1.js';

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
    scene: Level1
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

//Setting up text editor
C4C.Editor.create(document.getElementById("editor-here"), theme, true); //the element id doesn't actually make a difference. Idk why.
console.log("Created text editor! Yet to be initialized.");
const game = new Phaser.Game(config);
let runner = C4C.Runner.createRunner(); 