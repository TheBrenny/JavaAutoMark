[[i= partials/meta]]

[[i= partials/header]]

<div id="viewAss">
    <div id="head">
        <h1>Assignments</h1>

        <select id="year" name="year" filter="assRow">
            <option value="">
                All years
            </option>
            [[e= year in years ]]
            <option value="[[year]]">
                [[year]]
            </option>
            [[?==]]
        </select>
        <select id="course" name="course" filter="assRow">
            <option value="">
                All courses
            </option>
            [[e= course in courseOpts ]]
            <option value="[[course]]">
                [[course]]
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

        [[e= assignment in assignments ]]
            <span filterTarget="assRow" class="tRow">
                <p class="name">[[assignment.assignment_name]]</p>
                <p class="course">[[assignment.joins.courses.course_name]]</p>
                <p class="year">[[assignment.joins.courses.running_year]]</p>
                <p class="marked">
                    <button href="/assignments/edit/[[assignment.assignment_id]]">
                        Edit
                    </button>
                    <button class="blue" href="/assignments/submit/[[assignment.assignment_id]]">
                        Submissions
                    </button>
                    [[?= assignment.marked]]
                    <!-- FIXME: This actually won't ever work, because
                        assignment.marked isn't the correct variable! -->
                        <button class="yellow" href="/reports/[[assignment.assignment_id]]">
                            Mark
                        </button>
                    [[?==]]
                </p>
            </span>
        [[?==]]
        <span class="bRow">
            No assignments found
        </span>
    </div>
    
    <button id="subAssignment" href="/assignments/create">
        New Assignment
    </button>

</div>

[[i= partials/footer]]