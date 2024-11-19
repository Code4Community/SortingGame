//  import C4C from "c4c-lib";
class Example extends Phaser.Scene {
    graphics;
    path;
    follower;

    preload() {
        // Load the background image
        this.load.image('background', 'assets/background.png'); // Change the path as needed
        this.load.image('follower', 'assets/follower.png'); // Optional: Load a follower sprite
    }

    create() {
        console.log(document.getElementById("main_view"));
        C4C.Editor.create(document.getElementById("editor-here"));

        //Example definition, see google doc blah blah blah
        C4C.Interpreter.define("moveleft", () => {
            alert("hello");
          });

        //Example of how we'd define a boolean for whatever
        //C4C.Interpreter.define("candy.color = blue", () => {return this.color});

        document.getElementById("enableCommands").addEventListener("click", (event) => {
                // document.getElementById("enableCommands").disabled = true;
                //programText = C4C.Editor.getText();
                // HERE'S THE IMPORTANT PART!!
                // C4C.Interpreter.run(programText);
                console.log("HELP");

                let programText = C4C.Editor.getText();
                console.log(typeof programText);
                C4C.Interpreter.run(programText);
                runner.setProgram(programText);
        });
        
        // C4C.Editor.Window.init(this);
        // C4C.Editor.Window.open();
        // C4C.Editor.setText(`moveRight(20));
        //C4C.Editor.Window.toggle();

        // Add the background image
        this.add.image(400, 300, 'background'); // Center the background

        this.graphics = this.add.graphics();
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

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

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

C4C.Editor.create(document.getElementById("editor-here"));
// C4C.Editor.create(document.body, null, true);
const game = new Phaser.Game(config);
let runner = C4C.Runner.createRunner(); 

// document.getElementsByClassName("btn btn-primary").addEventListener("click", (event) => { 
//     console.log("HELP ME");
// });

// document.getElementById("enableCommands").addEventListener("click", (event) => {
//     // document.getElementById("enableCommands").disabled = true;
//     //programText = C4C.Editor.getText();
//     // HERE'S THE IMPORTANT PART!!
//     // C4C.Interpreter.run(programText);
//     console.log("HELP");
//     runner.setProgram(programText);
    
//     // if (!runner.check()) {
//     //   runner.reset();
//     //   return;
//     // } 
//     // runner.reset();
//   }); 
