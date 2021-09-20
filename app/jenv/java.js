const {
    spawn
} = require("child_process");
const path = require("path");
const config = require("../../config");

const java = config.java.java;
const compiler = config.java.compiler; // java -jar compiler.jar -- this prints the usage

// Target should be a filepath
function run(target, classpaths) {
    let targetDir = path.resolve(target);
    target = path.basename(target, ".java");
    targetDir = path.dirname(targetDir);

    let args = [];
    if(!!classpaths) args = args.concat("-classpath", classpaths.join(";")); // adds any classpaths that are passed
    args = args.concat("-classpath", targetDir);
    args = args.concat(target);

    console.log(java + ", [" + args.join(", ") + "]");

    const proc = spawn(java, args);
    proc.stdout.on("data", data => console.log(data.toString()));
    proc.stderr.on("data", data => console.log(data.toString()));
    // proc.on("close", code => {
    //     console.log(`java exited with code ${code}`);
    // });

    return proc;
}

function compile(target) {
    let args = [];
}

module.exports = {
    run,
    compile
};