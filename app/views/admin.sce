[[i= partials/meta]]

[[i= partials/header]]

<div id="adminContainer">
    <div class="column" id="teachCon">
        <button id="viewTeach" class="tile btn" href="/teachers/view">
            <div class="faWrap">
                <i class="fas fa-users fa-6x"></i>
            </div>
            <h1>View Teachers</h1>
        </button>
        <button id="newTeach" class="tile btn" href="/admin/teachers/create" [[?= isAdmin ]] disabled [[?==]]>
            <div class="faWrap">
                <i class="fas fa-user-plus fa-6x"></i>
            </div>
            <h1>New Teacher</h1>
        </button>
    </div>
    <div class="separator"></div>
    <div class="column" id="classCon">
        <button id="viewClass" class="tile btn" href="/">
            <div class="faWrap">
                <i class="fas fa-chalkboard fa-6x"></i>
            </div>
            <h1>View Class</h1>
        </button>
        <button id="newClass" class="tile btn" href="/">
            <!-- Using 3x here instead of 6x is because fa doubles the size anyway! -->
            <div class="faWrap">
                <i class="fa-stack fa-3x">
                    <i class="fas fa-stack-2x fa-chalkboard"></i>
                    <i class="fas fa-stack-1x fa-plus"></i>
                </i>
            </div>
            <h1>New Class</h1>
        </button>
    </div>
    <div class="separator"></div>
    <div class="column" id="assignCon">
        <button id="viewAssign" class="tile btn" href="/assignments/view">
            <div class="faWrap">
                <i class="fas fa-award fa-6x"></i>
            </div>
            <h1>View Assignments</h1>
        </button>
        <button id="newAssign" class="tile btn" href="/assignments/create">
            <div class="faWrap">
                <i class="fas fa-6x fa-award"></i>
                <i class="fas fa-3x fa-plus"></i>
            </div>
            <h1>New Assignment</h1>
        </button>
    </div>
</div>

<div id="adminContent">

</div>

<script nonce="[[nonce]]">
    onLoad(() => {
        $$("button").forEach(btn => {
            if(btn.hasAttribute("href")) {
                btn.addEventListener("click", e => window.location.href = btn.getAttribute("href"));
            }
        });
    });
</script>

[[i= partials/footer]]