[[i= partials/meta]]

[[i= partials/header]]

<div id="submitAss">
    <div class="block details">
        <h1 class="title">[[assignment.assignment_name]]</h1>
        <h1 class="course">[[assignment.joins.courses.course_name]] // [[assignment.joins.courses.running_year]]</h1>
    </div>

    <div class="metaAss">
        <p class="block content">[[taskCount]] tasks, [[testCount]] tests, [[markCount]] marks </p>

        <button class="blue" type="button" href="/assignments/edit/[[assignment.assignment_id]]">Edit</button>
        <button class="yellow" type="button" href="/reports/[[assignment.assignment_id]]">Report</button>
    </div>

    <form id="inputBox" class="inputBox">
        <i class="upload-icon far fa-8x fa-file-archive"></i>
        <input class="inputFile" type="file" name="file" id="file" multiple directory webkitdirectory mozdirectory odirectory msdirectory />
        <label for="file"><strong>Choose a folder</strong><span class="dropText"> or drag and drop</span></label>
        <progress id="progressBar" hidden></progress>
        <div class="status"></div>
    </form>


    <div id="markingTable" class="table">

    </div>
</div>

<script nonce="[[nonce]]">
    onReady(() => {
        globalThis.websockUrl = "[[websockUrl]]".trim();
    });
</script>
<script src="/assets/js/drag.js"></script>
<script src="/assets/js/clientAssignmentSocket.js"></script>

[[l= assignments/components/submitRow ]]
[[l= assignments/components/submitTableHeader ]]
[[i= partials/footer]]