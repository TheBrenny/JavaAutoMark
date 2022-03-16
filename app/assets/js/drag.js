// MAYBE: Change the name of this file to "assignmentSubmit.js"
onReady(() => {
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
        setStatus("It seems that you can't upload! Try again in a different browser!");
        return;
    }

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

        // MAYBE: Show the student code as a tree in the file upload space!
        return Promise.resolve(e.dataTransfer ?? e.srcElement)
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
                setStatus("Uploading...");
                let retFiles = fileValidation(files);
                initProgressBar(files.length);
                return retFiles;
            })
            .then((files) => {
                form.classList.add("disabled");
                return processFiles(files);
            })
            .then((response) => {
                console.log(response);

                if(response.status === 102) {
                    notifier.notify("This request is taking a while to process. Stay here, and you'll see when it updates! Otherwise, come back later.", "info");
                } else if(response.success === false) {
                    throw new Error("Unable to upload files");
                } else {
                    notifier.notify(`Files have been uploaded! Wait here to see them get marked in real time!`, "info");
                    form.classList.add('markedInput');
                }

                let socketUrl = response?.socketLink;
                if(!!socketUrl) listenToResponses(socketUrl);
            })
            .catch((e) => {
                notifier.notify((e.name || "Error") + ": " + (e.message || "Something went wrong"), "error");
            })
            .finally(() => {
                hideProgressBar();
                form.classList.remove("disabled");
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
        if(item instanceof File) return Promise.resolve(item);
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
                    else if(xhr.status === 102) resolve(Object.assign({status: 102, ...json}));
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

    function listenToResponses(socketUrl) {
        let ws = new JAMSocket(socketUrl);
        $("#inputBox").classList.add("markedInput");
        let table = $("#markingTable");

        ws.on("jam:state", (obj) => {
            obj = obj.data;
            setStatus(obj.state.substring(0, 1).toUpperCase() + obj.state.substring(1).toLowerCase() + "...");
        });

        ws.on("jam:initial", (obj) => {
            obj = obj.data;
            globalThis.assignment = Object.assign({}, obj, {results: []});
            buildTable(table, obj);
            obj.results.forEach((r) => handleProgress(r, false));
            tooltip.findNewCandidates();
        });

        ws.on("jam:progress", (obj) => {
            obj = obj.data;
            handleProgress(obj);
        });

        function handleProgress(progress, updateTooltips = true) {
            if(progress.error !== undefined) {
                // THIS CHANGES THE FRONT CELL
                let frontCell = $(`#${progress.student}`);
                let errorReason = progress.error.stderr;
                let clone = cloneCell(frontCell, {
                    classList: {
                        remove: ["loading"],
                        add: ["error"]
                    },
                    tooltip: "There was an error with the student code!\\nHover over the error test to find out more!",
                });
                frontCell.replaceWith(clone);

                // THIS CHANGES THE ERRORED TEST
                let rowCells = $$(`*[id^="${progress.student}-"].loading`);
                rowCells[0].replaceWith(cloneCell(rowCells[0], {
                    classList: {
                        remove: ["loading"],
                        add: ["error"]
                    },
                    tooltip: "<pre>" + errorReason + "</pre>",
                    text: "!",
                }));

                // THIS CHANGES ALL TESTS AFTER THE ERROR TEST TO BE FAILED
                Array.from(rowCells).slice(1).forEach((c) => {
                    let test = globalThis.assignment.tasks[c.id.split("-")[1] - 1].tests[c.id.split("-")[2] - 1];
                    let expectedOutput = test.expected || "<i>" + (test.isException ? "Any Exception" : "(Empty)") + "</i>";
                    c.replaceWith(cloneCell(c, {
                        classList: {
                            remove: ["loading"],
                            add: ["fail"]
                        },
                        tooltip: `Failed<hr>Output: Error!\\nExpected: ${expectedOutput}<hr>Time: 0ms`,
                        text: "✗",
                    }));
                });
            } else {
                let test = globalThis.assignment.tasks[progress.task - 1].tests[progress.test - 1];
                let expectedOutput = test.expected || "<i>" + (test.isException ? "Any Exception" : "(Empty)") + "</i>";

                let cell = $(`#${progress.student}-${progress.task}-${progress.test}`);

                let clone = cloneCell(cell, {
                    classList: {
                        remove: ["loading", "error"],
                        add: [progress.passed ? "pass" : "fail"]
                    },
                    tooltip: `${progress.passed ? "Passed" : "Failed"}<hr>Output: ${progress.output}\\nExpected: ${expectedOutput}<hr>Time: ${progress.time}ms`,
                    text: progress.passed ? "✓" : "✗",
                    // text: progress.output,
                });
                cell.replaceWith(clone);
            }

            if(updateTooltips) tooltip.findNewCandidates();
        }
        function cloneCell(cell, data) {
            let clone = cell.cloneNode(true);

            // Modify classlist
            data.classList?.remove?.forEach((c) => clone.classList.remove(c));
            data.classList?.add?.forEach((c) => clone.classList.add(c));

            // Modify tooltip
            if(typeof data.tooltip !== "undefined") clone.setAttribute("tooltip", data.tooltip);

            // Modify insides
            if(typeof data.text !== "undefined") clone.innerText = data.text;
            if(typeof data.html !== "undefined") clone.innerHTML = data.html;

            return clone;
        }
    }

    function setStatus(status) {
        $("#inputBox .status").innerText = status;
    }

    function buildTable(table, obj) {
        obj.tasks.forEach(task => {
            task.tests.forEach(test => {
                test.status = "loading";
                test.value = "";
            });
        });

        let clone = table.cloneNode();

        // Create the header row
        let row = document.createElement("span");
        row.classList.add("tHead");
        row.insertAdjacentHTML("afterbegin", `<p class="frontCell">STUDENTS</p>`);
        for(let task of obj.tasks) {
            for(let test of task.tests) {
                let cell = document.createElement("p");
                cell.setAttribute("tooltip", `Task ${task.taskID}\\nTest ${test.testID}\\nMarks: ${test.marks}\n${test.description}`);
                cell.innerText = `${task.taskID}.${test.testID}`;
                row.appendChild(cell);
            }
        }
        clone.appendChild(row);

        // Create the student rows
        for(let student of obj.students) {
            row = document.createElement("span");
            row.classList.add("tRow");
            let cell = document.createElement("p");
            cell.classList.add("frontCell");
            cell.id = `${student}`;
            cell.innerHTML = `<a href='/reports/${globalThis.assignment.id}/${student}'>${student}</a>`;
            row.appendChild(cell);

            for(let task of obj.tasks) {
                for(let test of task.tests) {
                    cell = document.createElement("p");
                    cell.id = `${student}-${task.taskID}-${test.testID}`;
                    cell.classList.add("resultCell");
                    cell.classList.add(test.status);
                    cell.setAttribute("tooltip", "Waiting to be marked...");
                    cell.innerText = test.value;
                    row.appendChild(cell);
                }
            }

            clone.appendChild(row);
        }

        table.replaceWith(clone);
        tooltip.findNewCandidates();
    }

    if(globalThis.websockUrl.length > 0) {
        listenToResponses(globalThis.websockUrl);
    }
});
