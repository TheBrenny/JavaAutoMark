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
            <label for="course">Choose course:</label>
            <select id="course" name="course">
                [[e= course in courses ]]
                <option [[?=course.uuid==assignObj.course ]] selected [[?==]] value="[[course.uuid]]">
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
            <input type="button" class="blue" value="Submissions" href="/assignments/submit/[[assignObj.id]]" />
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

        let saveAction = saveAssignment;
        let saveButton = $('#subAssignment, #updateAssignment');
        saveButton?.addEventListener("click", () => saveAction());
        saveButton && (saveButton.disabled = false);

        document.addEventListener("keydown", (e) => {
            if (e.key === "s" && e.ctrlKey) {
                e.preventDefault();
                saveAction();
            }
        });
    });
</script>

[[l= components/task]]
[[l= components/test]]
[[l= components/exception]]
[[l= components/instr]]
<script src="/assets/js/assignment.js"></script>

[[i= partials/footer]]