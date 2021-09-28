const AssignmentModel = require("./assignments");
const CourseModel = require("./courses");
const Model = require("./model");

class ReportModel extends Model {
    constructor(databaseModel) {
        super(databaseModel);
    }

    async addReport(zID, studentName, reportLocation, assignmentID) {
        let sql = `INSERT INTO ${this.table} (zid, student_name, report_location, assignment_id) VALUES (?, ?, ?, ?)`;
        return this.db.query(sql, zID, studentName, reportLocation, assignmentID).then(this.db.changedResponse).then(r => r.success);
    }

    async getReport(reportID) {
        let sql = `SELECT * FROM ${this.table} WHERE id=?`;
        return this.db.query(sql, reportID, active).then(this.db.firstRecord);
    }

    async getReportsForStudent(zid) {
        let sql = `SELECT * FROM ${this.table} WHERE zid=?`;
        return this.db.query(sql, zid);
    }
    async getReportsForAssignment(assignmentID) {
        let sql = `SELECT * FROM ${this.table} WHERE assignment_id=?`;
        return this.db.query(sql, assignmentID);
    }
    async getSpecificReport(zid, assignmentID) {
        let sql = `SELECT * FROM ${this.table} WHERE zid=? AND assignment_id=?`;
        return this.db.query(sql, zid, assignmentID).then(this.db.firstRecord);
    }
    async getReportsForCourse(courseID, runningYear) {
        let sql = `SELECT * FROM ${this.table} `;
        sql += `INNER JOIN ${AssignmentModel.table} ON `;
        sql += `${this.table}.assignment_id = ${AssignmentModel.table}.assignment_id `;
        sql += `INNER JOIN ${CourseModel.table} ON `;
        sql += `${AssignmentModel.table}.course_uuid = ${CourseModel.table}.uuid `;
        if (runningYear === undefined) {
            // Course UUID was given
            sql += `WHERE ${CourseModel.table}.uuid=?`;
            return this.db.query(sql, courseID);
        } else {
            sql += `WHERE ${CourseModel.table}.course_id=? AND ${CourseModel.table}.running_year=?`;
            return this.db.query(sql, courseID, runningYear);
        }
    }

    async updateReport(reportID, options) {
        let vars = [];
        let sql = `UPDATE ${this.table} SET `;

        sql += Object.keys(options).map(e => e + "=?").join(", ");
        vars = Object.values(options);

        sql += ` WHERE id=?`;
        vars.push(reportID);

        return this.db.query(sql, ...vars).then(this.db.changedResponse).then(r => r.success);
    }

    async deleteReport(reportID) {
        let sql = `DELETE FROM ${this.table} where id=?`;
        return this.db.query(sql, reportID).then(this.db.changedResponse).then(r => r.success);
    }

    static get table() {
        return "reports";
    }
    static get fields() {
        return ["id", "zid", "student_name", "report_location", "assignment_id"];
    }
}

module.exports = ReportModel;