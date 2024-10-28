function drawWithPaper() {
    var layer = project.activeLayer; // Get the active layer

    // Clear any previous drawings
    layer.removeChildren();

    // Draw multiple circles in different colors
    for (var i = 0; i < 10; i++) {
        var circle = new Path.Circle({
            center: [Math.random() * 800, Math.random() * 600], // Random position
            radius: 30,
            fillColor: new Color(Math.random(), Math.random(), Math.random(), 0.7) // Random color
        });
    }

    // Draw a border around each circle
    layer.children.forEach(circle => {
        circle.strokeColor = 'black';
        circle.strokeWidth = 2;
    });
}