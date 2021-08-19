class PublicUrlModel {
    constructor(databaseModel) {
        this.db = databaseModel;
    }

    async addUrl(method, path, token, expires) {
        let sql = `INSERT INTO public_urls (method, path, token, expires) VALUES (?, ?, ?, ?)`;
        return this.db.query(sql, method, path, token, expires).then(this.db.changedResponse);
    }

    async getUrl(method, path) {
        let sql = `SELECT * FROM public_urls WHERE method=? AND path=?`;
        return this.db.query(sql, method, path).then(this.db.firstRecord);
    }
    async getUrlFromToken(token) {
        let sql = `SELECT * FROM public_urls WHERE token=?`;
        return this.db.query(sql, token).then(this.db.firstRecord);
    }

    async updateUrl(method, path, token, expires) {
        let sql = `UPDATE public_urls SET token=?, expires=? WHERE method=? AND path=?`;
        return this.db.query(sql, token, expires, method, path).then(this.db.changedResponse);
    }

    async removeUrl(method, path) {
        let sql = `DELETE FROM public_urls WHERE method=? AND path=?`;
        return this.db.query(sql, method, path).then(this.db.changedResponse);
    }

    get tableName() {
        return PublicUrlModel.tableName;
    }

    static get tableName() {
        return "public_urls";
    }
}

module.exports = PublicUrlModel;