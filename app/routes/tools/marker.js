// FIXME: You still need to compile the harness class!

const EventEmitter = require('events');
const java = require("../../jenv/java");
const plimit = import("p-limit");
const path = require("path");
const TicketMachine = require("promise-ticket");

class MarkerManager {
    constructor(socket, assignment, harnessFile) {
        this.javaMarkers = {allMarkers: []};
        /** @type import("./websocket").JAMSocketServer */
        this.socket = socket;
        this.harnessFile = harnessFile; // this is still a java file!
        this.markers = 0;
        this.state = "waiting";
        this.stopFunctions = [];
        this.results = [];

        // This creates an assignment object that we can send to the user when they connect to the websocket server
        this.assignment = {
            id: assignment.id,
            students: [],
            tasks: Array.from(assignment.tasks)
        };
        this.assignment.tasks.forEach((task, i, a) => {
            task.tests = task.tests.filter(test => test.testID !== undefined);
        });

        this.socket.on("connection", (ws, req) => {
            ws.on("message", this.handleMessage.bind(this, ws));
            this.sendState(ws);
            if(this.state === "running") this.sendInitial(ws);
        });
    }

    setState(state) {
        this.state = state;
        this.sendState();
        return this;
    }

    setStudents(students) {
        this.assignment.students = students.map(s => s.student);
        students.forEach(student => this.createMarker(student));
        return this;
    }

    sendState(sock) {
        if(sock === undefined) {
            this.socket.sendToAll("state", {state: this.state});
        } else {
            this.socket.send(sock, "state", {state: this.state});
        }
    }

    sendInitial(sock) {
        if(sock === undefined) {
            this.socket.sendToAll("initial", Object.assign({}, this.assignment, {results: this.results}));
        } else {
            this.socket.send(sock, "initial", Object.assign({}, this.assignment, {results: this.results}));
        }
    }

    createMarker(student) {
        if(this.javaMarkers[student.student]) throw new Error("Marker already exists for student " + student.student);

        let marker = new JavaMarker(student);
        this.javaMarkers[student.student] = marker;
        this.javaMarkers.allMarkers.push(marker);

        marker.once("finish", () => {
            this.markers--;
            if(this.markers === 0) {
                // MAYBE: Emit a finish event on something?
                // There isn't really a thing to finish, because once start finishes its promise chain, it auto calls stop.
            }
        });

        this.markers++;
        return this;
    }

    async start() {
        if(this.state === "running") return this;
        this.setState("running");
        this.sendState();
        this.sendInitial();

        let harness = {
            javaFile: this.harnessFile,  // The java file that will be compiled
            harness: null,               // The compiled harness file
            dirty: true,                 // Whether or not STDERR had data
        };

        let tm = new TicketMachine();

        /** @param {JavaMarker} marker */
        const generateHarness = async (marker) => {
            // await tm.queue();
            if(harness.dirty) {
                await java.promise.compile(harness.javaFile, marker.student.jarFile, path.dirname(harness.javaFile))
                    .then((outs) => {
                        if(outs.stderr?.includes("ERROR") || outs.stderr?.includes("Error:")) harness.dirty = true;
                        else harness.dirty = false;
                    })
                    .catch((outs) => {
                        console.log("STDERR");
                        console.log(outs.stderr);
                        if(outs.stderr?.includes("ERROR") || outs.stderr?.includes("Error:")) harness.dirty = true;
                        else harness.dirty = false;
                    });
                harness.harness = harness.javaFile.replace(/.java$/, ".class");
            }
            return harness.harness;
        };

        /** @param {JavaMarker} marker */
        const runMarker = (marker) => {
            return () => new Promise(async (resolve, reject) => {
                // REJECT ISN"T USED! We want to use it when there's an error with OUR code - not student code
                marker.on("progress", (data) => {
                    this.results.push(data);
                    this.socket.sendToAll("progress", data);
                });
                marker.on("error", (data) => {
                    this.results.push(data);
                    this.socket.sendToAll("progress", data);
                });
                marker.on("finish", (code) => {
                    resolve(code);
                });

                await generateHarness(marker);
                marker.start(harness.harness);
                tm.next();
            });
        };

        let limit = (await plimit).default(2);
        Promise.all(this.javaMarkers.allMarkers.map(marker => limit(runMarker(marker))))
            .catch(console.error)
            .finally(() => {
                console.log("All marking processes finished!");
                this.stop();
            }); // "finally" just in case something errors out
        tm.skipQueue(0);

        return this;
    }

    handleMessage(ws, message) {
        this.socket.send(ws, "you sent me something!");
        this.socket.send(ws, message);
    }

    async stop() {
        this.stopFunctions.forEach(fn => fn());
    }

    onStop(fn) {
        this.stopFunctions.push(fn);
        return this;
    }
}

class JavaMarker {
    constructor(student) {
        this.student = student;
        /** @type import("child_process").ChildProcessWithoutNullStreams */
        this.process = null;
        this.eventEmitter = new EventEmitter();
        this.results = {}; // {student: {results}}
        this.timers = {task: 0, test: 0};
    }

    start(harnessFile) {
        this.process = java.run(harnessFile, this.student.jarFile, path.dirname(harnessFile));
        this.eventEmitter.emit("start");

        // - handle stdout from the process
        let stdoutData = [];
        let stderrData = [];
        const handleStdout = (line) => {
            // - emit messages on the emitter with the results
            line = line.trim();
            if(line.startsWith("task.start")) {
                this.timers.task = Date.now();
                this.eventEmitter.emit("task.start", line.split(".", 3)[2]);
                stdoutData = [];
            } else if(line.startsWith("task.end")) {
                this.timers.task = Date.now() - this.timers.task;
                this.eventEmitter.emit("task.end", line.split(".", 3)[2]);
                stdoutData = [];
            } else if(line.startsWith("test.start")) {
                this.timers.test = Date.now();
                this.eventEmitter.emit("test.start", line.split(".", 3)[2].split("."));
                stdoutData = [];
            } else if(line.startsWith("test.end")) {
                this.timers.test = Date.now() - this.timers.test;
                this.eventEmitter.emit("test.end", line.split(".", 3)[2].split("."));
                stdoutData.push(line);

                // These give us the actual outputs of the program.
                let outputActual = stdoutData.slice(
                    stdoutData.findIndex(line => line.startsWith("test.output.actual")) + 1,
                    stdoutData.findIndex(line => line.startsWith("test.output.passed"))
                ).join("\n").trim();
                let outputPassed = stdoutData.slice(
                    stdoutData.findIndex(line => line.startsWith("test.output.passed")) + 1,
                    stdoutData.findIndex(line => line.startsWith("test.end"))
                ).join("\n").trim();

                let data = {
                    student: this.student.student,
                    task: line.split(".")[2],
                    test: line.split(".")[3],
                    output: outputActual,
                    passed: outputPassed.includes("true"),
                    time: this.timers.test,
                };
                // Emit a progress report for the student
                this.eventEmitter.emit("progress", data);
                // also store the results in an object for easy access
                this.results = this.results ?? {};
                this.results[data.task] = this.results[data.task] ?? {};
                this.results[data.task][data.test] = data;

                stdoutData = [];
            } else {
                stdoutData.push(line);
            }
        };

        this.process.stdout.on("data", (data) => {
            data = data.toString().split("\n");
            data.forEach(handleStdout);
        });
        this.process.stderr.on("data", (err) => {
            err = err.toString().trim().split("\n");
            stderrData.push(...err);
        });
        this.process.on("exit", (code) => {
            if(code === 0) return this.stop();

            let error = new Error(`Java process exited with code ${code}`);
            error.code = code;
            error.stderr = stderrData.join("\n");
            error.stdout = stdoutData.join("\n");
            this.stop(error);
        });

        return this;
    }

    stop(err) {
        if(err) this.eventEmitter.emit("error", {error: err, student: this.student.student});
        this.eventEmitter.emit("finish", err?.code ?? 0);
    }

    getInfo(request) {
        let target = request.split(".");
        let obj = this.results;
        for(let i = 0; i < target.length && obj !== undefined; i++) {
            obj = obj?.[target[i]] ?? undefined;
        }
        return obj;
    }

    on(event, callback) {
        return this.eventEmitter.on(event, callback);
    }
    once(event, callback) {
        return this.eventEmitter.once(event, callback);
    }
}

module.exports.JavaMarker = JavaMarker;
module.exports.MarkerManager = MarkerManager;