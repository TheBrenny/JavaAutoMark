[[i= partials/meta]]

[[i= partials/header]]

<div id="copyReport">

    <div class="buttonBanner">
        <button href="/assignments/submit/[[info.assignmentID]]" class="blue">
            Back to Submissions
        </button>

        <button href="/reports/[[info.assignmentID]]" class="yellow">
            Back to Whole Report
        </button>

        <button class="grey copy">
            Copy Report
        </button>

        <button href="[[url.csv]]" class="green">
            Download CSV
        </button>

        <!-- <button class="red">
            PDF
        </button> -->
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
                <p>Task [[task.taskID]]:</p> <p>[[task.actualMarks]]/[[task.possibleMarks]]</p>
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