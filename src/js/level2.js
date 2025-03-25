// FIX: the leftCount/rightCount:
//        the issue is that there arent being reset after the first run.




//NOTE THE NAMING HERE: LEVEL1, used in config!
import Candy, {Colors, Shapes, Patterns } from './candy.js';
export default class Level2 extends Phaser.Scene {

    graphics;
    
    path1;
    path2;
    path3;
    path4;
    path5;

    leftChildren = [2, 4];
    rightChildren = [3, 5];

    follower;
    isMoving = false;

    canMoveLeft = false;
    canMoveRight = false;

    leftCount = 0;
    rightCount = 0;

    preload() {
        // Load the background image
        //TO-DO: Add Texture manager: https://docs.phaser.io/phaser/concepts/textures
        //Example candy implementation 
        const blueStripedCircle = new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.STRIPED, '../assets/candy_photos/blue_circle_striped.png');
        //console.log(blueStripedCircle.imagePath === '../assets/blue_circle_striped.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('follower', blueStripedCircle.imagePath); // Load the candy image
        //this.load.image('follower', 'assets/follower.png'); // Optional: Load a follower sprite
        this.leftCount = 0;
    }

    create() {
        //First, we initialize the editor window
        C4C.Editor.Window.init(this);   //Scene is passed in to this init function.
        C4C.Editor.Window.open();
        //C4C.Editor.setText('moveleft'); //Example default text that will be in the editor window when it opens
        console.log("Text editor initialized.");
        

        //Console log as you go and define things to make sure things work!
        //Example definition of defining a function, see google doc blah blah blah
        C4C.Interpreter.define("moveleft", () => {
            console.log("moveleft in text editor");
            //this.leftCount++;
            //console.log("leftCount: ", this.leftCount);
            this.canMoveLeft = true;
        });

        C4C.Interpreter.define("moveright", () => {
            console.log("moveright in text editor");
            this.canMoveRight = true;
        });

        //Example of how we'd define a boolean for something.
        //C4C.Interpreter.define("candy.color = blue", () => {return this.color});

        document.getElementById("enableCommands").addEventListener("click", (event) => {
                // document.getElementById("enableCommands").disabled = true;
                //Grabbing text and then running it
                let programText = C4C.Editor.getText();
                C4C.Interpreter.run(programText);
                runner.setProgram(programText);
        });

        //We'll want to abstract this out into it's own function later... messy for now. 
        // Add the background image
        this.add.image(400, 300, 'background'); // Center the background

        this.graphics = this.add.graphics();
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        //Add follower sprite here...

        // Create the path using 3 separate lines
        const startline = new Phaser.Curves.Line([400, 0, 400, 100]);
        const leftline = new Phaser.Curves.Line([400, 100, 250, 300]);
        const rightline = new Phaser.Curves.Line([400, 100, 550, 300]);

        const leftline2 = new Phaser.Curves.Line([250, 300, 150, 400]);
        const rightline2 = new Phaser.Curves.Line([250, 300, 350, 400]);
        

        this.path1 = this.add.path();
        this.path1.add(startline);

        this.path2 = this.add.path();
        this.path2.add(leftline);

        this.path3 = this.add.path();
        this.path3.add(rightline);

        this.path4 = this.add.path();
        this.path4.add(leftline2);

        this.path5 = this.add.path();
        this.path5.add(rightline2);

        
        

        // Tween the follower along the path
        const startTween = ()=> {
            this.follower.t = 0;
            this.isMoving = true;
            console.log("isMoving: ",this.isMoving);
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
               

                    if (this.canMoveLeft) {
                        var i = 0;
                        while (2 > i) {
                            
                            const pathNum = this.leftChildren[i];
                            console.log("Path number: " ,pathNum);
                            this.moveLeftPath(pathNum);
                            
                            i++;
                        }
                        this.canMoveLeft = false;
                    } else if(this.canMoveRight) {
                        this.moveRight();
                        this.canMoveRight = false;
                    } else {
                        this.isMoving = false;
                    } 
                }
            });
        };

        // Function to move the follower to the left path doesnt matter which path
        this.moveLeftPath = (pathNum) => {

            this.follower.t = pathNum - 1 + 0.001;
            this.tweens.add({
                targets: this.follower,
                t: pathNum,
                ease: 'Linear',
                duration: 1000,
                onUpdate: () => {
                    if (pathNum === 2) {
                        this.path2.getPoint(this.follower.t, this.follower.vec);
                    } else if (pathNum === 4) { 
                        this.path4.getPoint(this.follower.t, this.follower.vec);
                    }
                },
                onComplete: () => {
                    console.log("path",pathNum,"complete!");
                    this.isMoving = false;
                }
            });
        };

        this.movePath2 = () => {
            this.follower.t = 1;
            this.tweens.add({
                targets: this.follower,
                t: 1.999,
                ease: 'Linear',
                duration: 1000,
                onUpdate: () => {
                    this.path2.getPoint(this.follower.t, this.follower.vec);
                },
                onComplete: () => {
                    console.log("Path2 complete!");
                    this.isMoving = false;
                }
            }); 
        };

        this.movePath3 = () => {
            this.follower.t = 2.001;
            this.tweens.add({
                targets: this.follower,
                t: 3,
                ease: 'Linear',
                duration: 1000,
                onUpdate: () => {
                    this.path3.getPoint(this.follower.t, this.follower.vec);
                },
                onComplete: () => {
                    console.log("Path3 complete!");
                    this.isMoving = false;
                }
            });
        };

        this.movePath4 = () => {
            this.follower.t = 3.001;
            this.tweens.add({
                targets: this.follower,
                t: 4,
                ease: 'Linear',
                duration: 1000,
                onUpdate: () => {
                    this.path4.getPoint(this.follower.t, this.follower.vec);
                },
                onComplete: () => {
                    console.log("Path4 complete!");
                    this.isMoving = false;
                }
            });
        };


        // Function to move the follower to the left path
        this.moveLeft = () => {
         
            console.log("move left function called");

            // var i = 0;
            // while (i < this.leftChildren.length) {
            //     const pathNum = this.leftChildren[i];
            //     console.log("Path number: " ,pathNum);
            //     this.moveLeftPath(pathNum);
            //     i++;
            // }
            // The code above does the same thing as the code below, but in a more abstract way.
            this.movePath2();
            // this.movePath4();
        };

        // Function to move the follower to the right path
        this.moveRight = () => {
        
            console.log("move right function called");
            this.movePath3();
        };

        // Add event listener to the button
        document.getElementById("enableCommands").addEventListener("click", startTween);
    }

    

    update() {
        //We'll want to abstract this out into it's own function later...
        // Clear the graphics object
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        

        // Draw the paths
        this.path1.draw(this.graphics);
        this.path2.draw(this.graphics);
        this.path3.draw(this.graphics);


        this.path4.draw(this.graphics);
        this.path5.draw(this.graphics);

        // Get the position of the follower on the path
        if (this.isMoving) {
            if (this.follower.t <= 1) {
                this.path1.getPoint(this.follower.t, this.follower.vec);
            } else if (this.follower.t > 1 && this.follower.t <= 2) {
                this.path2.getPoint(this.follower.t - 1, this.follower.vec);
            } else if (this.follower.t > 2 && this.follower.t <= 3) {
                this.path3.getPoint(this.follower.t - 2, this.follower.vec);
            } else if (this.follower.t > 3 && this.follower.t <= 4) {
                this.path4.getPoint(this.follower.t - 3, this.follower.vec);
            } else if (this.follower.t > 4 && this.follower.t <= 5) {
                this.path5.getPoint(this.follower.t - 4, this.follower.vec);
            }
        }
        
            
        
        

        // Draw the follower as a red square
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillRect(this.follower.vec.x - 8, this.follower.vec.y - 8, 16, 16);
    }
}

//For debugging for casey later...
// const canvas = document.getElementById('my-custom-canvas');
// if (canvas) {console.log("Found?");} else { console.log("Not found?"); } 