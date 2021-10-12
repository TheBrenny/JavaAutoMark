[[i= partials/meta]]

[[i= partials/header]]

<div class="reportAssHead">
    <div class="resultTotals">
        <h1>[[report.title]]</h1>

        
    </div>

    [[?= report.tasks == null]]
        <h1>No tasks</h1>
    [[3=]]

        [[e= task in report.tasks ]]
            <div class="task">
                <h1>Task [[task.taskID]]</h1>
                <hr>
                <div class="wrapper">
                    <h3 class="title">Total possible marks:</h3>
                    <h3>[[task.possibleMarks]]</h3>
                </div>

                <div class="wrapper">
                    <h3 class="title">Average mark:</h3>
                    <h3>[[task.averageMarks]]</h3>
                </div>

                    <div class="test min">
                        <div class="testTop">
                            <h1>Test [[test.testID]]</h1>
        
                            <img class="testSwitch down" draggable="false" src="/assets/img/items/arrow_down_white.svg" alt="Move Down" />
                            <img class="testSwitch up" draggable="false" src="/assets/img/items/arrow_up_white.svg" alt="Move Down" />
                        </div>

                        <div class="testDetail">
                            <div class="">
                                <h2>Description: </h2>
                                <h2>[[test.description]]</h2>
                            </div>
                            <div class="">
                                <h2>Condition: </h2>
                                <h2>[[test.condition]]</h2>
                            </div>
                            <div class="">
                                <h2>Expected outcome: </h2>
                                <h2>[[test.expected]]</h2>
                            </div>
                            <div class="">
                                <h2>Possible marks: </h2>
                                <h2>[[test.possibleMarks]]</h2>
                            </div>
                            <div class="">
                                <h2>Average marks: </h2>
                                <h2>[[test.actualMarks]]</h2>
                            </div>
                            <div class="">
                                <h2>Students passed: </h2>
                                <h2>[[test.description]]</h2>
                            </div>
                        </div>
                    </div>
            </div>
        [[?==]]

    [[?==]]
</div>

<script src="/assets/js/reports.js"></script>

[[i= partials/footer]]