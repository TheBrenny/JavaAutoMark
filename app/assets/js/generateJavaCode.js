// This file was extracted so we can potentially create something on the
// client-side to show how their input is translated into java code

function generateJavaCode(assignment, assignmentID) {
    if(assignmentID === null || assignmentID === undefined) throw new Error("assignmentID must be specified");
    let code = `public class Assignment${assignmentID} {\n`;

    // for loop for all tasks in the assignment
    let main = "public static void main(String[] args) {\n";
    for(let i = 0; i < assignment.tasks.length; i++) {
        main += `task${i + 1}();\n`;
        code += `public static void task${i + 1}() {\n`;

        for(let j = 0; j < assignment.tasks[i].tests.length; j++) {
            let insertCode = assignment.tasks[i].tests[j].code;
            insertCode = insertCode.replace(/\r\n/gm, "\n").trim(); // strip crlf to just lf

            if(assignment.tasks[i].tests[j].testID !== undefined) {
                let expected = assignment.tasks[i].tests[j].expected;
                if(assignment.tasks[i].tests[j].isException) {
                    code += `try {\n`;
                    code += `${insertCode}\n`;
                    code += `} catch (Exception e) {\n`;
                    code += `System.out.println(e.getClass().getSimpleName());\n`;
                    code += `System.out.println("${expected}" == "" ? true : "${expected}".equals(e.getClass().getSimpleName()));\n`;
                    code += `}\n`;
                } else {
                    insertCode.replace(/;$/gm, ""); // strip trailing semicolon
                    code += `System.out.println(${insertCode});\n`;
                    code += `System.out.println(((Object) ${insertCode}).equals(${expected}));\n`; // Object casting is needed to compare primitives
                }
            } else {
                code += `${insertCode}\n`;
            }

            Object.assign(assignment.tasks[i].tests[j], {
                code: insertCode // save the sanitised code back
            });
        }

        code += `}\n`;
    }

    main += "}\n";
    code += main;

    code += `}\n`;

    return code;
}

if(!!module) module.exports = generateJavaCode;