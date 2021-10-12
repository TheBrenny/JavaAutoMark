[[i= partials/meta]]

[[i= partials/header]]

<div id="viewTeach">
    <div id="head">
        <h1>Teachers</h1>
    </div>

    <div class="table">
        <span class="tHead">
            <p class="zID">zID</p>
            <p class="fName">First Name</p>
            <p class="lName">Last Name</p>
            <p class="opts">Options</p>
        </span>

        [[?= teachers == null]]
            <span class="bRow">
                No Teachers Found
            </span>
        [[3=]]
            [[e= teacher in teachers]]
                [[?= user.admin]]
                    <span class="tRow">
                        <p class="zID">[[teacher.zid]]</p>
                        <p class="fName">[[teacher.fname]]</p>
                        <p class="lName">[[teacher.lname]]</p>
                        
                        <p class="buttons">
                            <button href="/teachers/edit/[[teacher.teacher_id]]">
                                Edit
                            </button>
                            <button class="blue" href="/teachers/submit/[[teacher.teacher_id]]">
                                View
                            </button>
                        </p>
                    </span>
                [[3=]]
                    [[?= teacher.zid != 0]]
                        <span class="tRow">
                            <p class="zID">[[teacher.zid]]</p>
                            <p class="fName">[[teacher.fname]]</p>
                            <p class="lName">[[teacher.lname]]</p>
                            
                            <p class="buttons">
                                <button class="green" href="/teachers/submit/[[teacher.teacher_id]]">
                                    View
                                </button>
                            </p>
                        </span>
                    [[?==]]
                [[?==]]
            [[?==]]
        [[?==]]

           
    </div>
    
    <button id="addTeacher" href="/teachers/create">
        New Teacher
    </button>

</div>

[[i= partials/footer]]