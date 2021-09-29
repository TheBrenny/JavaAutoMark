// The following gets the sorted order of instructions and tests based on the order css style:
function sortTask(task) {
    if(["number", "string"].includes(typeof task)) task = $("#task" + task);
    return Array.from(task.$$(".test, .instr")).sort((a, b) => a.dataset.order - b.dataset.order);
}

function bindActions(task, elem) {
    elem.$$(".moveUp, .moveDown").forEach(btn => {
        btn.addEventListener("click", (e) => moveItem(task, e.currentTarget));
    });
    elem.$(".del").addEventListener("click", (e) => deleteItem(task, e.currentTarget));
}

// === New Tasks and stuff ===
function addTask(items) {
    let tasks = Array.from($("#newassignment").$$(".task"));
    let lastTask = (tasks.length > 0) ? tasks[tasks.length - 1] : null;

    let taskNum = 1;
    if(lastTask === null)
        lastTask = $("#newassignment>#details");
    else taskNum = parseInt(lastTask.id.substring("task".length)) + 1;

    let task = scetchInsert(lastTask, "afterEnd", scetch.task, {
        taskID: taskNum
    });

    if(items === undefined) addInstruction(taskNum);
    else if(Array.isArray(items)) {
        items.forEach(item => {
            if(item.testID !== undefined) addTest(task, item);
            else addInstruction(task, item);
        });
    } else {
        console.error("Something went wrong. items isn't an array or undefined: ");
        console.error(items);
        notifier.notify("Something went wrong. (items had an unexpected type)", "error");
        throw new Error("Something went wrong. items isn't an array or undefined.");
    }

    // Add handlers to the buttons
    task.$(".addInstruction").addEventListener("click", () => addInstruction(task));
    task.$(".addTest").addEventListener("click", () => addTest(task));
    task.$(".addException").addEventListener("click", () => addException(task));
    task.$(".del").addEventListener("click", (e) => deleteTask(task));

    return task;
}

function addInstruction(task, defaults) {
    if(["number", "string"].includes(typeof task)) task = $("#task" + task);

    defaults = Object.assign({
        order: Math.max(0, ...Array.from(task.$$(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1,
        code: `// This is valid Java code!\n// Don't forget your semicolons!`
    }, defaults || {});

    let instruction = scetchInsert(task, "beforeEnd", scetch.instr, defaults);
    instruction.style.order = defaults.order;
    bindActions(task, instruction);

    let e = createEditor(instruction.$(".editor"));
    bindSaveAction(e, saveAssignment);

    return instruction;
}

function addTest(task, defaults) {
    if(["number", "string"].includes(typeof task)) task = $("#task" + task);

    defaults = Object.assign({
        order: Math.max(0, ...Array.from(task.$$(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1,
        testID: Math.max(0, ...Array.from(task.$$(".test")).map(e => e.dataset.testid)) + 1,
        code: `// This is a valid Java variable or expression! Don't use semicolons!`,
        expected: ``,
        description: ``,
        marks: 1
    }, defaults || {});

    let test = scetchInsert(task, "beforeEnd", scetch.test, defaults);
    test.style.order = defaults.order;
    bindActions(task, test);

    let e = createEditor(test.$(".editor"));
    bindSaveAction(e, saveAssignment);

    return test;
}

function addException(task, defaults) {
    if(["number", "string"].includes(typeof task)) task = $("#task" + task);

    defaults = Object.assign({
        order: Math.max(0, ...Array.from(task.$$(".test, .instr")).map(e => parseInt(e.dataset.order))) + 1,
        testID: Math.max(0, ...Array.from(task.$$(".test")).map(e => e.dataset.testid)) + 1,
        code: `//This is an expression for a try/catch statement! Don't use semicolons`,
        expected: ``,
        description: ``,
        marks: 1
    }, defaults || {});

    let exc = scetchInsert(task, "beforeEnd", scetch.exception, defaults);
    exc.style.order = defaults.order;
    bindActions(task, exc);

    let e = createEditor(exc.$(".editor"));
    bindSaveAction(e, saveAssignment);

    return exc;
}

function moveItem(task, target) {
    let theDiv = target.$up(".instr, .test");
    let dir = target.classList.contains("moveUp") ? -1 : 1;
    let maxInstruction = Math.max(0, ...Array.from(task.$$(".test, .instr")).map(e => parseInt(e.dataset.order)));

    let o = parseInt(theDiv.dataset.order);
    if(o + dir > 0 && o + dir <= maxInstruction) {
        let swapper = task.$(`[data-order="${o + dir}"]`);
        theDiv.style.order = o + dir;
        theDiv.dataset.order = o + dir;
        swapper.style.order = o;
        swapper.dataset.order = o;

        if(theDiv.classList.contains("test") && swapper.classList.contains("test")) {
            let tmp = theDiv.dataset.testid;
            theDiv.$(".testID").innerText = "Test " + swapper.dataset.testid;
            theDiv.dataset.testid = swapper.dataset.testid;
            swapper.$(".testID").innerText = "Test " + tmp;
            swapper.dataset.testid = tmp;
        }
    }
}

function deleteTask(task) {
    if(["number", "string"].includes(typeof task)) task = $("#task" + task);
    // let maxItem = Math.max(0, ...Array.from($$(".task")).map(e => parseInt(e.dataset.taskid)));

    task.remove();

    // decrement each .task's taskid data attribute by 1 if it is greater than the deleted task
    $$(".task").forEach(e => {
        let taskID = parseInt(e.dataset.taskid);
        if(taskID > parseInt(task.dataset.taskid)) {
            let newID = taskID - 1;
            e.dataset.taskid = newID;
            e.id = "task" + newID;
            e.$(".taskHead > h3").innerText = "Task " + newID;
        }
    });
}

function deleteItem(task, target) {
    let order = parseInt(target.$up(".instr, .test").dataset.order);
    if(["number", "string"].includes(typeof task)) task = $("#task" + task);
    let maxItem = Math.max(0, ...Array.from(task.$$(".test, .instr")).map(e => parseInt(e.dataset.order)));
    let toDelete = task.$(`[data-order="${order}"]`);

    toDelete.remove();

    for(var i = order + 1; i <= maxItem; i++) {
        let toMove = task.$(`[data-order="${i}"]`);

        toMove.dataset.order--;
        toMove.style.order = toMove.dataset.order;

        if(toDelete.classList.contains("test") && toMove.classList.contains("test")) {
            toMove.dataset.testid--;
            toMove.$(".testID").innerHTML = "Test " + toMove.dataset.testid;
        }
    }
}

function saveAssignment(editID) {
    let assignment = $("#newassignment");

    let assignmentName = assignment.$("#assName").value;
    let assignmentClass = assignment.$("#class").value;

    let assignmentDetails = {
        name: assignmentName,
        class: assignmentClass,
        tasks: []
    };

    let tasks = assignment.$$(".task");

    for(let task of tasks) {
        let taskDetails = {
            taskID: parseInt(task.dataset.taskid),
            tests: []
        };

        for(let item of task.$$(".instr, .test")) {
            let itemDetails = {};
            itemDetails = {
                order: parseInt(item.dataset.order),
                code: getEditor(item.$(".editor").getAttribute("editor-id")).getValue(),
            };
            if(item.classList.contains("test")) {
                Object.assign(itemDetails, {
                    expected: item.$(`input[name="expectedOutput"]`).value,
                    description: item.$(`input[name="description"]`).value,
                    marks: parseInt(item.$(`input[name="marks"]`).value),
                    testID: parseInt(item.dataset.testid)
                });
            }
            taskDetails.tests.push(itemDetails);
        }

        taskDetails.tests.sort((a, b) => a.order - b.order);
        assignmentDetails.tasks.push(taskDetails);
    }

    let url = !!editID ? "edit/" + editID : "create";
    let method = !!editID ? "PUT" : "POST";

    return fetch("/assignments/" + url, {
        method: method,
        body: JSON.stringify(assignmentDetails),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async r => {
        if(r.status === 201) {
            return r.headers.get("Location");
        } else if(r.status === 200) {
            return await r.json();
        } else {
            throw await r.json();
        }
    }).then((response) => {
        if(typeof response === "string") { // we have a location
            notifier.notify("Saved successfully. Redirecting...", "success");
            window.location = response;
        } else if(typeof response === "object") { // we have a JSON object
            console.log(response);
            notifier.notify(response.message, response.type || "success");
        } else {
            throw response;
        }
    }).catch(e => {
        console.error(e);
        notifier.notify("Error: " + e.message, "error");
    });
}