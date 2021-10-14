function generateCSV(object, assignment) {
    let jsonObject = JSON.stringify(object);

    $('#json').innerText= jsonObject;
    console.log(jsonObject);

    $('#csv').innerText = ConvertToCSV(object);
    storage.putObject(storage.container, path.join("the", "path", "to", "save", `${student}.csv`), "the string content to save");
}

function ConvertToCSV(toConvert) {
    let str = "\n\n";

    str += `Student number:,${toConvert.studentID}\n`;
    str += `Assignment:,${toConvert.assignmentTitle}\n`;
    str += `Marks:,${toConvert.actualMarks}\n`;
    str += `Possible marks:,${toConvert.possibleMarks}\n\n\n`;
    str += `Task, Test, Description, Given, Mark, Possible mark\n`;

    toConvert.tasks.forEach(task => {
        str += `${task.taskID},,Task ${task.taskID}, , ${task.actualMarks}, ${task.possibleMarks}\n`;

        task.tests.forEach(test => {
            str += `${task.taskID}, ${test.testID}, ${test.description}, ${test.given}, ${test.actualMarks}, ${test.possibleMarks}\n`
        })
    });

    console.log(str);
    return str;

}

let r = //{reports: 
    [
        {
            assignmentID: 1,
            assignmentTitle: "Assignment",
            studentID: "z5260786",
            possibleMarks: 100,
            actualMarks: 63,
            tasks: [
                {
                    taskID: 1,
                    possibleMarks: 50,
                    actualMarks: 23,
                    tests: [
                        {
                            testID: 1,
                            description: "This is a test description",
                            condition: "c",
                            expected: "25",
                            given: "23",
                            possibleMarks: 50,
                            actualMarks: 23
                        }
                    ]
                }, 
                {
                    taskID: 2,
                    possibleMarks: 50,
                    actualMarks: 40,
                    tests: [
                        {
                            testID: 1,
                            description: "This is a test description",
                            condition: "c",
                            expected: "25",
                            given: "23",
                            possibleMarks: 25,
                            actualMarks: 20
                        },
                        {
                            testID: 2,
                            description: "This is a test description",
                            condition: "c",
                            expected: "25",
                            given: "23",
                            possibleMarks: 25,
                            actualMarks: 20
                        }
                    ]
                }
            ]
        }, 
        {
            assignmentID: 1,
            assignmentTitle: "Assignment",
            studentID: "z1000555",
            possibleMarks: 100,
            actualMarks: 43,
            tasks: [
                {
                    taskID: 1,
                    possibleMarks: 50,
                    actualMarks: 13,
                    tests: [
                        {
                            testID: 1,
                            description: "This is a test description",
                            condition: "c",
                            expected: "25",
                            given: "23",
                            possibleMarks: 50,
                            actualMarks: 13
                        }
                    ]
                }, 
                {
                    taskID: 2,
                    possibleMarks: 50,
                    actualMarks: 30,
                    tests: [
                        {
                            testID: 1,
                            description: "This is a test description",
                            condition: "c",
                            expected: "25",
                            given: "23",
                            possibleMarks: 25,
                            actualMarks: 15
                        },
                        {
                            testID: 2,
                            description: "This is a test description",
                            condition: "c",
                            expected: "25",
                            given: "23",
                            possibleMarks: 25,
                            actualMarks: 15
                        }
                    ]
                }
            ]
        }
    ]
// }