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
            <span class="tRow">
                <p class="zID">[[teacher.zid]]</p>
                <p class="fName">[[teacher.fname]]</p>
                <p class="lName">[[teacher.lname]]</p>
                
                <p class="buttons">
                    <button href="/teachers/view/[[teacher.zid]]">
                        View
                    </button>
                    [[?= user.admin || user.zid == teacher.zid]]
                        <button class="blue" href="/teachers/edit/[[teacher.zid]]">
                            Edit
                        </button>
                    [[?==]]
                    </p>
                </span>
            [[?==]]
        [[?==]]

           
    </div>
    
    <button id="addTeacher" href="/teachers/create">
        New Teacher
    </button>

</div>

[[i= partials/footer]]