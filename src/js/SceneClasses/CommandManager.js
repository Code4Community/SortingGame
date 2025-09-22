export default class CommandManager {
    constructor(scene, pathManager, animationExecutor) {
        this.scene = scene;
        this.pathManager = pathManager;
        this.animationExecutor = animationExecutor;
        this.commandMappings = {}; // { commandName: pathName }
        this.customCommands = {}; // { commandName: callback }
    }

    // Register a command with the interpreter and map it to a path.
    defineCommandForPath(commandName, pathName = null) {
        const targetPath = pathName || commandName;
        this.commandMappings[commandName] = targetPath;
        C4C.Interpreter.define(commandName, () => {
            console.log(`[${this.scene.currentLevel}] ${commandName} command executed.`);
            this.executeCommand(commandName);
        });

        console.log(`[${this.scene.currentLevel}] Command '${commandName}' registered -> path '${targetPath}'`);
    }

    // Register a custom command that executes immediately once parsed by the runner!
    defineCustomCommand(commandName, callback) {
        C4C.Interpreter.define(commandName, callback);
    }

    // Register a custom command that gets queued with animations 
    defineQueuedCustomCommand(commandName, callback) {
        this.customCommands[commandName] = callback;
        C4C.Interpreter.define(commandName, () => {
            console.log(`[${this.scene.currentLevel}] ${commandName} queued custom command executed.`);
            this.animationExecutor.queueCustomCommand(commandName, callback);
        });
    }

    // Execute a command by looking up its path and delegating to animation executor
    executeCommand(commandName) {
        const pathName = this.commandMappings[commandName];
        if (!pathName) {
            console.warn(`[${this.scene.currentLevel}] No path mapping found for command: ${commandName}`);
            return;
        }

        if (!this.pathManager.paths[pathName]) {
            console.warn(`[${this.scene.currentLevel}] Path '${pathName}' not found for command '${commandName}'`);
            return;
        }

        this.animationExecutor.queueCommand(pathName);
    }

    // Get all registered commands (for debugging)
    getRegisteredCommands() {
        return Object.keys(this.commandMappings);
    }
}
