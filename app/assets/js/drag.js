const concurrentUploads = 7;

(() => {
    const dropEnabled = (() => {
        let div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    })();
    const form = $(".inputBox");
    const progressBar = $("#progressBar");
    let progressData = [];

    if(dropEnabled) {
        form.classList.add('enabled'); // TODO: change this class to "dropEnabled"

        let events = ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"];
        form.addEventListener(events, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        form.addEventListener('dragover', (e) => drag(true));
        form.addEventListener('dragenter', (e) => drag(true));
        form.addEventListener('dragleave', (e) => drag(false));
        form.addEventListener('dragend', (e) => drag(false));
        form.addEventListener('drop', async (e) => {
            drag(false);

            return Promise.resolve(e.dataTransfer)
                .then(async (dt) => {
                    let files;
                    if(!!dt.items) files = await getWebkitFiles(Array.from(dt.items).map(item => item.webkitGetAsEntry()));
                    else if(!!dt.files) files = dt.files;
                    else {
                        throw new Error("Error: Unable to upload files!");
                    }
                    return files;
                })
                .then((files) => {
                    form.classList.add('isUpload');
                    initProgressBar(files.length);
                    return files;
                })
                .then((files) => processFiles(files))
                .then(() => {
                    form.classList.add('isSuccess');
                    hideProgressBar();
                })
                .catch((e) => {
                    form.classList.add('isError');
                    notifier.notify(e.name + ": " + e.message, true);
                })
                .finally(() => form.classList.remove('isUpload'));
        });
    }

    function drag(isDragging) {
        if(isDragging) form.classList.add('file-over');
        else form.classList.remove('file-over');
    }

    function promisifyReader(item) {
        return new Promise((resolve, reject) => item.createReader().readEntries(resolve, reject));
    }
    function promisifyFile(item) {
        return new Promise((resolve, reject) => item.file(resolve, reject));
    }
    function getWebkitFiles(files, items) {
        // Converts a single arg call to a double arg call.

        if(items === undefined) {
            return getWebkitFiles([], files);
        }

        return new Promise((resolve, reject) => {
            let proms = [];
            for(let i = 0; i < items.length; i++) {
                let item = items[i];
                if(item.isFile) {
                    files.push(promisifyFile(item));
                } else {
                    let recurse = promisifyReader(item).then(getWebkitFiles.bind(this, files));
                    proms.push(recurse);
                }
            }
            Promise.all(proms).then(() => resolve(Promise.all(files)));
        });
    }

    function processFiles(files) {
        return new Promise((resolve, reject) => {
            files = [...files]; // coerce to an array
            let fileCount = files.length;
            // console.log(files);

            let formData = new FormData(form);
            formData.delete("file");
            files.forEach((f) => formData.append('file', f));

            let xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', updateProgressBar);
            xhr.addEventListener('readystatechange', (e) => {
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) resolve();
                    else reject(e);
                }
            });
            xhr.open('POST', window.location.href, true);
            xhr.send(formData);
        });
    }

    function initProgressBar() {
        progressBar.setAttribute("hidden", false);
        progressBar.value = 0;
        progressBar.max = 1;
    }

        fileValidation(droppedFile);
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
    function updateProgressBar(e) {
        progressBar.value = e.loaded;
        progressBar.max = e.total;

        // progressData[fileNumber] = percent;
        // let total = progressData.reduce((tot, curr) => tot + curr, 0) / progressData.length;
        // progressBar.value = Math.max(total, progressBar.value); // Math.max so we don't go backwards by race conditions
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
    function fileValidation(droppedFile){
        var allowedExtensions = '.txt';
        let fileName = droppedFile[0].name;
        //var test = 
        if (!fileName.endsWith(allowedExtensions)) {
            alert('Invalid file type');
            droppedFile = '';
            return false;
        } 
    }
    //upload file to server
    function uploadFile(droppedFile, i){
        var url = window.location.href;
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
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
    function hideProgressBar() {
        progressBar.value = 1;
        progressBar.max = 1;
        progressBar.setAttribute("hidden", true);
    }
})();
