//NOTE THE NAMING HERE: LEVEL1, used in config!
import Candy, {Colors, Shapes, Patterns } from './candy.js';
export default class Level1 extends Phaser.Scene {

    graphics;
    path;
    follower;

    preload() {
        // Load the background image
        //TO-DO: Add Texture manager: https://docs.phaser.io/phaser/concepts/textures
        //Example candy implementation 
        const blueStripedCircle = new Candy(Colors.BLUE, Shapes.CIRCLE, Patterns.STRIPED, '../assets/candy_photos/blue_circle_striped.png');
        const redStripedCircle = new Candy(Colors.RED, Shapes.CIRCLE, Patterns.STRIPED, '../assets/candy_photos/red_circle_striped.png');
        const greenStripedCircle = new Candy(Colors.GREEN, Shapes.CIRCLE, Patterns.STRIPED, '../assets/candy_photos/green_circle_striped.png');
        //console.log(blueStripedCircle.imagePath === '../assets/blue_circle_striped.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('follower1', blueStripedCircle.imagePath); // Load the candy image
        this.load.image('follower2', redStripedCircleStripedCircle.imagePath);
        this.load.image('follower3', greenStripedCircleStripedCircle.imagePath);
        //this.load.image('follower', 'assets/follower.png'); // Optional: Load a follower sprite
    }

    create() {
        //First, we initialize the editor window
        C4C.Editor.Window.init(this);   //Scene is passed in to this init function.
        C4C.Editor.Window.open();
        C4C.Editor.setText('moveleft'); //Example default text that will be in the editor window when it opens
        console.log("Text editor initialized.");


        //Console log as you go and define things to make sure things work!
        //Example definition of defining a function, see google doc blah blah blah
        C4C.Interpreter.define("moveleft", () => {
            console.log("moveleft selected...");
            alert("hello");
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

        // add sprites to screen using defined array
        // 1 = blue circle striped
        // 2 = red circle striped
        // 3 = green circle striped
        let arr1 =[
            [1,2,3],
            [3,3,3],
            [3,2,1]];
        for(i = 0; i < arr1.length; i++){
            for(j = 0; j < arr1[i].length; j++){
                if (arr[i][j] == 1){
                    this.add.image(i*10 + 400, j*10 + 300, 'follower1');
                } else if (arr[i][j] == 2){
                    this.add.image(i*10, j*10, 'follower2');
                } else if (arr[i][j] == 3){
                    this.add.image(i*10, j*10, 'follower3');
                }
            }
        }
            
        this.graphics = this.add.graphics();
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        //Add follower sprite here...

        // Create the path using two separate lines
        const line1 = new Phaser.Curves.Line([100, 100, 500, 200]);
        const line2 = new Phaser.Curves.Line([200, 300, 600, 500]);

        this.path = this.add.path();
        this.path.add(line1);
        this.path.add(line2);

        // Tween the follower along the path
        this.tweens.add({
            targets: this.follower,
            t: 1,
            ease: 'Linear',
            duration: 4000,
            yoyo: true,
            repeat: -1
        });
    }

    update() {
        //We'll want to abstract this out into it's own function later...
        // Clear the graphics object
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        

        // Draw the path
        this.path.draw(this.graphics);

        // Get the position of the follower on the path
        this.path.getPoint(this.follower.t, this.follower.vec);

        // Draw the follower as a red square
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillRect(this.follower.vec.x - 8, this.follower.vec.y - 8, 16, 16);
    }
}

//For debugging for casey later...
// const canvas = document.getElementById('my-custom-canvas');
// if (canvas) {console.log("Found?");} else { console.log("Not found?"); } 