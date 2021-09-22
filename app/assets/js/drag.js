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

        droppedFile = dt.files[0];
    });
} 