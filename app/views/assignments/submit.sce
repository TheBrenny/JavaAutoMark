[[i= partials/meta]]

[[i= partials/header]]

<div id="submitAss">
    <div class="block details">
        <h1 class="title">[[assignment.assignment_name]]</h1>
        <h1 class="class">[[assignment.joins.courses.course_name]] // [[assignment.joins.courses.running_year]]</h1>
    </div>

    <div class="metaAss">
        <p class="block content">3 tasks, 18 tests, 32 marks</p>

        <input class="edit" type="button" value="Edit" />
    </div>

    <form class="inputBox">
        <i class="upload-icon far fa-8x fa-file-archive"></i>
        <input class="inputFile" type="file" name="file" id="file" multiple directory webkitdirectory mozdirectory odirectory msdirectory />
        <label for="file"><strong>Choose a file</strong><span class="dropText"> or drag and drop</span></label>
        <progress id="progressBar" hidden></progress>
        <div class="uploading">Uploading...</div>
        <div class="success">Done!</div>
        <div class="error">Error!</div>
    </form>

    
    <div class="table">
        <span class="tHead">
            <p class="frontCell">STUDENTS</p>
            [[f= task 1:3 ]]
                [[f= test 1:10 ]]
                    <p tooltip="Task [[task]] - Test [[test]]">[[task]].[[test]]</p>
                [[?==]]
            [[?==]]
        </span>

        [[f= student 10:30 ]]
            <span class="tRow">
                <p class="frontCell">z00000[[student]]</p>
                [[f= task 1:3 ]]
                    [[f= test 1:10 ]]
                        <p>[[task]].[[test]]</p>
                    [[?==]]
                [[?==]]
            </span>
        [[?==]]
    </div>
</div>

<script src="/assets/js/drag.js"></script>

[[i= partials/footer]]