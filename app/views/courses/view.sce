[[i= partials/meta]]

[[i= partials/header]]

<div id="viewCourse">
    <div id="head">
        <h1>Courses</h1>

        <select id="year" name="year" filter="courseRow">
            <option>
                All years
            </option>
            [[e= year in years ]]
            <option value="[[year]]">
                [[year]]
            </option>
            [[?==]]
        </select>
    </div>

    <div class="table">
        <span class="tHead">
            <p class="id">ID</p>
            <p class="name">Name</p>
            <p class="year">Year</p>
            <p class="opt">Actions</p>
        </span>

        [[e= course in courses ]]
        <span filterTarget="courseRow" class="tRow">
            <p class="id">[[course.course_id]]</p>
            <p class="name">[[course.course_name]]</p>
            <p class="year">[[course.running_year]]</p>
            <p class="opt btns">
                <button href="/courses/ind/[[course.uuid]]">View</button>
                <button class="red delete" data-delete="courses,[[course.uuid]]">Delete</button>
            </p>
        </span>
        [[?==]]
        <span class="bRow">
            No courses found
        </span>
    </div>

    <button href="create">
        New Course
    </button>
</div>

[[i= partials/footer]]