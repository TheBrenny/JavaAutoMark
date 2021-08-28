class AccountModel{
    constructor(databaseModel){
        this.db = databaseModel;
    }

    async createAssignmentTable(){
        let sql = 'create table Assignment ('+
            'assignment_ID int,'+
            'course_ID varchar(100),'+
            'code_location varchar(100) not null,'+
            'primary key  (assignment_ID)'+
            'foreign key (course_ID) references Course(course_ID)'+
        ')';
    }

    async addAssignment(assignmentID, courseID, codeLocation){
        let sql = 'insert into Assignment(assignment_ID, course_ID, code_location)'+
        'values(?,(select course_ID from Course where Course.course_ID = ?))';
        return this.db.query(sql, assignmentID, courseID, codeLocation).then(this.db.changedResponse).then(r => r.success);
    }

    async getAssignment(assignmentID, active){
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `select * from Teacher where assignment_ID=? and active=?`;
        return this.db.query(sql, assignmentID, active).then(this.db.firstRecord);
    }

    async deleteAssignment(assignmentID){
        let sql = 'delete from Assignment where assignment_ID = ?';
        return this.db.query(sql, assignmentID).then(this.db.changedResponse);
    }

    async updateAssignment(){

    }
}
module.exports = AccountModel;