[[i= partials/meta]]

[[i= partials/header]]

<div id="viewAss">
    <div id="head">
        <h1>Teachers</h1>

        <select id="teacher" name="teacher">
            <option>
                All teachers
            </option>
           
        </select>
    </div>

    <div class="table">
        <span class="tHead">
            <p class="zid">Z ID</p>
            <p class="fName">First Name</p>
            <p class="lName">Last Name</p>
        </span>

        [[?= teachers == null ]]
        <span class="bRow">
            No Teachers Found
        </span>
        [[3=]]
            [[e= teacher in teachers ]]
            <span class="tRow">
                <p class="zid">[[zid]]</p>
                <p class="fName">[[fName]]</p>
                <p class="lName">[[lName]]</p>
                
                    <button href="/teachers/edit/[[teacher.teacher_id]]">
                        Edit
                    </button>
                    <button class="blue" href="/teachers/submit/[[teacher.teacher_id]]">
                        View
                    </button>
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