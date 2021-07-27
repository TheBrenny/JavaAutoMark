class AccountModel {
    constructor(databaseModel) {
        this.db = databaseModel;
    }

    async addUser(username, password) {
        let sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
        return this.db.query(sql, username, password).then(this.db.changedResponse).then(r => r.success);
    }

    async getUser(username, active) {
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `SELECT * FROM users WHERE username=? AND active=?`;
        return this.db.query(sql, username, active).then(this.db.firstRecord);
    }

    async getUserByID(id, active) {
        if (active === null || active === undefined) active = 1;
        active *= 1;
        let sql = `SELECT * FROM users WHERE id=? AND active=?`;
        return this.db.query(sql, id, active).then(this.db.firstRecord);
    }

    async updateAccount(targetID, newDetails) {
        let vars = [];
        let sql = `UPDATE users SET `;

        sql += Object.keys(newDetails).map(e => e + "=?").join(", ");
        vars = Object.values(newDetails);

        sql += ` WHERE id=?`;
        vars.push(targetID);

        return this.db.query(sql, ...vars).then(this.db.changedResponse).then(r => r.success);
    }

    async getRemembered(selector) {
        let sql = `SELECT * FROM rememberTokens WHERE selector=?`;
        return this.db.query(sql, selector).then(this.db.firstRecord);
    }

    async setRemembered(user, selector, validatorHash) {
        let sql = `INSERT INTO rememberTokens (selector, validator, user) VALUES (?,?,?)`;
        return this.db.query(sql, selector, validatorHash, user).then(this.db.changedResponse);
    }

    async deleteRemembered(selector) {
        let sql = `DELETE FROM rememberTokens WHERE selector=?`;
        return this.db.query(sql, selector).then(this.db.changedResponse);
    }
}

module.exports = AccountModel;