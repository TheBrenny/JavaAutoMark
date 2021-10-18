[[i= partials/meta]]

[[i= partials/header]]

<div id="copyReport">

    <div class="buttonBanner">
        <button class="grey copy">
            Copy
        </button>

        <button class="green">
            CSV
        </button>

        <button class="red">
            PDF
        </button>
    </div>

    <div class="content">
        <div class="contentHead">
                <span>
                    <p>Student:</p> <p>[[report.studentID]]</p>
                </span>
                <span>
                    <p>Assignment:</p> <p>[[report.assignmentTitle]]</p>
                </span>
                
                <span>
                    <p>Mark:</p> <p>[[report.actualMarks]]/[[report.possibleMarks]]</p>
                </span>
                <span>
                    <p>Teacher comment:</p> <p>[[report.teacherComment]]</p>
                </span>
        </div>

        [[e= task in report.tasks]]
        <div class="task">
            <span>
                <p>Task [[task.taskID]]:</p> <p>[[task.actualMarks]]/[[report.tasks.0.possibleMarks]]</p>
            </span>

            [[e= test in task.tests]]
                <div class="test">
                    <p>Test [[task.taskID]].[[test.testID]]:</p>
                    <p class="desc">[[test.description]]</p>
                    <p>[[test.actualMarks]]/[[test.possibleMarks]]</p>
                </div>
            [[?==]]
        </div>
        [[?==]]
    </div>
</div>

<script src="/assets/js/reports.js"></script>

[[i= partials/footer]]