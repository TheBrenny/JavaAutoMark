class PublicUrlModel {
    constructor(databaseModel) {
        this.db = databaseModel;
    }

    async addUrl(method, path, token, expires) {
        let sql = `INSERT INTO ${this.table} (method, path, token, expires) VALUES (?, ?, ?, ?)`;
        return this.db.query(sql, method, path, token, expires).then(this.db.changedResponse);
    }

    async getUrl(method, path) {
        let sql = `SELECT * FROM ${this.table} WHERE method=? AND path=?`;
        return this.db.query(sql, method, path).then(this.db.firstRecord);
    }
    async getUrlFromToken(method, token) {
        let sql = `SELECT * FROM ${this.table} WHERE method=? AND token=?`;
        return this.db.query(sql, method.toLowerCase(), token).then(this.db.firstRecord);
    }

    async updateUrl(method, path, token, expires) {
        let sql = `UPDATE ${this.table} SET token=?, expires=? WHERE method=? AND path=?`;
        return this.db.query(sql, token, expires, method, path).then(this.db.changedResponse);
    }

    async removeUrl(method, path) {
        let sql = `DELETE FROM ${this.table} WHERE method=? AND path=?`;
        return this.db.query(sql, method, path).then(this.db.changedResponse);
    }

    get table() {
        return PublicUrlModel.table;
    }

    static get table() {
        return "public_urls";
    }
}

module.exports = PublicUrlModel;