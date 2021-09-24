[[i= partials/meta]]

[[i= partials/header]]

<div id="adminContainer">
    <div class="column" id="teachCon">
        <button id="viewTeach" class="tile " href="/teachers/view">
            <div class="faWrap">
                <i class="fas fa-users fa-6x"></i>
            </div>
            <h2>View Teachers</h2>
        </button>
        <button id="newTeach" class="tile " [[?= !user.admin ]] disabled [[3=]] href="/admin/teachers/create" [[?==]]>
            <div class="faWrap">
                <i class="fas fa-user-plus fa-6x"></i>
            </div>
            <h2>New Teacher</h2>
        </button>
    </div>
    <vr></vr>
    <div class="column" id="classCon">
        <button id="viewClass" class="tile " href="/">
            <div class="faWrap">
                <i class="fas fa-chalkboard fa-6x"></i>
            </div>
            <h2>View Class</h2>
        </button>
        <button id="newClass" class="tile " href="/">
            <!-- Using 3x here instead of 6x is because fa doubles the size anyway! -->
            <div class="faWrap">
                <i class="fa-stack fa-3x">
                    <i class="fas fa-stack-2x fa-chalkboard"></i>
                    <i class="fas fa-stack-1x fa-plus"></i>
                </i>
            </div>
            <h2>New Class</h2>
        </button>
    </div>
    <vr></vr>
    <div class="column" id="assignCon">
        <button id="viewAssign" class="tile " href="/assignments/view">
            <div class="faWrap">
                <i class="fas fa-award fa-6x"></i>
            </div>
            <h2>View Assignments</h2>
        </button>
        <button id="newAssign" class="tile " href="/assignments/create">
            <div class="faWrap">
                <i class="fas fa-6x fa-award"></i>
                <i class="fas fa-3x fa-plus"></i>
            </div>
            <h2>New Assignment</h2>
        </button>
    </div>
</div>

<div id="adminContent">

</div>

[[i= partials/footer]]