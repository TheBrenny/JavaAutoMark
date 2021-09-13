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
            <h3 class="tHead name">Name</h3>
            <h3 class="tHead course">Course</h3>
            <h3 class="tHead year">Year</h3>
            <h3 class="tHead marked">Marked</h3>
        </span>

        <span class="tCell">
            <p class="name">FIRST text 1</p>
            <p class="course">Filler text 1</p>
            <p class="year">2021</p>
            <p class="marked">Filler text 1</p> 
        </span>
    </div>
</div>

[[i= partials/footer]]