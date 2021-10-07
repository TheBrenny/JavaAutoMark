const java = require("../../jenv/java");

class JavaMarker {
    constructor(student, harnessFile, socket) {
        this.student = student;
        this.harnessFile = harnessFile;
        /** @type import("./websocket").JAMSocket */
        this.socket = socket;
        /** @type import("child_process").ChildProcessWithoutNullStreams */
        this.process = null;
    }

    start() {
        this.process = java.run(this.harnessFile, this.student.jarFile, ".");
    }
}

module.exports = JavaMarker;