class AccountModel{
    constructor(databaseModel){
        this.db = databaseModel;
    }

    async createReportTable(){
        let sql = 'create table Report ('+
            'report_ID int,'+
            'zID int not null,'+
            'student_name varchar(100) not null,'+
            'report_location varchar(100) not null,'+
            'assignment_ID int not null,'+
            'primary key  (report_ID)'+
            'foreign key (assignment_ID) references Assignment(assignment_ID)'+
        ')';
    }

    async addReport(reportID, zID, studentName,){
        let sql = 'insert into Report(report_ID, zID, student_name, report_location, assignment_ID)'+
        'values(?, ?, ?, ?, (select assignment_ID from Assignment where Assignment.assignment_ID = ?))';
        return this.db.query(sql, reportID, zID, studentName).then(this.db.changedResponse).then(r => r.success);
    }

    async getReport(reportID, active){
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `select * from Report where report_ID=? and active=?`;
        return this.db.query(sql, reportID, active).then(this.db.firstRecord);
    }

    async deleteReport(reportID){
        let sql = 'delete from Report where report_ID = ?';
        return this.db.query(sql, reportID).then(this.db.changedResponse);
    }

    async updateReport(){

    }
}
module.exports = AccountModel;