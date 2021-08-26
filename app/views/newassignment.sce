[[i= partials/meta]]
[[i= partials/editors]]
[[i= partials/header]]


<form id="newassignment" method="POST" action="newassignment">
    
    <!--THIS DIV HANDLES THE UNIVERSAL DETAILS OF THE ASSIGNMENT-->
    <div id="details">
        <span>
            <label for="assName">Assignment title:</label>
            <input type="text" name="assName" />
        </span>
        <span>
            <label for="class">Choose class:</label>
            <select id="class" name="class">
                <option value="ZEIT1">ZEIT1</option>
                <option value="ZEIT2">ZEIT2</option>
                <option value="ZEIT3">ZEIT3</option>
                <option value="ZEIT4">ZEIT4</option>
            </select>
        </span>
    </div>
    
    <div id="assignmentFooter">
        <input type="button" value="Add task" id="addTask" />

        <input type="button" value="Submit assignment" id="subAssignment"/>
    </div>
</form>

<script nonce="[[nonce]]">
    
</script>

[[l= components/task]]
[[l= components/test]]
[[l= components/instr]]
<script src="../assets/js/assignment.js"></script>

[[i= partials/footer]]