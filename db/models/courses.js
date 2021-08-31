const Model = require("./model");

class CourseModel extends Model {
    constructor(databaseModel) {
        super(databaseModel, CourseModel.table, CourseModel.schema);
    }

    async addCourse(courseID, courseName, runningYear) {
        let sql = `INSERT INTO ${this.table} (course_id, course_name, running_year) VALUES (?, ?, ?)`;
        return this.db.query(sql, courseID, courseName, runningYear).then(this.db.changedResponse).then(r => r.success);
    }

    async getCourse(courseID, runningYear) {
        if (runningYear === undefined) {
            // treat this as a uuid search
            let sql = `SELECT * FROM ${this.table} WHERE uuid=?`;
            return this.db.query(sql, courseID).then(this.db.firstRecord);
        } else {
            let sql = `SELECT * FROM ${this.table} WHERE course_id=? AND running_year=?`;
            return this.db.query(sql, courseID, runningYear).then(this.db.firstRecord);
        }
    }
    async getAllCoursesByYear(runningYear, sort) {
        if (sort === undefined) sort = true;
        if (sort === true) sort = "ORDER BY course_id";
        else if (sort === false) sort = "";

        let sql = `SELECT * FROM ${this.table} WHERE running_year=?`;
        return this.db.query(sql, runningYear);
    }
    async getAllCoursesById(courseID, sort) {
        if (sort === undefined) sort = true;
        if (sort === true) sort = "ORDER BY running_year DESC";
        else if (sort === false) sort = "";

        let sql = `SELECT * FROM ${this.table} WHERE course_id=?`;
        return this.db.query(sql, courseID);
    }
    async getAllCourses(sort) {
        if (sort === undefined) sort = true;
        if (sort === true) sort = "ORDER BY running_year DESC, course_id";
        else if (sort === false) sort = "";

        let sql = `SELECT * FROM ${this.table}`;
        return this.db.query(sql);
    }

    async updateCourse(uuid, options) {
        let vars = [];
        let sql = `UPDATE ${this.table} SET `;

        sql += Object.keys(options).map(e => e + "=?").join(", ");
        vars = Object.values(options);

        sql += ` WHERE uuid=?`;
        vars.push(uuid);

        return this.db.query(sql, ...vars).then(this.db.changedResponse).then(r => r.success);
    }

    async deleteCourse(courseID, runningYear) {
        if (runningYear === undefined) {
            // treat this as a uuid search
            let sql = `DELETE FROM ${this.table} WHERE uuid=?`;
            return this.db.query(sql, courseID).then(this.db.changedResponse).then(r => r.success);
        } else {
            let sql = `DELETE FROM ${this.table} WHERE course_id=? AND running_year=?`;
            return this.db.query(sql, courseID, runningYear).then(this.db.changedResponse).then(r => r.success);
        }
    }

    static get table() {
        return "courses";
    }
    static get fields() {
        return ["uuid", "course_id", "course_name", "running_year"];
    }
}

module.exports = CourseModel;