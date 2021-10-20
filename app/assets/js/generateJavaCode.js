// This file was extracted so we can potentially create something on the
// client-side to show how their input is translated into java code

function generateJavaCode(assignment, assignmentID) {
    if(assignmentID === null || assignmentID === undefined) throw new Error("assignmentID must be specified");
    let code = ``;
    code += `import java.io.PrintStream;\n`;
    code += `import java.io.OutputStream;\n`;
    code += `public class Assignment${assignmentID} {\n`;

    // for loop for all tasks in the assignment
    let main = "public static void main(String[] args) {\n";
    main += "try {\n";

    // This gives us control over the output stream because we only want to println our output
    main += `// This gives us control over the console output stream because we only want to println our harness output\n`;
    main += `PrintStream sysout = System.out;\n`;
    main += `System.setOut(new PrintStream(new OutputStream() {\n`;
    main += `    public void write(int b) {\n`;
    main += `        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();\n`;
    // main += `        for(int i = 0; i < stackTrace.length; i++) {\n`;
    // main += `            sysout.println(i + " - " + stackTrace[i].getClassName());\n`;
    main += `            if(stackTrace[stackTrace.length-3].getClassName().equals(PrintStream.class.getName())) {\n`; // testing indicates that st[st.length - 3] should always be printstream
    main += `                sysout.write(b);\n`;
    main += `            }\n`;
    // main += `        }\n`;
    main += `    }\n`;
    main += `}));\n`;
    main += `\n`;

    for(let i = 0; i < assignment.tasks.length; i++) {
        let task = assignment.tasks[i];
        main += `task${i + 1}();\n`;
        code += `public static void task${i + 1}() throws Exception {\n`;
        code += `System.out.println("task.start.${task.taskID}");\n`;

        for(let j = 0; j < task.tests.length; j++) {
            let test = task.tests[j];
            let insertCode = test.code;
            insertCode = insertCode.replace(/\r\n/gm, "\n").trim(); // strip crlf to just lf

            if(test.testID !== undefined) {
                let expected = test.expected;
                code += `System.out.println("test.start.${task.taskID}.${test.testID}");\n`;
                if(test.isException) {
                    code += `try {\n`;
                    code += `${insertCode}\n`;
                    code += `} catch (Exception e) {\n`;
                    code += `System.out.println("test.output.actual.${task.taskID}.${test.testID}");\n`;
                    code += `System.out.println(e.getClass().getSimpleName());\n`;
                    code += `System.out.println("test.output.passed.${task.taskID}.${test.testID}");\n`;
                    code += `System.out.println("${expected}" == "" ? true : "${expected}".equals(e.getClass().getSimpleName()));\n`;
                    code += `}\n`;
                } else {
                    insertCode.replace(/;$/gm, ""); // strip trailing semicolon
                    code += `System.out.println("test.output.actual.${task.taskID}.${test.testID}");\n`;
                    code += `System.out.println(${insertCode});\n`;
                    code += `System.out.println("test.output.passed.${task.taskID}.${test.testID}");\n`;
                    code += `System.out.println(((Object) ${insertCode}).equals(${expected}));\n`; // Object casting is needed to compare primitives
                }
                code += `System.out.println("test.end.${task.taskID}.${test.testID}");\n`;
            } else {
                code += `${insertCode}\n`;
            }

            Object.assign(assignment.tasks[i].tests[j], {
                code: insertCode // save the sanitised code back
            });
        }
        code += `System.out.println("task.end.${task.taskID}");\n`;
        code += `}\n`;
    }
    main += "} catch(Exception e) {\n";
    main += "e.printStackTrace();\n";
    main += "}\n";
    main += "}\n";

    code += main;
    code += `}\n`;

    return code;
}

if(typeof module !== "undefined") module.exports = generateJavaCode;