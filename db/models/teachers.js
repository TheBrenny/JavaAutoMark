class TeacherModel {
    constructor(databaseModel) {
        this.db = databaseModel;
    }

    async addUser(zid, email, fname, lname, password) {
        let sql = `INSERT INTO ${this.table} (zid, email, fname, lname, password) VALUES (?, ?, ?, ?, ?)`;
        return this.db.query(sql, zid, email, fname, lname, password).then(this.db.changedResponse).then(r => r.success);
    }

    async getUser(zid) {
        let sql = `SELECT * FROM ${this.table} WHERE zid=?`;
        return this.db.query(sql, zid).then(this.db.firstRecord);
    }

    async updateAccount(zid, newDetails) {
        let vars = [];
        let sql = `UPDATE ${this.table} SET `;

        sql += Object.keys(newDetails).map(e => e + "=?").join(", ");
        vars = Object.values(newDetails);

        sql += ` WHERE zid=?`;
        vars.push(zid);

        return this.db.query(sql, ...vars).then(this.db.changedResponse).then(r => r.success);
    }

    toObject(obj) {
        let fields = ["zid", "email", "fname", "lname", "password"];
        return this.db.toObject(this.table, obj, fields);
    }

    get table() {
        return TeacherModel.table;
    }

    static get table() {
        return "teachers";
    }
}

module.exports = TeacherModel;