[[i= partials/meta]]
[[i= partials/editors]]
[[i= partials/header]]

<div id="newassignment">
    <div id="details">
        <span>
            <label for="assName">Assignment Name:</label>
            <input type="text" name="assName" id="assName"/>
        </span>
        <span>
            <label for="class">Choose class:</label>
            <select id="class" name="class">
                [[e= class in classes ]]
                    <option value="[[class]]">[[class]]</option>
                [[?==]]
            </select>
        </span>
    </div>

    <div id="assignmentFooter">
        <input type="button" value="Add task" id="addTask" />
        <input type="button" value="Submit assignment" id="subAssignment" />
    </div>
</div>

[[l= components/task]]
[[l= components/test]]
[[l= components/instr]]
<script src="../assets/js/assignment.js"></script>

[[i= partials/footer]]