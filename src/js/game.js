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

const game = new Phaser.Game(config);
