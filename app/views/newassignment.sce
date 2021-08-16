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

    <!-- [[c= components/task || taskID="1" ]] -->

    <!--THIS TYPE OF DIV WILL HANDLE TASKS-->
    <!-- <div class="task" id="task0">
        <span class="taskHead">
            <h3>Task 1</h3>
            <a href="#" alt="close">close</a>
        </span>

        <div class="instr">
            <ul>
                <li>up</li>
                <li>Instr</li>
                <li>down</li>
            </ul>
            <div class="editor"></div>
            <a href="#" class="del">del</a>
        </div>

        <div class="test">
            <ul>
                <li>up</li>
                <li>Test</li>
                <li>down</li>
            </ul>
            <div class="testCenter">
                <input class="outer case" type="text" name="" placeholder="Provide a test case" />
                <input class="outer margin small" type="text" name="" placeholder="Expected output" />
                <input class="outer small mark" type="text" name="" placeholder="Marks" />

                <input class="lower" type="text" name="" placeholder="Provide pass feedback" />
                <input class="lower" type="text" name="" placeholder="Provide fail feedback" />
            </div>
            <a href="#" class="del">del</a>
        </div>
    </div> -->
</form>

<script nonce="[[nonce]]">
    
</script>

[[l= components/task]]
[[l= components/test]]
[[l= components/instr]]
<script src="../assets/js/assignment.js"></script>

[[i= partials/footer]]