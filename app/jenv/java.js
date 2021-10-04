const cpSpawn = require("child_process").spawn;
const path = require("path");
const config = require("../../config");

const java = config.java.java;
const compiler = config.java.compiler; // java -jar compiler.jar -- this prints the usage

function basename(target, ...exts) {
    let ret = path.basename(target);
    let ext = path.extname(target);
    exts.forEach(ext => (ret = path.basename(ret, ext)));
    return [ret, ext];
}

function spawn(command, args) {
    // console.log(command + " [\"" + args.join("\" \"") + "\"]");

    const proc = cpSpawn(command, args);
    return proc;
}


// Target should be a filepath
function run(target, ...classpaths) {
    classpaths = Array.from(classpaths);

    let targetDir = path.resolve(target);
    target = basename(target, ".java", ".class")[0];
    targetDir = path.dirname(targetDir);

    let args = [];
    if(classpaths.length > 0) args = args.concat("-classpath", classpaths.join(";")); // adds any classpaths that are passed
    args = args.concat("-classpath", targetDir);
    args = args.concat(target);

    return spawn(java, args);
}

function compile(target, ...classpaths) {
    classpaths = Array.from(classpaths);

    let targetDir = path.resolve(target);
    let ext;
    [target, ext] = basename(target, ".java", ".class");
    targetDir = path.dirname(targetDir);

    let args = [];
    args = args.concat("-jar", compiler);
    if(classpaths.length > 0) args = args.concat("-classpath", classpaths.join(";")); // adds any classpaths that are passed
    args = args.concat("-11");
    args = args.concat(path.resolve(targetDir, target));

    return spawn(java, args);
}

function runAsPromise(method) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            const proc = method(...args);
            let stdout = Buffer.from("");
            let stderr = Buffer.from("");

            proc.stdout.on("data", data => {
                stdout = Buffer.concat([stdout, Buffer.from(data)]);
            });
            proc.stderr.on("data", data => {
                stderr = Buffer.concat([stderr, Buffer.from(data)]);
            });

            proc.on("close", code => {
                let arg = {
                    code: code,
                    stdout: stdout.toString(),
                    stderr: stderr.toString()
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
    promise: {
        run: runAsPromise(run),
        compile: runAsPromise(compile)
    }
};