const Model = require("./model");

class TestCaseModel extends Model {
    constructor(databaseModel) {
        super(databaseModel);
    }

    async addTestCase(testID, expectation, testCodeLocation, assignmentID) {
        let sql = 'insert into TestCase(test_ID, expectation, test_code_location, assignment_ID)' +
            'values(?, ?, ?,(select assignment_ID from Assignment where Assignment.assignment_ID = ?))';
        return this.db.query(sql, testID, expectation, testCodeLocation, assignmentID).then(this.db.changedResponse).then(r => r.success);
    }

    async getTestCase(testID, active) {
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `select * from TestCase where test_ID=? and active=?`;
        return this.db.query(sql, testID, active).then(this.db.firstRecord);
    }

    static get table() {
        return "teachers";
    }
    static get fields() {
        return ["zid", "email", "fname", "lname", "password"];
    }
}

module.exports = TestCaseModel;