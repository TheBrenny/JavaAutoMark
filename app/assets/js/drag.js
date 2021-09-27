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
                    files.push(item);
                } else {
                    let recurse = promisifyReader(item).then(getWebkitFiles.bind(this, files));
                    proms.push(recurse);
                }
            }
            Promise.all(proms).then(() => resolve(files));
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

    function updateProgressBar(e) {
        progressBar.value = e.loaded;
        progressBar.max = e.total;

        // progressData[fileNumber] = percent;
        // let total = progressData.reduce((tot, curr) => tot + curr, 0) / progressData.length;
        // progressBar.value = Math.max(total, progressBar.value); // Math.max so we don't go backwards by race conditions
    }
    function hideProgressBar() {
        progressBar.value = 1;
        progressBar.max = 1;
        progressBar.setAttribute("hidden", true);
    }
})();
