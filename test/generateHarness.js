const fs = require("fs");
const exec = require('child_process').execSync;

function genHeader(classname) {
    return [
        `public class ${classname} {`
    ];
}

let testStart = 1;
let testCaseCounter = testStart;

function genTestCase(body, expectation) {
    let testCase = testCaseCounter++;

    if (Array.isArray(body)) body = body.join("\n");
    if (expectation === undefined) expectation = "true";

    return [
        `public static boolean test${testCase}() {`,
        body,
        `return ${expectation};`,
        `}`
    ];
}

function genFooter() {
    let ret = [
        `public static void main(String[] args) {`
    ];
    for (let i = testStart; i < testCaseCounter; i++) {
        ret.push(`try {  System.out.println("Test case ${i}: " + (test${i}()));  } catch(Exception e) {System.err.println(e.getMessage());}`);
    }
    ret.push(`}`, `}`); // close main and then class
    return ret;
}

function concat(...parts) {
    let ret = [];
    for (let p of parts) ret = ret.concat(p);
    return ret;
}

async function buildHarness(classname) {
    let harness = concat(
        genHeader(classname),
        genTestCase(["int a = 5;", "int b = 10;", "int c = a + b;"], "c == 15"),
        genFooter()
    );

    let code = harness.join("\n");
    return {
        filename: classname + ".java",
        code
    };
}
async function writeJavaFile({
    filename,
    code
}) {
    fs.writeFileSync("./" + filename, code);
    return filename;
}
async function compileClassFile(filename) {
    let output = exec("javac " + filename);
    return {
        filename,
        output
    };
}
async function runTestHarness({
    filename,
    output
}) {
    filename = filename.replace(/\.java$/, "");
    return exec("java " + filename).toString();
}

Promise.resolve("Harness")
    .then(buildHarness)
    .then(writeJavaFile)
    .then(compileClassFile)
    .then(runTestHarness)
    .then(console.log);