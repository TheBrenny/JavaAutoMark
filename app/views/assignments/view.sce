[[i= partials/meta]]

[[i= partials/header]]

<div id="viewAss">
    <div id="head">
        <h1>Assignments</h1>

        <select id="course" name="course">
            <option>
                All courses
            </option>
            [[e= course in courses ]]
            <option value="[[course.uuid]]">
                [[course.course_name]] - [[course.running_year]]
            </option>
            [[?==]]
        </select>
    </div>

    <div class="table">
        <span class="tHead">
            <p class="name">Name</p>
            <p class="course">Course</p>
            <p class="year">Year</p>
            <p class="marked">Marked</p>
        </span>

        [[?= assignments == null]]
        <span class="bRow">
            No assignments found
        </span>
        [[3=]]
            [[e= assignment in assignments ]]
            <span class="tRow">
                <p class="name">[[assignment.assignment_name]]</p>
                <p class="course">[[assignment.joins.courses.course_name]]</p>
                <p class="year">[[assignment.joins.courses.running_year]]</p>
                <p class="marked">
                    <button href="/assignments/edit/[[assignment.assignment_id]]">
                        Edit
                    </button>
                    <button class="blue" href="/assignments/submit/[[assignment.assignment_id]]">
                        View
                    </button>
                </p>
            </span>
            [[?==]]
        [[?==]]
    </div>
    
    <button id="subAssignment" href="/assignments/create">
        New Assignment
    </button>

</div>

[[i= partials/footer]]