// LevelHelper.js
// Utility class to abstract common level setup and UI logic for C4C SortingGame levels

export default class LevelHelper {
  static initializeEditorWindow(scene, initialText = "") {
    C4C.Editor.Window.init(scene);
    C4C.Editor.Window.open();
    if (initialText) C4C.Editor.setText(initialText);
    console.log(`[${scene.currentLevel}] Text editor initialized.`);
  }

  static createIncrementalCommands(pathManager, commands) {
    // commands: { moveLeft: fn, moveRight: fn, ... }
    for (const [name, fn] of Object.entries(commands)) {
      pathManager.defineIncrementalCommand(name, fn);
    }
  }

  static onCandySuccess(scene, candy) {
    console.log(
      `[${scene.currentLevel}] Candy ${candy.type} successfully sorted!`,
    );
    // Extend or override in level if needed
  }

  static onCandyFailed(scene, candy, position) {
    console.log(
      `[${scene.currentLevel}] Candy ${candy.type} failed! Position:`,
      position,
    );
    alert(`Candy ${candy.type} is not in the correct position! Try again.`);
    // Extend or override in level if needed
  }

  static defineInterpreterCommands(commandManager, custom = {}) {
    commandManager.defineIncrementalCommand("moveLeft");
    commandManager.defineIncrementalCommand("moveRight");
    commandManager.defineIncrementalCommand("moveUp");
    commandManager.defineIncrementalCommand("moveDown");
    commandManager.defineDumpCandyCommand();
    // Add any custom commands
    if (custom.immediate) {
      for (const [name, fn] of Object.entries(custom.immediate)) {
        commandManager.defineCustomCommand(name, fn);
      }
    }
    if (custom.queued) {
      for (const [name, fn] of Object.entries(custom.queued)) {
        commandManager.defineQueuedCustomCommand(name, fn);
      }
    }
  }

  static initializeRunCodeButton(
    scene,
    setupLevelCandies,
    animationExecutor,
    queueManager,
  ) {
    document.getElementById("enableCommands").addEventListener("click", () => {
      let programText = C4C.Editor.getText();
      console.log(
        `[${scene.currentLevel}] Run button clicked. Program text: ${programText}`,
      );
      setupLevelCandies();
      animationExecutor.reset();
      if (queueManager && typeof queueManager.reset === "function") {
        queueManager.reset();
      }
      C4C.Interpreter.run(programText);
      if (queueManager && typeof queueManager.startExecution === "function") {
        queueManager.startExecution();
      } else {
        animationExecutor.executeNextCommand();
      }
    });
  }

  static initializeResetButton(
    scene,
    setupLevelCandies,
    animationExecutor,
    queueManager,
  ) {
    let resetBtn = document.getElementById("resetLevel");
    if (!resetBtn) {
      resetBtn = document.createElement("button");
      resetBtn.id = "resetLevel";
      resetBtn.innerText = "Reset Level";
      resetBtn.style.margin = "8px";
      document.body.appendChild(resetBtn);
    }
    resetBtn.addEventListener("click", () => {
      console.log(`[${scene.currentLevel}] Reset Level button clicked.`);
      setupLevelCandies();
      animationExecutor.reset();
      if (queueManager && typeof queueManager.reset === "function") {
        queueManager.reset();
      }
    });
  }

  static resetLevel(scene, setupLevelCandies, animationExecutor, queueManager) {
    setupLevelCandies();
    animationExecutor.reset();
    if (queueManager && typeof queueManager.reset === "function") {
      queueManager.reset();
    }
  }
}
