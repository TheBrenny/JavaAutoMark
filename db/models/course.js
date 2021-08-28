class AccountModel{
    constructor(databaseModel){
        this.db = databaseModel;
    }

    async createCourseTable(){
        let sql = 'create table Course ('+
            'course_ID varchar(100),'+
            'course_name varchar(100) not null,'+
            'primary key  (course_ID)'+
        ')';
    }
}