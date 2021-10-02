[[i= partials/meta]]

[[i= partials/header]]

<div id="viewCourse">
    <div class="table">
        <span class="tHead">
            <p class="id">ID</p>
            <p class="name">Name</p>
            <p class="code">Year</p>
            <p class="opt">Actions</p>
        </span>

        [[?= courses == null]]
        <span class="bRow">
            No courses found
        </span>
        [[3=]]
            [[e= course in courses ]]
            <span class="tRow">
                <p class="id">[[course.course_id]]</p>
                <p class="name">[[course.course_name]]</p>
                <p class="code">[[course.running_year]]</p>
                <p class="opt btns">
                    <button>View</button>
                    <button class="red">Delete</button>
                </p>
            </span>
            [[?==]]
        [[?==]]
    </div>

    <button href="create">
        New Class
    </button>
</div>

[[i= partials/footer]]