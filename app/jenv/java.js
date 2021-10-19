const jamVersion = require("../../package.json").version;
const cpSpawn = require("child_process").spawn;
const EventEmmitter = require("events").EventEmitter;
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const AdmZip = require("adm-zip");

const java = config.java.java;
const compiler = config.java.compiler; // java -jar compiler.jar -- this prints the usage

const manifestData = Object.entries({
    "Manifest-Version": "1.0",
    "Created-By": `${jamVersion} (Java Auto Mark)`,
}).map(entry => entry.join(": ")).join("\n") + "\n\n";

const envArgs = {
    "JAVA_TOOL_OPTIONS": undefined
};

function basename(target, ...exts) {
    let ret = path.basename(target);
    let ext = path.extname(target);
    exts.forEach(ext => (ret = path.basename(ret, ext)));
    return [ret, ext];
}

function spawn(command, args) {
    console.log(command + " [\"" + args.join("\" \"") + "\"]");
    const proc = cpSpawn(command, args, {
        env: envArgs,
    });
    return proc;
}


// Target should be a filepath
function run(target, ...classpaths) {
    classpaths = Array.from(classpaths);

    let targetDir = path.resolve(target);
    target = basename(target, ".java", ".class")[0];
    targetDir = path.dirname(targetDir);

    let args = [];
    if(classpaths.length > 0) args = args.concat("-classpath", classpaths.join(path.delimiter)); // adds any classpaths that are passed
    args = args.concat(target);

    return spawn(java, args);
}

function compile(target, ...classpaths) {
    classpaths = Array.from(classpaths);

    let targetDir = path.resolve(target);
    let ext;
    [target, ext] = basename(target, ".java", ".class");
    targetDir = path.dirname(targetDir);

    let cmd = compiler;
    let args = [];

    if(compiler.endsWith(".jar")) {
        cmd = java;
        args = args.concat("-jar", compiler);
        args = args.concat("-11");
        args = args.concat("-proceedOnError");
    }

    console.log(path.delimiter);
    if(classpaths.length > 0) args = args.concat("-classpath", classpaths.join(path.delimiter)); // adds any classpaths that are passed
    args = args.concat(path.resolve(targetDir, target + ext));

    return spawn(cmd, args);
}

// Target is the location of the output jarchive
function buildJar(target, ...classpaths) {
    classpaths = Array.from(classpaths);

    let targetDir = path.resolve(target);
    target = basename(target, ".jar")[0] + ".jar";
    targetDir = path.dirname(targetDir);

    let emitter = new EventEmmitter();
    let zip = new AdmZip();
    zip.addFile("META-INF/MANIFEST.MF", Buffer.from(manifestData));
    zip.addLocalFolder(targetDir); // NOTE: add all files without trying to filter out non-class files - we should be sure they're all classes by now
    zip.toBuffer((buffer) => {
        emitter.emit("data", "jar file created in buffer");
        fs.writeFile(path.resolve(targetDir, target), buffer, (err) => {
            if(err) emitter.emit("error", err);
            emitter.emit("close", 0);
        });
        emitter.emit("close", 0);
    }, (err) => {
        emitter.emi("error", err);
    });

    return emitter;
}

function runAsPromise(method) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            const proc = method(...args);
            let stdout = Buffer.from("");
            let stderr = Buffer.from("");
            let err = null;

            proc.stdout?.on("data", data => {
                stdout = Buffer.concat([stdout, Buffer.from(data)]);
            });
            proc.stderr?.on("data", data => {
                stderr = Buffer.concat([stderr, Buffer.from(data)]);
            });
            proc.on("error", data => err = data);

            proc.on("close", code => {
                let arg = {
                    code: code,
                    stdout: stdout.toString(),
                    stderr: stderr.toString(),
                    error: err,
                };
                if(code === 0) resolve(arg);
                else reject(arg);
            });
        });
    };
}

module.exports = {
    run,
    compile,
    buildJar,
    promise: {
        run: runAsPromise(run),
        compile: runAsPromise(compile),
        buildJar: runAsPromise(buildJar)
    }
};