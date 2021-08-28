class AccountModel{
    constructor(databaseModel){
        this.db = databaseModel;
    }

    async createTableTeacher(){
        let sql = 'create table Teacher ('+
            'zID int,'+
            'email varchar(100) not null,'+
            'teacher_name varchar(100) not null,'+
            'teacher_password varchar(100) not null,'+
            'primary key (zID)'+
        ')';
    }

    async addTeacher(zID, email, teacherName, password){
        let sql = 'insert into Teacher (zID, email, teacher_name, teacher_password,)'+
        'values(?, ?, ?, ?)';
        return this.db.query(sql, zID, email, teacherName, password).then(this.db.changedResponse).then(r => r.success);
    }

    async getTeacher(zID, active){
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `select * from Teacher where zID=? and active=?`;
        return this.db.query(sql, zID, active).then(this.db.firstRecord);
    }

    async getTeacherName(teacherName, active){
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `select * from Teacher where teacher_name=? and active=?`;
        return this.db.query(sql, teacherName, active).then(this.db.firstRecord);
    }

    async deleteTeacher(zID){
        let sql = 'delete from Teacher where zID = "?"';
        return this.db.query(sql, zID).then(this.db.changedResponse);
    }
    
    async updateTeacher()
}
module.exports = AccountModel;