[[i= partials/meta]]

[[i= partials/header]]


<form name= "createCourse" id="createCourse" method="POST" action="/admin/courses/create">
    <h3>ADD A NEW COURSE</h3>
    <input type="text" name="courseID" placeholder="Course code" />
    <input type="text" name="name" placeholder="Course name" />
    <input type="text" name="year" placeholder="Course year" />
      
    <input type="submit" name="submit" value="Add course" />
    <script type= "text/javascript"src="/assets/js/courses.js"></script>
</form>

    
[[i= partials/footer]]
