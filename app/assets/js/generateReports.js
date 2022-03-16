let totalReport = {

    assignmentID: 0,
    assignmentTitle: "",

    totalStudents: 0,

    minMark: null,
    maxMark: null,

    possibleMarks: 0,
    actualMarks: 0,
    averageMarks: 0,

    tasks: []
};

async function generateCSV(objectA, objectB) {
    //In the form of generateCSV(report) or generateCSV(assignment, marker)
    let object = (objectB !== undefined) ? makeReport(objectA, objectB) : objectA;

    let student = object.studentID;
    let assignmentID = object.assignmentID;

    let filePath = `A${assignmentID}/${student}/${student}`;

    let csv = convertToCSV(object);
    storage.putObject(storage.container, `${filePath}.csv`, csv);
}

async function pullCSV(object) {
    let student = object.studentID;
    let assignmentID = object.assignmentID;
    
    let filePath = `A${assignmentID}/${student}/${student}`;
    
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

async function generateTotalCSV(object) {
        
    let assignmentID = object.assignmentID;

    let filePath = `A${assignmentID}/total`;

    let csv = convertTotalCSV(object);
    storage.putObject(storage.container, `${filePath}.csv`, csv);
}

async function pullTotalCSV(object) {
    let assignmentID = object.assignmentID;
    
    let filePath = `A${assignmentID}/total`;
    
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
        return convertFromTotalCSV(file);
    });
}

function convertFromCSV(toConvert) {
    
    const split = toConvert.split('\n').join(',').split(',');

    let report = {
        studentID: split[3],
        assignmentTitle: split[5],
        actualMarks: split[7],
        possibleMarks: split[9],
        teacherComment: split[11],
        tasks: []
    }

    //Every row is 6 elements [task, test, desc, given, mark, possible] starting at index 18
    let taskIndex = 0;
    let testIndex = 0;
    for( let i = 20; i < split.length - 6; i += 6) {

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
    str += `Possible marks:,${toConvert.possibleMarks}\n`;
    str += `Teacher comment:,${toConvert.teacherComment ?? ""}\n\n\n`;
    str += `Task,Test,Description,Given,Mark,Possible mark\n`;

    toConvert.tasks.forEach(task => {
        str += `${task.taskID},,Task ${task.taskID}, ,${task.actualMarks},${task.possibleMarks}\n`;

        task.tests.forEach(test => {
            str += `${task.taskID},${test.testID},${test.description},${test.given},${test.actualMarks},${test.possibleMarks}\n`
        })
    });

    return str;
}

function convertFromTotalCSV(toConvert) {
    
    const split = toConvert.split('\n').join(',').split(',');

    let report = {
        assignmentID: split[3],
        assignmentTitle: split[5],
        actualMarks: split[7],
        averageMarks: split[9],
        possibleMarks: split[11],
        minMark: split[13],
        maxMark: split[15],
        totalStudents: split[17],
        tasks: []
    }

    //Every row is 6 elements [task, test, desc, given, mark, possible] starting at index 18
    let taskIndex = 0;
    let testIndex = 0;
    for( let i = 28; i < split.length - 8; i += 8) {
        if(split[i] != taskIndex) {
            let t = {
                taskID: 0,
                actualMarks: 0,
                possibleMarks: 0,
                averageMarks: 0,
                tests: []
            };
            t.taskID = split[i];
            t.actualMarks = split[i + 5];
            t.possibleMarks = split[i + 6];
            t.averageMarks = split[i + 7];
            report.tasks.push(t);
            testIndex = 0;
            taskIndex++;
        } else {
            let t = {
                testID: 0,
                description: "",
                expected: "",
                passed: 0,
                possibleMarks: 0,
                actualMarks: null,
                averageMarks: 0
            };
            
            t.testID = split[i + 1];
            t.description = split[i + 2];
            t.expected = split[i + 3];
            t.passed = split[i + 4];
            t.actualMarks = split[i + 5];
            t.possibleMarks = split[i + 6];
            t.averageMarks = split[i + 7];

            report.tasks[taskIndex - 1].tests.push(t);

            testIndex++;
        }
        
    }
    
    return report;
}

function convertTotalCSV(toConvert) {
    let str = "\n\n";

    str += `Assignment ID:,${toConvert.assignmentID}\n`;
    str += `Assignment:,${toConvert.assignmentTitle}\n`;
    str += `Total mark:,${toConvert.actualMarks}\n`;
    str += `Average mark:,${toConvert.averageMarks}\n`;
    str += `Possible marks:,${toConvert.possibleMarks}\n`;
    str += `Minimum marks:,${toConvert.minMark}\n`;
    str += `Maximum marks:,${toConvert.maxMark}\n`;
    str += `Total students:,${toConvert.totalStudents ?? ""}\n\n\n`;
    str += `Task,Test,Description,Expected,Students passed,Mark,Possible mark,Average Mark\n`;

    toConvert.tasks.forEach(task => {
        str += `${task.taskID},,Task ${task.taskID},,,${task.actualMarks},${task.possibleMarks},${task.averageMarks}\n`;

        task.tests.forEach(test => {
            str += `${task.taskID},${test.testID},${test.description},${test.expected},${test.passed},${test.actualMarks},${test.possibleMarks},${test.averageMarks}\n`
        })
    });

    return str;
}

function makeReport(assignment, marker) {
    let results = marker.results;

    let report = {
        assignmentID: assignment.id,
        assignmentTitle: assignment.title,
        studentID: marker.student.student,
        teacherComment: "",
        possibleMarks: 0,
        actualMarks: 0,
        tasks: []
    }

    let taskIndex = 0;
    assignment.tasks.forEach(task => {
        let ta = {
            taskID: task.taskID,
            possibleMarks: 0,
            actualMarks: 0,
            tests: []
        };

        task.tests.forEach(test => {
            let te = {
                testID: test.testID,
                description: test.description,
                given: results?.[`${task.taskID}`]?.[`${test.testID}`]?.output ?? "Invalid",
                possibleMarks: test.marks,
                actualMarks: results?.[`${task.taskID}`]?.[`${test.testID}`]?.passed ? test.marks : 0,
            };

            ta.tests.push(te);
            ta.possibleMarks += te.possibleMarks;
            ta.actualMarks += te.actualMarks;
        });

        report.possibleMarks += ta.possibleMarks;
        report.actualMarks += ta.actualMarks;

        report.tasks.push(ta);

        taskIndex++;
    });

    makeTotalReport(report, assignment);
    if(totalReport.totalStudents == assignment.students.length){
        generateTotalCSV(totalReport);
    }
    return report;
    
}

function makeTotalReport(resultSet, assignment) {
    
    
    totalReport.assignmentTitle = resultSet.assignmentTitle;
    totalReport.assignmentID = assignment.id;
    totalReport.totalStudents++;
    //Possible marks always the same, actual marks add up for average
    totalReport.possibleMarks = resultSet.possibleMarks;
    totalReport.actualMarks += resultSet.actualMarks;
    totalReport.averageMarks = totalReport.actualMarks / totalReport.totalStudents;

    //Check max and min for evaluation
    if(totalReport.minMark == null || resultSet.actualMarks < totalReport.minMark)
        totalReport.minMark = resultSet.actualMarks;

    if(totalReport.maxMark == null || resultSet.actualMarks > totalReport.maxMark)
        totalReport.maxMark = resultSet.actualMarks;

    //Handle each task in each student report
    resultSet.tasks.forEach((t, index, arr) => {
        //If we have less tasks than the result set, add a new task
        if(totalReport.tasks.length < resultSet.tasks.length) {
            totalReport.tasks.push({
                taskID: 0,
                possibleMarks: 0,
                actualMarks: null,
                averageMarks: 0,
                tests: []
            });
        }
        totalReport.tasks[index].taskID = t.taskID;
        totalReport.tasks[index].possibleMarks = t.possibleMarks;
        totalReport.tasks[index].actualMarks = (totalReport.tasks[index].actualMarks ?? 0) + t.actualMarks;
        totalReport.tasks[index].averageMarks = totalReport.tasks[index].actualMarks / totalReport.totalStudents;

        t.tests.forEach((test, testIndex, arr) => {
            if(totalReport.tasks[index].tests.length < t.tests.length) {
                totalReport.tasks[index].tests.push({
                    testID: 0,
                    description: "",
                    expected: "",
                    passed: 0,
                    possibleMarks: 0,
                    actualMarks: null,
                    averageMarks: 0
                });
            }

            totalReport.tasks[index].tests[testIndex].testID = test.testID;
            totalReport.tasks[index].tests[testIndex].description = test.description;
            totalReport.tasks[index].tests[testIndex].expected = assignment.tasks[index].tests[testIndex].isException ? "Exception." : assignment.tasks[index].tests[testIndex].expected;
            totalReport.tasks[index].tests[testIndex].passed += (test.actualMarks > 0 ? 1 : 0);
            totalReport.tasks[index].tests[testIndex].possibleMarks = test.possibleMarks;
            totalReport.tasks[index].tests[testIndex].actualMarks = (totalReport.tasks[index].tests[testIndex].actualMarks ?? 0) + test.actualMarks;
            totalReport.tasks[index].tests[testIndex].averageMarks = totalReport.tasks[index].tests[testIndex].actualMarks / totalReport.totalStudents;
        });
    });
}

if(typeof module !== "undefined") module.exports = {generateCSV, pullCSV, generateTotalCSV, pullTotalCSV};