// The following gets the sorted order of instructions and tests based on the order css style:
function sortTask(task) {
    return Array.from(task.querySelectorAll(".test, .instr")).sort((a, b) => a.dataset.order - b.dataset.order);
}

function moveInstrAndTest(task, event) {

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
    let tasks = Array.from($("#newassignment").querySelectorAll(".task"));
    let lastTask = (tasks.length > 0) ? tasks[tasks.length - 1] : null;

    let taskNum = 1;
    if (lastTask === null)
        lastTask = $("#newassignment>#details");
    else taskNum = parseInt(lastTask.id.substring("task".length)) + 1;

    let task = scetchInsert(lastTask, "afterEnd", scetch.task, {
        taskID: taskNum
    });
    makeEditors();

    addInstruction(taskNum); // this is commented out because the task scetch loads the instruction code
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

    instruction.querySelectorAll(".del").forEach(btn => {
        btn.addEventListener("click", deleteItem.bind(this, task, order));
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

    test.querySelectorAll(".del").forEach(btn => {
        btn.addEventListener("click", deleteItem.bind(this, task, order));
    });

    createEditor(test.querySelector(".editor"));

    return test;
}

function deleteItem(task, order) {
    if (["number", "string"].includes(typeof task)) task = $("#task" + task);
    let maxItem = Math.max(0, ...Array.from(task.querySelectorAll(".test, .instr")).map(e => parseInt(e.dataset.order)));
    let toDelete = task.querySelector(`[data-order="${order}"]`);
    
    toDelete.remove();

    for(var i = order + 1; i <= maxItem; i++) {
        let toMove = task.querySelector(`[data-order="${i}"]`);
        
        toMove.dataset.order--;
        toMove.style.order = toMove.dataset.order;

        if(toDelete.classList.contains("test") && toMove.classList.contains("test") ) {
            toMove.dataset.testid--;
            toMove.querySelector(".testID").innerHTML = "Test " + toMove.dataset.testid;
        }
    }
}

// === Edit Tasks and stuff ===
load(function () {
    addTask();

    $("#addTask").addEventListener("click", addTask.bind(this));
});