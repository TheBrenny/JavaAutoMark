var dropEnabled = function() {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;    
}();

var form = $(".inputBox");

function drag(type) {

    if(type) {
        form.classList.add('file-over');
    } else {
        form.classList.remove('file-over');
    }
}

if(dropEnabled) {
    form.classList.add('enabled');

    var droppedFile = false;

    var events = ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"];

    events.forEach(function(ev) {
        form.addEventListener(ev, function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
    });
 
    form.addEventListener('dragover', function(e) {
        drag(true);
    });
 
    form.addEventListener('dragenter', function(e) {
        drag(true);
    });

    form.addEventListener('dragleave', function(e) {
        drag(false);
    });

    form.addEventListener('dragend', function(e) {
        drag(false);
    });

    form.addEventListener('drop', function(e) {
        drag(false);

        let dt = e.dataTransfer;
        droppedFile = dt.files;

        handleFiles(droppedFile);
        
        form.classList.add('isUpload');
        form.classList.remove('isUpload');
        form.classList.add('isSuccess');
    });
    //tracks progress of upload
    let uploadProgress = []
    let progressBar = document.getElementById('progress-bar')
    function initializeProgress(numFiles) {
        progressBar.value = 0
        uploadProgress = []

        for(let i = numFiles; i > 0; i--) {
            uploadProgress.push(0)
        }
    }
    function updateProgress(fileNumber, percent) {
        uploadProgress[fileNumber] = percent
        let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
        console.debug('update', fileNumber, percent, total)
        progressBar.value = total
      }
    //converts from filelist to array for ease of iteration
    function handleFiles(droppedFile){
        droppedFile = [...droppedFile];
        initializeProgress(droppedFile.length); 
        droppedFile.forEach(uploadFile);
    }
    //upload file to server
    function uploadFile(droppedFile){
        var url = window.location.href;
        var xhr = new XMLHttpRequest();
        var formData = new formData();
        xhr.open('POST', url, true);      
        
        xhr.upload.addEventListener("progress", function(e) {
            updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
          })

        xhr.addEventListener('readystatechange', function(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
              // Done. Inform the user
            }
            else if (xhr.readyState == 4 && xhr.status != 200) {
              // Error. Inform the user
            }
          })
        
          formData.append('file', droppedFile)
          xhr.send(formData)
    }
} 