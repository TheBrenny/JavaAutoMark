const Model = require("./model");

class TeacherModel extends Model {
    constructor(databaseModel) {
        super(databaseModel);
    }

    async addTeacher(zid, email, fname, lname, password) {
        let sql = `INSERT INTO ${this.table} (zid, email, fname, lname, password) VALUES (?, ?, ?, ?, ?)`;
        return this.db.query(sql, zid, email, fname, lname, password).then(this.db.changedResponse).then(r => r.success);
    }

    async getTeacher(zid) {
        let sql = `SELECT * FROM ${this.table} WHERE zid=?`;
        return this.db.query(sql, zid).then(this.db.firstRecord);
    }

    async getAllTeachers() {
        let sql = `SELECT * FROM ${this.table}`;
        return this.db.query(sql);
    }

    async updateTeacher(zid, newDetails) {
        let vars = [];
        let sql = `UPDATE ${this.table} SET `;

        sql += Object.keys(newDetails).map(e => e + "=?").join(", ");
        vars = Object.values(newDetails);

        sql += ` WHERE zid=?`;
        vars.push(zid);

        return this.db.query(sql, ...vars).then(this.db.changedResponse).then(r => r.success);
    }

    async deleteTeacher(zid) {
        let sql = `DELETE FROM ${this.table} WHERE zid=?`;
        return this.db.query(sql, zid).then(this.db.changedResponse).then(r => r.success);
    }

    static get table() {
        return "teachers";
    }
    static get fields() {
        return ["zid", "email", "fname", "lname", "password"];
    }
}

module.exports = TeacherModel;