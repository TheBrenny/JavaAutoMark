const CourseModel = require("./courses");
const Model = require("./model");

class AssignmentModel extends Model {
    constructor(databaseModel) {
        super(databaseModel);
    }

    async addAssignment(assignmentName, courseUUID, codeLocation) {
        let sql = `INSERT INTO ${this.table} (assignment_name, course_uuid, code_location) VALUES(?, ?, ?)`;
        return this.db.query(sql, assignmentName, courseUUID, codeLocation).then(this.db.changedResponse);
    }

    async getAssignment(assignmentID) {
        let sql = `SELECT * FROM ${this.table} WHERE assignment_id=?`;
        return this.db.query(sql, assignmentID).then(this.db.firstRecord);
    }
    async getAllAsignments(courseID, runningYear) {
        if (runningYear === undefined) {
            // treat this as a uuid search
            let sql = `SELECT * FROM ${this.table} WHERE course_uuid=?`;
            return this.db.query(sql, courseID);
        } else {
            let sql = `SELECT * FROM ${this.table} `;
            sql += `INNER JOIN ${CourseModel.table} ON `;
            sql += `${this.table}.course_uuid = ${CourseModel.table}.uuid `;
            sql += `WHERE ${CourseModel.table}.course_id=? AND ${CourseModel.table}.running_year=?`;
            return this.db.query(sql, courseID, runningYear);
        }
    }

    async updateAssignment(id, options) {
        let vars = [];
        let sql = `UPDATE ${this.table} SET `;

        sql += Object.keys(options).map(e => e + "=?").join(", ");
        vars = Object.values(options);

        sql += ` WHERE assignment_id=?`;
        vars.push(id);

        return this.db.query(sql, ...vars).then(this.db.changedResponse).then(r => r.success);
    }

    async deleteAssignment(assignmentID) {
        let sql = `DELETE FROM ${this.table} WHERE assignment_id=?`;
        return this.db.query(sql, assignmentID).then(this.db.changedResponse).then(r => r.success);
    }

    static get table() {
        return "assignments";
    }
    static get fields() {
        return ["assignment_id", "assignment_name", "course_uuid", "code_location"];
    }
}

module.exports = AssignmentModel;