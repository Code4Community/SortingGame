export default class Level1 extends Phaser.Scene {
    graphics;
    path1;
    path2;
    path3;
    follower;
    isMoving = false;

    preload() {
        // Load the background image
        this.load.image('background', 'assets/background.png'); // Change the path as needed
        this.load.image('follower', 'assets/follower.png'); // Optional: Load a follower sprite
    }

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
        this.add.image(400, 300, 'background'); // Center the background

        this.graphics = this.add.graphics();
        this.initializePaths();
        this.initializeFollower();

        // Add event listener to the button
        document.getElementById("enableCommands").addEventListener("click", this.startTween);
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