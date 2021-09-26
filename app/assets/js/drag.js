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

        form.classList.add('isUpload');

        let dt = e.dataTransfer;
 
        droppedFile = dt.files[0];

        form.classList.remove('isUpload');
        form.classList.add('isSuccess');
    });
    //upload file to server
    function uploadFile(droppedFile){
        let url = '';
        let formData = new FormData();

        formData.append('file', droppedFile);

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then();
    }
} 