const fs = require("fs");
const exec = require('child_process').execSync;

function genHeader(classname, testCount) {
    return [
        `@TestAnnotation(tests = ${testCount})`,
        `public class ${classname} {`
    ];
}

let testStart = 1;
let testCaseCounter = testStart;

function genTestCase(body, expectations, testName) {
    let testCase = testCaseCounter++;

    if (!testName) testName = "" + testCase;
    if (Array.isArray(body)) body = body.join("\n");
    if (expectations === undefined) expectations = ["true"];
    if (!Array.isArray(expectations)) expectations = [expectations];

    expectations = expectations.map((e, i) => `results[${i}] = (${e});`);

    let ret = [
        `@TestAnnotation(tests = ${expectations.length}, name = "${testName}")`,
        `public static boolean[] test${testCase}() {`,
        `// setup`,
        body,
        ``,
        `// test`,
        `boolean[] results = new boolean[${expectations.length}];`,
        expectations.join("\n"),
        `return results;`,
        `}`
    ];

    return ret;
}

function genFooter() {
    return ["}"]; // there's nothing to add
}

function concat(...parts) {
    let ret = [];
    for (let p of parts) ret = ret.concat(p);
    return ret;
}

async function buildHarness(classname) {
    let harness = concat(
        genHeader(classname, 2),
        // these are the test cases to be genned (what the teacher puts in)
        genTestCase(["int a = 5;", "int b = 10;", "int c = a + b;"], "c == 15", "Math Test"),
        genTestCase(["Book b = new Book(\"Harry Potter\");", "String t = b.getTitle();", "String s = b.toString();"], ["t.equals(\"Harry Potter\")", "s.equals(\"Book{\\\"Harry Potter\\\"}\")"], "Book Test"),
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
    let output = exec("javac -sourcepath ..\\assignments\\_stub " + filename);
    return {
        filename,
        output
    };
}
async function runTestHarness({
    filename,
    output
}) {
    filename = filename.replace(/\..*$/, "");
    return exec("java -cp ..\\assignments\\z1111111\\;.\\ Harness").toString();
}

Promise.resolve("Tests")
    .then(buildHarness)
    .then((r) => (console.log("Harness built"), r))
    .then(writeJavaFile)
    .then((r) => (console.log("File written"), r))
    .then(compileClassFile)
    .then((r) => (console.log("Class compiled"), r))
    .then(runTestHarness)
    .then((r) => (console.log("Harness run"), r))
    .then(console.log);