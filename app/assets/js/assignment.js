// The following gets the sorted order of instructions and tests based on the order css style:
function sortTask(task) {
    return Array.from(task.querySelectorAll(".test, .instr")).sort((a, b) => a.dataset.order - b.dataset.order);
}

// === New Tasks and stuff ===
function addTask() {
    let lastTask = $(".task:last-of-type"); // $ is referenced in app/assets/js/script.js which is included in the meta partial
    let taskNum = 1;
    if (lastTask === null)
        lastTask = $("#newassignment>#details");
    else taskNum = parseInt(lastTask.id.substring("task".length)) + 1;

    let task = scetchInsert(lastTask, "afterEnd", scetch.task, {
        taskID: taskNum
    });
    makeEditors();

    // addInstruction(task); // this is commented out because the task scetch loads the instruction code

    return task;
}

function addInstruction(task) {
    if (["number", "string"].includes(typeof task)) task = $("#task" + task);

    let order = Math.max(Array.from(task.querySelectorAll(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1;
    let instruction = scetchInsert(task, "beforeEnd", scetch.instr, {
        order,
        code: `// Add instruction code here`
    });

    createEditor(instruction.querySelector(".editor"));

    return instruction;
}

function addTest(task) {
    if (["number", "string"].includes(typeof task)) task = $("#task" + task);

    let order = Math.max(Array.from(task.querySelectorAll(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1;
    let testID = Math.max(Array.from(task.querySelectorAll(".test")).map(e => e.dataset.testid)) + 1;
    let test = scetchInsert(task, "beforeEnd", scetch.test, {
        order,
        code: `// Add test code here`,
        expected: ``,
        description: ``,
        marks: 1,
        testID
    });

    createEditor(test.querySelector(".editor"));

    return test;
}

// === Edit Tasks and stuff ===
load(function () {
    makeEditors();
});