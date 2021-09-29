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

    
    <div class="marksTable">
        <span class="tHead">
            <h3 class="frontHead frontCell"></h3><!--EMPTY CELL-->
            <h3>1.1</h3>
            <h3>1.10</h3>
            <h3>1.11</h3>
            <h3>1.12</h3>
            <h3>1.13</h3>
            <h3>1.14</h3>
            <h3>1.15</h3>
            <h3>1.16</h3>
            <h3>1.17</h3>
            <h3>1.18</h3>
            <h3>1.19</h3>
        </span>

        <!-- TEMPLATE FOR INFORMATION
        <span class="sRow">
            <p class="frontCell">z5260786</p>
            <p>X.X</p>
            <p>1.10</p>
            <p>1.11</p>
            <p>1.12</p>
            <p>1.13</p>
            <p>1.14</p>
            <p>1.15</p>
            <p>1.16</p>
            <p>1.17</p>
            <p>1.18</p>
            <p>1.19</p>
        </span> -->
    </div>
</div>

<script src="/assets/js/drag.js"></script>

[[i= partials/footer]]