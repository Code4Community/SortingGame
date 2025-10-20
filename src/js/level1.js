import Candy, {Colors, Shapes, Patterns } from './candy.js';
export default class Level1 extends Phaser.Scene {

    graphics;
    path1;
    path2;
    path3;
    follower;
    isMoving = false;

    preload() {
        // Load the background image
        //TO-DO: Add Texture manager: https://docs.phaser.io/phaser/concepts/textures
        //Example candy implementation 
        const blueStripedCircle = new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.STRIPED, '../assets/candy_photos/blue_circle_striped.png');
        //console.log(blueStripedCircle.imagePath === '../assets/blue_circle_striped.png');
       // this.load.image('background', 'assets/background.png');
        this.load.image('follower', blueStripedCircle.imagePath); // Load the candy image
        //this.load.image('follower', 'assets/follower.png'); // Optional: Load a follower sprite


        this.load.image('Connector', 'assets/conveyer_photos/Connector.png');
        this.load.image('ConveyerDown', 'assets/conveyer_photos/ConveyerDown.png');
        this.load.image('ConveyerAll', 'assets/conveyer_photos/ConnectorAll.png');
        this.load.image('ConveyerLeft', 'assets/conveyer_photos/Left_Belt.png');
        this.load.image('ConveyerRight', 'assets/conveyer_photos/Right_belt.png');
    }

    ConveyerMap = {
        1: "ConveyerDown",
        2: "ConveyerLeft",
        3: "ConveyerRight",
        4: "Connector",
        5: "ConveyerAll"
    };

    levelData = [
        [0, 1, 0],
        [2, 4, 3],
        [1, 0, 1]
    ];

    create() {
        // Initialize the editor window
        C4C.Editor.Window.init(this);   // Scene is passed in to this init function!
        C4C.Editor.Window.open();
        console.log("Text editor initialized.");

        // Define interpreter commands
        C4C.Interpreter.define("moveleft", () => {
            //console.log("moveleft in text editor");
            this.moveLeft();
        });

        C4C.Interpreter.define("moveright", () => {
            this.moveRight();
        });

        document.getElementById("enableCommands").addEventListener("click", (event) => {
            let programText = C4C.Editor.getText();
            console.log("Program text: ", programText);
            C4C.Interpreter.run(programText);
            runner.setProgram(programText);
        });

        // Add the background image
        //this.add.image(400, 300, 'background'); // Center the background

        this.graphics = this.add.graphics();
        this.initializePaths();
        this.initializeFollower();

        // Add event listener to the button
        document.getElementById("enableCommands").addEventListener("click", this.startTween);

        const tileSize = 64; // assuming each tile is 64x64 pixels
        const offsetX = 200;
        const offsetY = 100;


        for (var row = 0; row < this.levelData.length; row++) {
            for (var col = 0; col < this.levelData[row].length; col++) {
                var tileType = this.levelData[row][col];
                var textureKey = this.ConveyerMap[tileType];
                var image = this.add.image(offsetX + col * tileSize, offsetY + row * tileSize, textureKey).setOrigin(0);
                image.setScale(2); 
            }
        }

    }

    initializePaths() {
        // Create the path using 3 separate lines
        const startline = new Phaser.Curves.Line([400, 0, 400, 300]);
        const leftline = new Phaser.Curves.Line([400, 300, 300, 500]);
        const rightline = new Phaser.Curves.Line([400, 300, 500, 500]);

        this.path1 = this.add.path();
        this.path1.add(startline);

        this.path2 = this.add.path();
        this.path2.add(leftline);

        this.path3 = this.add.path();
        this.path3.add(rightline);
    }

    initializeFollower() {
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    }

    startTween = () => {
        this.follower.t = 0;
        this.isMoving = true;
        console.log("isMoving: ", this.isMoving);
        this.tweens.add({
            targets: this.follower,
            t: 1,
            ease: 'Linear',
            duration: 1000,
            onUpdate: () => {
                this.path1.getPoint(this.follower.t, this.follower.vec);
            },
            onComplete: () => {
                console.log("Start Path complete!");
                this.handlePathCompletion();
            }
        });
    };

    handlePathCompletion() {
        // //Logic to determine the next move based on user input or pseudo code
        // const nextMove = this.getNextMove(); // Implement this function to determine the next move
        // if (nextMove === "left") {
        //     this.moveLeft();
        // } else if (nextMove === "right") {
        //     this.moveRight();
        // } else {
        //     this.isMoving = false;
        // }
    }

    // getNextMove() {
    // }

    moveLeft = () => {
        console.log("Move left function called");
        this.follower.t = 1;
        this.tweens.add({
            targets: this.follower,
            t: 2,
            ease: 'Linear',
            duration: 1000,
            onUpdate: () => {
                this.path2.getPoint(this.follower.t - 1, this.follower.vec);
            },
            onComplete: () => {
                console.log("Left Path complete!");
                this.handlePathCompletion();
            }
        });
    };

    moveRight = () => {
        console.log("Move right function called");
        this.follower.t = 2.001;
        this.tweens.add({
            targets: this.follower,
            t: 3,
            ease: 'Linear',
            duration: 1000,
            onUpdate: () => {
                this.path3.getPoint(this.follower.t - 2, this.follower.vec);
            },
            onComplete: () => {
                console.log("Right Path complete!");
                this.handlePathCompletion();
            }
        });
    };

    update() {
        //Clear the graphics object
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);

        //Draw the paths
        this.path1.draw(this.graphics);
        this.path2.draw(this.graphics);
        this.path3.draw(this.graphics);

        //Get the position of the follower on the path
        if (this.isMoving) {
            if (this.follower.t <= 1) {
                this.path1.getPoint(this.follower.t, this.follower.vec);
            } else if (this.follower.t > 1 && this.follower.t <= 2) {
                this.path2.getPoint(this.follower.t - 1, this.follower.vec);
            } else if (this.follower.t > 2 && this.follower.t <= 3) {
                this.path3.getPoint(this.follower.t - 2, this.follower.vec);
            }
        }

        //Draw the follower as a red square
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillRect(this.follower.vec.x - 8, this.follower.vec.y - 8, 16, 16);
    }
}

//For debugging for casey later...
// const canvas = document.getElementById('my-custom-canvas');
// if (canvas) {console.log("Found?");} else { console.log("Not found?"); } 