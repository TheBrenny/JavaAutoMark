[[i= partials/meta]]

[[i= partials/header]]

<div id="viewAss">
    <div id="head">
        <h1>Assignments</h1>

        <select id="class" name="class">
            <option>
                All courses
            </option>
            [[e= course in courses ]]
            <option [[?=course.uuid==selectedUUID ]] selected [[?==]] value="[[course.uuid]]">
                [[course.course_name]] - [[course.running_year]]
            </option>
            [[?==]]
        </select>
    </div>

    <div id="table">
        <span class="tHead">
            <h3 class="name">Name</h3>
            <h3 class="course">Course</h3>
            <h3 class="year">Year</h3>
            <h3 class="marked">Marked</h3>
        </span>

        [[e= assignment in assignments ]]
        <span class="tCell">
            <p class="name">[[assignment.assignment_name]]</p>
            <p class="course">[[assignment.joins.courses.course_name]]</p>
            <p class="year">[[assignment.joins.courses.running_year]]</p>
            <p class="marked">No</p>
        </span>
        [[?==]]
    </div>
</div>

[[i= partials/footer]]