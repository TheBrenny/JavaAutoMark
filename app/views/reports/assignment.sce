[[i= partials/meta]]

[[i= partials/header]]

<div class="reportAssHead">
    <div class="resultTotals">
        [[e= task in report.tasks ]]
            [[e= test in task.tests ]]
                [[test.testID]]
            [[?==]]
        [[?==]]
    </div>
</div>

[[i= partials/footer]]