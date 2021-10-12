[[i= partials/meta]]

[[i= partials/header]]

<div class="reportAssHead">
    <div class="resultTotals">
        <h1>[[report.totalStudents]]</h1>

        
    </div>

    [[?= report.tasks == null]]
            <h1>No tasks</h1>
        [[3=]]

            [[e= task in report.tasks ]]
            <div class="resultTotals">
                <h1>Task: [[task.taskID]]</h1>
                <h1>Task possible marks: [[task.possibleMarks]]</h1>
                <h1>Task average marks: [[task.averageMarks]]</h1>          
            </div>
            [[?==]]

        [[?==]]
</div>

[[i= partials/footer]]