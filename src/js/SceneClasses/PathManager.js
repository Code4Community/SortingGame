export default class PathManager {
    constructor(scene) {
        this.scene = scene;
        this.lines = {}; //Stores phaser line objects { name: Phaser.Curves.Line }
        this.paths = {}; //Stores our custom arrays of line names { pathName: [lineName, ...] }
    }

    addLine(name, start, end) {
        console.log('Start object:', start);
        console.log('Start.x:', start.x);

        const startVec = new window.Phaser.Math.Vector2(start.x, start.y);
        const endVec = new window.Phaser.Math.Vector2(end.x, end.y);

        this.lines[name] = new window.Phaser.Curves.Line(startVec, endVec);
        console.log('Created line:', name, this.lines[name]);
        return this.lines[name];
    }

    //Creates a new line that starts where another line ends, where "end" is the final destination point
    addLineFrom(newLineName, fromLineName, end) {
        const fromLine = this.lines[fromLineName];
        if (!fromLine) throw new Error(`Line ${fromLineName} not found`);

        console.log('fromLine:', fromLine);

        var endPoint;
        if (fromLine.getPoint) {
            endPoint = this._getEndpointOfFromLine(fromLine);
        } else {
            throw new Error(`Cannot determine end point of line ${fromLineName}`);
        }

        return this.addLine(newLineName, endPoint, end);
    }

    _getEndpointOfFromLine(fromLine) {
        const endPointIndex = 1;
        const tempVec = new window.Phaser.Math.Vector2();
        fromLine.getPoint(endPointIndex, tempVec);
        return { x: tempVec.x, y: tempVec.y };
    }

    //Used to create paths from the different lines.
    //E.g: this.pathManager.definePath('moveleft', ['center', 'left']);
    definePath(pathName, lineNamesArray) {
        this.paths[pathName] = lineNamesArray;
    }

    getPath(pathName) {
        return (this.paths[pathName] || []).map(name => this.lines[name]);
    }

    drawAll(graphics) {
        Object.values(this.lines).forEach(line => line.draw(graphics));
    }
}
