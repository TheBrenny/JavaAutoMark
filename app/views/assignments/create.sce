[[i= partials/meta]]
[[i= partials/editors]]
[[i= partials/header]]

<div id="newassignment">
    <div id="details">
        <span>
            <label for="assName">Assignment Name:</label>
            <input type="text" name="assName" id="assName" />
        </span>
        <span>
            <label for="class">Choose class:</label>
            <select id="class" name="class">
                [[e= course in courses ]]
                <option [[?=course.uuid==selectedUUID ]] selected [[?==]] value="[[course.uuid]]">
                    [[course.course_name]] - [[course.running_year]]
                </option>
                [[?==]]
            </select>
        </span>
    </div>

    <div id="assignmentFooter">
        <input type="button" disabled="true" value="Add task" id="addTask" />
        <input type="button" disabled="true" value="Submit assignment" id="subAssignment" />
    </div>
</div>

<script id="taskInjector" nonce="[[nonce]]">
    onLoad(function () {
        let tasks = JSON.parse("[[tasks]]");
        console.log(tasks);
        if (Object.keys(tasks).length === 0) {
            addTask();
        } else {
            // You're injecting tasks here using scetchInsert.
            // What the tasks object looks like is still TBA
            // once you get that, you can manipulate it to inject
        }

        $("#addTask").addEventListener("click", () => addTask());
        $("#addTask").disabled = false;
        $("#subAssignment").addEventListener("click", () => saveAssignment());
        $("#subAssignment").disabled = false;

        // // Delete this script!
        // let taskInjector = document.getElementById("taskInjector");
        // taskInjector.remove();
    });
</script>

[[l= components/task]]
[[l= components/test]]
[[l= components/instr]]
<script src="../assets/js/assignment.js"></script>

[[i= partials/footer]]