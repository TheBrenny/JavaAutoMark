[[i= partials/meta]]
[[i= partials/editors]]
[[i= partials/header]]

<div id="newassignment">
    <div id="details">
        <span>
            <label for="assName">Assignment Name:</label>
            <input type="text" name="assName" id="assName" [[?=!!assignObj.name ]] value="[[assignObj.name]]" [[?==]] />
        </span>
        <span>
            <label for="class">Choose class:</label>
            <select id="class" name="class">
                [[e= course in courses ]]
                <option [[?=course.uuid==assignObj.class ]] selected [[?==]] value="[[course.uuid]]">
                    [[course.course_name]] - [[course.running_year]]
                </option>
                [[?==]]
            </select>
        </span>
    </div>

    <div id="assignmentFooter">
        <input type="button" disabled="true" value="Add task" id="addTask" />
        [[?= isCreate ]]
            <input type="button" disabled="true" value="Submit assignment" id="subAssignment" />
        [[3=]]
            <input type="button" disabled="true" value="Update assignment" id="updateAssignment" />
        [[?==]]
    </div>
</div>

<script id="taskInjector" nonce="[[nonce]]">
    onLoad(function () {
        let assignment = JSON.parse(`[[assign]]`);
        console.log(assignment);
        if (Object.keys(assignment).length === 0) {
            addTask();
        } else {
            for (let task of assignment.tasks) {
                addTask(task.tests);
            }
        }

        let addTaskBtn = $('#addTask');
        addTaskBtn.addEventListener("click", () => addTask());
        addTaskBtn.disabled = false;
        let subAssignmentBtn = $('#subAssignment');
        subAssignmentBtn?.addEventListener("click", () => saveAssignment());
        subAssignmentBtn && (subAssignmentBtn.disabled = false);
        let updateAssignmentBtn = $('#updateAssignment');
        updateAssignmentBtn?.addEventListener("click", () => saveAssignment());
        updateAssignmentBtn && (updateAssignmentBtn.disabled = false);

        // // Delete this script!
        // let taskInjector = document.getElementById("taskInjector");
        // taskInjector.remove();
    });
</script>

[[l= components/task]]
[[l= components/test]]
[[l= components/instr]]
<script src="/assets/js/assignment.js"></script>

[[i= partials/footer]]