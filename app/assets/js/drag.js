var dropEnabled = function() {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;    
}();

var form = $(".inputBox");

function drag(type) {

    if(type) {
        border.classList.add('file-over');
    } else {
        border.classList.remove('file-over');
    }
}

if(dropEnabled) {
    form.classList.add('enabled');

    var droppedFile = false;

    var border = $('.inputBox');

    var events = ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"];

    events.forEach(function(ev) {
        border.addEventListener(ev, function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
    });
 
    border.addEventListener('dragover', function(e) {
        drag(true);
    });
 
    border.addEventListener('dragenter', function(e) {
        drag(true);
    });

    border.addEventListener('dragleave', function(e) {
        drag(false);
    });

    border.addEventListener('dragend', function(e) {
        drag(false);
    });

    border.addEventListener('drop', function(e) {
        drag(false);

        let dt = e.dataTransfer;
        droppedFile = dt.files;

        handleFiles(droppedFile);
    });
    //converts from filelist to array for ease of iteration
    function handleFiles(droppedFile){
        droppedFile = [...droppedFile];
        initializeProgress(droppedFile.length); 
        droppedFile.forEach(uploadFile);
        droppedFile.forEach(previewFile);
    }

    //upload file to server
    function uploadFile(droppedFile){
        let url = window.location.href
        let method = "POST";

        return fetch(url, {
            method: method,
            body: JSON.stringify(assignmentDetails),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(async r => {
            if(r.status === 201) {
                return r.headers.get("Location");
            } else if(r.status === 200) {
                return await r.json();
            } else {
                throw await r.json();
            }
        })
        .then((response) => {
            if(typeof response === "string") { // we have a location
                notifier.notify("Saved successfully. Redirecting...");
                window.location = response;
            } else if(typeof response === "object") { // we have a JSON object
                console.log(response);
                notifier.notify(response.message);
                // show an alert box saying the response.message
            } else {
                throw response;
            }
        })
        .catch(e => {
            console.error(e);
            notifier.notify("Error: " + e.message, true); // TODO: change this to an error alert box that's built with our colour scheme
        });        
    }
    //tracks progress of upload
    function initializeProgress(numfiles) {
        progressBar.value = 0
        filesDone = 0
        filesToDo = numfiles
      }
    //
    function progressDone() {
        filesDone++
        progressBar.value = filesDone / filesToDo * 100
     }
} 