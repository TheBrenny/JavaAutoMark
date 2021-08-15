[[i= partials/meta]]
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

    <!--THIS TYPE OF DIV WILL HANDLE TASKS-->
    <div class="task">
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
            <input type="text" name="" placeholder="Provide an instruction" />
            <a href="#" class="del">del</a>
        </div>

        <div class="test">
            <ul>
                <li>up</li>
                <li>Instr</li>
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
    </div>
</form>

[[i= partials/footer]]