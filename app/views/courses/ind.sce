[[i= partials/meta]]

[[i= partials/header]]

<div id="indCourse">
    <h2>Course details</h2>
    <div class="wrapper" id="id" tooltip="The course ID code">
        <h3>Course code: </h3>
        <h3 class="detail">[[course.course_id]]</h3>
    </div>
    <div class="wrapper" id="name" tooltip="The name of the course">
        <h3>Course name: </h3>
        <h3 class="detail">[[course.course_name]]</h3>
    </div>
    <div class="wrapper" id="id" tooltip="The year the course is running">
        <h3>Course year: </h3>
        <h3 class="detail">[[course.running_year]]</h3>
    </div>

    <div class="wrapper buttons">
        <button class="blue" href="/courses/view">Courses</button>
        <button class="red delete" data-delete="courses, [[course.uuid]]" >Delete</button>
    </div>
</div>

[[i= partials/footer]]