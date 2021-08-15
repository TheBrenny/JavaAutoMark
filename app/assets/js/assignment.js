var i = '<div class="instr">'
        + '<ul>'
            + '<li>up</li>'
            + '<li>Instr</li>'
            + '<li>down</li>'
        + '</ul>'
        + '<div class="editor"></div>'
        + '<a href="#" class="del">del</a>'
        + '</div>';

var t = '<div class="test">'
        + '<ul>'
            + '<li>up</li>'
            + '<li>Test</li>'
            + '<li>down</li>'
        + '</ul>'
        + '<div class="testCenter">'
            + '<input class="outer case" type="text" name="" placeholder="Provide a test case" />'
            + '<input class="outer margin small" type="text" name="" placeholder="Expected output" />'
            + '<input class="outer small mark" type="text" name="" placeholder="Marks" />'

            + '<input class="lower" type="text" name="" placeholder="Provide pass feedback" />'
            + '<input class="lower" type="text" name="" placeholder="Provide fail feedback" />'
        + '</div>'
        + '<a href="#" class="del">del</a>'
        + '</div>';

var head = '<span class="taskHead">'
        + '<h3>Task 1</h3>'
        + '<a href="#" alt="close">close</a>'
        + '</span>';

const tasks = [[i, t], [i]];

function newTaskElement(index) {
    var newTask = '<div class="task" id="task' + index + '">' + head + '</div>';
    console.log(newTask);
    return newTask;
}



function printTasks() {
    for (var i = 0; i < tasks.length; i++) {
        var element = document.getElementById("task" + i);
        console.log(element);
        if(element) {
            element.innerHTML = "";
            for(var j = 0; j < tasks[i].length; j++) {
                var parent = document.getElementById("task" + i);
                    parent.innerHTML += tasks[i][j];
            }
        } else {
            var parent = document.getElementById("newassignment");
            parent.innerHTML += newTaskElement(i);

            for(var j = 0; j < tasks[i].length; j++) {
                var child = document.getElementById("task" + i);
                child.innerHTML += tasks[i][j];
            }
        }
    }

    makeEditors();
}
