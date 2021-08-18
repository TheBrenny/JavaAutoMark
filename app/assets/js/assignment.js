// The following gets the sorted order of instructions and tests based on the order css style:
function sortTask(task) {
    return Array.from(task.querySelectorAll(".test, .instr")).sort((a, b) => a.dataset.order - b.dataset.order);
}

function moveInstrAndTest(task, event) {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    event.cancelBubble = true;

    let theDiv = event.target.parentElement.parentElement;
    let dir = event.target.classList.contains("moveUp") ? -1 : 1;
    let maxInstruction = Math.max(0, ...Array.from(task.querySelectorAll(".test, .instr")).map(e => parseInt(e.dataset.order)));
    
    let o = parseInt(theDiv.dataset.order);
    if (o + dir > 0 && o + dir <= maxInstruction) {
        let swapper = task.querySelector(`[data-order="${o + dir}"]`);
        theDiv.style.order = o + dir;
        theDiv.dataset.order = o + dir;
        swapper.style.order = o;
        swapper.dataset.order = o;

        if(theDiv.classList.contains("test") && swapper.classList.contains("test") ) {
            let tmp= theDiv.dataset.testid;
            theDiv.querySelector(".testID").innerHTML = "Test" + swapper.dataset.testid;
            theDiv.dataset.testid = swapper.dataset.testid;
            swapper.querySelector(".testID").innerHTML = "Test" + tmp;
            swapper.dataset.testid = tmp;
        }
    }
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

    addTest(taskNum); // this is commented out because the task scetch loads the instruction code
    // Add handlers to the add buttons
    task.querySelectorAll(".addInstruction").forEach(btn => {
        btn.addEventListener("click", () => addInstruction(task));
    });
    task.querySelectorAll(".addTest").forEach(btn => {
        btn.addEventListener("click", () => addTest(task));
    });

    return task;
}

function addInstruction(task) {
    if (["number", "string"].includes(typeof task)) task = $("#task" + task);

    let order = Math.max(0, ...Array.from(task.querySelectorAll(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1;
    let instruction = scetchInsert(task, "beforeEnd", scetch.instr, {
        order,
        code: `// Add instruction code here`
    });
    instruction.style.order = order;

    instruction.querySelectorAll(".moveUp, .moveDown").forEach(btn => {
        btn.addEventListener("click", moveInstrAndTest.bind(this, task));
    });

    createEditor(instruction.querySelector(".editor"));

    return instruction;
}

function addTest(task) {
    if (["number", "string"].includes(typeof task)) task = $("#task" + task);

    let order = Math.max(0, ...Array.from(task.querySelectorAll(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1;
    let testID = Math.max(0, ...Array.from(task.querySelectorAll(".test")).map(e => e.dataset.testid)) + 1;
    let test = scetchInsert(task, "beforeEnd", scetch.test, {
        order,
        code: `// Add test code here`,
        expected: ``,
        description: ``,
        marks: 1,
        testID
    });
    test.style.order = order;

    test.querySelectorAll(".moveUp, .moveDown").forEach(btn => {
        btn.addEventListener("click", moveInstrAndTest.bind(this, task));
    });

    createEditor(test.querySelector(".editor"));

    return test;
}

// === Edit Tasks and stuff ===
load(function () {
    addTask();
    //makeEditors();
});