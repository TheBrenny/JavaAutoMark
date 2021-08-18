//This array will store the tasks and their components
let taskArray = [["Assignment"]];

function moveInstr(task, instr, dir) {
    let stolen = taskArray[task].splice(instr, 1)[0];
    taskArray[task].splice(instr + dir, 0, stolen);
}



//Objects that will be used in array
let instrBox = {
    taskID: null,
    order: null,
    code: `// Add instruction code here`
}

let testBox = {
    taskID: null,
    order: null,
    code: `// Add test code here`,
    expected: ``,
    description: ``,
    marks: 1,
    testID: null
}

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

    taskArray.push([]);

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
    taskArray[task.dataset.taskid].push(Object.assign({}, instrBox));


    let order = Math.max(0, ...Array.from(task.querySelectorAll(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1;
    let instruction = scetchInsert(task, "beforeEnd", scetch.instr, {
        order,
        code: `// Add instruction code here`
    });

    task.querySelectorAll(".moveUp, .moveDown").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let theDiv = e.target.parentElement.parentElement;
            let dir = e.target.classList.contains("moveUp") ? -1 : 1;

            let o = parseInt(theDiv.dataset.order);
            if (o > 1) {
                moveInstr(task.dataset.taskid, o - 1, dir);
                let swapper = task.querySelector(`[data-order="${o + dir}"]`);
                theDiv.style.order = o + dir;
                theDiv.dataset.order = o + dir;
                swapper.style.order = o;
                swapper.dataset.order = o;
            }
        });
    });

    createEditor(instruction.querySelector(".editor"));

    return instruction;
}

function addTest(task) {
    if (["number", "string"].includes(typeof task)) task = $("#task" + task);
    taskArray[task.dataset.taskid].push(Object.assign({}, testBox));

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
    addTask();
    //makeEditors();
});