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
    async getAllAssignments(courseID, runningYear) {
        let sql = `SELECT * FROM ${this.table} `;

        // Inner Join
        sql += `INNER JOIN ${CourseModel.table} ON `;
        sql += `${this.table}.course_uuid = ${CourseModel.table}.uuid `;
        
        // Where clause
        let where = [];
        let vars = [];
        if(courseID !== undefined) {
            where.push(`course_uuid=?`);
            vars.push(courseID);
        }
        if(runningYear !== undefined) {
            where.push(`running_year=?`);
            vars.push(runningYear);
        }
        sql += where.length > 0 ? ` WHERE ${where.join(" AND ")} ` : "";

        // Order clause and run
        let order = `ORDER BY ${CourseModel.table}.running_year DESC, ${CourseModel.table}.course_id ASC`;
        return this.db.query(sql + order, ...vars);
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