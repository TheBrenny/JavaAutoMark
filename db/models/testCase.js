class AccountModel{
    constructor(databaseModel){
        this.db = databaseModel;
    }

    async createTestCaseTable(){
        let sql = 'create table TestCase ('+
            'test_ID int,'+
            'expectation varchar(250) not null,'+
            'test_code_location varchar(100) not null,'+
            'assignment_ID int not null,'+
            'primary key  (test_ID)'+
            'foreign key (assignment_ID) references Assignment(assignment_ID)'+
        ')';
    }

    async addTestCase(testID, expectation, testCodeLocation, assignmentID){
        let sql = 'insert into TestCase(test_ID, expectation, test_code_location, assignment_ID)'+
        'values(?, ?, ?,(select assignment_ID from Assignment where Assignment.assignment_ID = ?))';
        return this.db.query(sql, testID, expectation, testCodeLocation, assignmentID).then(this.db.changedResponse).then(r => r.success);
    }

    async getTestCase(testID, active){
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `select * from TestCase where test_ID=? and active=?`;
        return this.db.query(sql, testID, active).then(this.db.firstRecord);
    }
}