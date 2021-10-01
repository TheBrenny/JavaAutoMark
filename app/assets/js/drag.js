const concurrentUploads = 7;

(() => {
    const allowedToUpload = (() => {
        let elem = document.createElement('input');
        elem.type = 'file';
        let domPrefixes = ["", "moz", "o", "ms", "webkit"];

        let condition = false;
        for(let prefix of domPrefixes) {
            if(prefix + "directory" in elem) {
                condition = true;
                break;
            }
        }

        condition = condition && "multiple" in elem;
        condition = condition && "FormData" in window && "FileReader" in window;

        return condition;
    })();
    const form = $(".inputBox");
    const progressBar = $("#progressBar");

    if(!allowedToUpload) {
        form.classList.add("disabled");
        return;
    }

    form.classList.add('enabled');
    const dragAndDrop = "draggable" in document.createElement("div");
    if(dragAndDrop) form.classList.add("dragEnabled");

    let events = ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"];
    form.addEventListener(events, (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    form.addEventListener('dragover', (e) => drag(true));
    form.addEventListener('dragenter', (e) => drag(true));
    form.addEventListener('dragleave', (e) => drag(false));
    form.addEventListener('dragend', (e) => drag(false));
    form.addEventListener(['drop', 'change'], async (e) => {
        drag(false);
        form.classList.remove('isError');
        form.classList.remove('isSuccess');

        // MAYBE: Show the student code as a tree in the file upload space!
        return Promise.resolve(e.dataTransfer)
            .then(async (dt) => {
                let files;
                if(!!dt.items) files = await getWebkitFiles(Array.from(dt.items).map(item => item.webkitGetAsEntry()));
                else if(!!dt.files) files = dt.files;
                else {
                    throw new Error("Unable to upload files");
                }
                return files;
            })
            .then((files) => {
                form.classList.add('isUpload');
                let retFiles = fileValidation(files);
                initProgressBar(files.length);
                return retFiles;
            })
            .then((files) => {
                return processFiles(files);
            })
            .then((response) => {
                notifier.notify("Successfully uploaded and compiled!", "success");
                form.classList.add('isSuccess');
                form.classList.add('markedInput');
            })
            .catch((e) => {
                form.classList.add('isError');
                notifier.notify((e.name || "Error") + ": " + (e.message || "Something went wrong"), "error");
            })
            .finally(() => {
                form.classList.remove('isUpload');
                hideProgressBar();
            });
    });

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
                    files.push(item);
                } else {
                    let recurse = promisifyReader(item).then(getWebkitFiles.bind(this, files));
                    proms.push(recurse);
                }
            }
            Promise.all(proms).then(() => resolve(Promise.all(files)));
        });
    }

    function processFiles(files) {
        return new Promise(async (resolve, reject) => {
            let formData = new FormData(form);
            formData.delete("file");
            let proms = Array.from(files).map(async (f) => formData.append('file', await promisifyFile(f), f.fullPath));
            proms = await Promise.all(proms);

            let xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', updateProgressBar);
            xhr.addEventListener('readystatechange', (e) => {
                if(xhr.readyState === 4) {
                    let json = JSON.parse(xhr.responseText || "{}");
                    if(xhr.status === 200 || xhr.status === 202) resolve(json);
                    else {
                        // This lets us change the message to better human readables.
                        if(json.code === 409) json.message = "Wait until the other files have finished processing";
                        reject(json);
                    }
                }
            });
            xhr.open('PUT', window.location.href, true);
            xhr.send(formData);
        });
    }

    function initProgressBar() {
        progressBar.removeAttribute("hidden");
        progressBar.value = 0;
        progressBar.max = 1;
    }
    function updateProgressBar(e) {
        progressBar.value = e.loaded;
        progressBar.max = e.total;

        if(e.loaded === e.total) {
            progressBar.removeAttribute("value");
            progressBar.indeterminate = true;
        }
    }
    function hideProgressBar() {
        progressBar.value = 1;
        progressBar.max = 1;
        progressBar.setAttribute("hidden", true);
    }

    function fileValidation(files) {
        const allowedExtensions = ['.java'];
        const hasExtension = (filename, e) => filename.endsWith(e);

        let retFiles = [];
        for(let file of files) {
            let fileName = file.name;

            if(allowedExtensions.some(hasExtension.bind(null, fileName))) {
                retFiles.push(file);
            }
        }

        let diffFiles = files.length - retFiles.length;
        if(diffFiles > 0) {
            let warning = `${diffFiles} invalid file${diffFiles === 1 ? "" : "s"} detected. Only .java files are allowed.`;
            console.warn(warning);
            notifier.notify(warning, "warning");
        }
        return retFiles;
    }
})();
