export default class CommandManager {
    constructor(scene, pathManager, animationExecutor) {
        this.scene = scene;
        this.pathManager = pathManager;
        this.animationExecutor = animationExecutor;
        this.commandMappings = {}; // Initialize command mappings
        this.customCommands = {}; // Initialize custom commands
    }
        // Define incremental movement commands
    defineIncrementalCommand(commandName) {
        C4C.Interpreter.define(commandName, () => {
            const newPosition = this.pathManager.executeIncrementalCommand(commandName);
            this.animationExecutor.queueMovementToPosition(newPosition);
            console.log(`[CommandManager] Incremental command '${commandName}' executed, new position:`, newPosition);
        });
    }

        // Define the dumpCandy command
    defineDumpCandyCommand() {
        C4C.Interpreter.define('dumpCandy', () => {
            this.animationExecutor.queueCandyDump();
            console.log(`[CommandManager] dumpCandy command queued`);
        });
    }

    //Register a custom command that executes immediately once parsed by the runner!
    defineCustomCommand(commandName, callback) {
        C4C.Interpreter.define(commandName, callback);
    }

    //Register a custom command that gets queued with animations 
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
