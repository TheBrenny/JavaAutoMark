async function generateCSV(object) {

    let student = object.studentID;
    let assignmentID = object.assignmentID;

    let filePath = `${assignmentID}/${student}/${student}`;

    let csv = convertToCSV(object);
    storage.putObject(storage.container, `${filePath}.csv`, csv);
}

async function pullCSV(object) {
    let student = object.studentID;
    let assignmentID = object.assignmentID;

    let filePath = `${assignmentID}/${student}/${student}`;

    return new Promise(async (resolve,reject) => {
        let f = await storage.getObject(storage.container, `${filePath}.csv`);
        resolve(f);
    }).then((file) =>{
        function readStream(s) {
            return new Promise((resolve, reject) => {
                let data = "";
                s.on("data", d => data += d);
                s.on("end", () => resolve(data));
                s.on("error", reject);
            });
        }
        return readStream(file);
    }).then((file) => {
        return convertFromCSV(file);
    });
}

function convertFromCSV(toConvert) {
    
    const split = toConvert.split('\n').join(',').split(',');

    let report = {
        studentID: split[3],
        assignmentTitle: split[5],
        actualMarks: split[7],
        possibleMarks: split[9],
        tasks: []
    }

    //Every row is 6 elements [task, test, desc, given, mark, possible] starting at index 18
    let taskIndex = 0;
    let testIndex = 0;
    for( let i = 18; i < split.length - 6; i += 6) {

        if(split[i] != taskIndex) {
            let t = {
                taskID: 0,
                actualMarks: 0,
                possibleMarks: 0,
                tests: []
            };
            t.taskID = split[i];
            t.actualMarks = split[i + 4];
            t.possibleMarks = split[i + 5];
            report.tasks.push(t);
            testIndex = 0;
            taskIndex++;
        } else {
            let t = {
                testID: 0,
                description: "",
                given: "",
                actualMarks: 0,
                possibleMarks: 0
            };
            
            t.testID = split[i + 1];
            t.description = split[i + 2];
            t.given = split[i + 3];
            t.actualMarks = split[i + 4];
            t.possibleMarks = split[i + 5];

            report.tasks[taskIndex - 1].tests.push(t);

            testIndex++;
        }
        
    }
    
    return report;
}

function convertToCSV(toConvert) {
    let str = "\n\n";

    str += `Student number:,${toConvert.studentID}\n`;
    str += `Assignment:,${toConvert.assignmentTitle}\n`;
    str += `Marks:,${toConvert.actualMarks}\n`;
    str += `Possible marks:,${toConvert.possibleMarks}\n\n\n`;
    str += `Task,Test,Description,Given,Mark,Possible mark\n`;

    toConvert.tasks.forEach(task => {
        str += `${task.taskID},,Task ${task.taskID}, ,${task.actualMarks},${task.possibleMarks}\n`;

        task.tests.forEach(test => {
            str += `${task.taskID},${test.testID},${test.description},${test.given},${test.actualMarks},${test.possibleMarks}\n`
        })
    });

    return str;
}


if(typeof module !== "undefined") module.exports = {generateCSV, pullCSV};




let r = //{reports: 
    [
        {
            assignmentID: 56,
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
                            description: "1.1",
                            condition: "c",
                            expected: "25",
                            given: "1.1",
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
                            description: "2.1",
                            condition: "c",
                            expected: "25",
                            given: "23",
                            possibleMarks: 25,
                            actualMarks: 20
                        },
                        {
                            testID: 2,
                            description: "2.2",
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

let conversionString = `
Student number:,z5260786
Assignment:,Assignment
Marks:,63
Possible marks:,100


Task, Test, Description, Given, Mark, Possible mark
1, ,Task 1, , 23, 50
1, 1, This is a test description, 23, 23, 50
2, ,Task 2, , 40, 50
2, 1, This is a test description, 23, 20, 25
2, 2, This is a test description, 23, 20, 25
`;