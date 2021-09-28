const db = require("./db");

class Database {
    constructor() {
        this.db = db;
        this.teachers = new(require("./models/teachers"))(this);
        this.publicUrls = new(require("./models/publicUrls"))(this);
    }

    async query(query, ...args) {
        let opts = {
            sql: query,
            nestTables: '_'
        };
        let ret = await this.db.execute(opts, args).catch((e) => (console.error(e), [
            []
        ]));
        return (ret)[0]; // returns the result set
    }

    async changedResponse(results) {
        return {
            success: results.affectedRows > 0,
            affectedRows: results.affectedRows,
            affectedID: results.insertId
        };
    }
    async firstRecord(results) {
        return results[0];
    }

    toObject(table, obj, fields) {
        let ret = {
            from: table
        };
        for(let f of fields) {
            ret[f] = obj[table + "_" + f];
        }
        return ret;
    }
}

function handleOptions(options) {
    if (!options || typeof options === 'string') {
        options = {
            query: options || "1=1"
        };
    }
    options.query = options.query || "1=1";
    options.pagination = options.pagination || 0;
    if (typeof options.pagination === 'number') options.pagination = module.exports.pagination(options.pagination);
    options.fullQuery = !!options.fullQuery;
    return options;
}

function pagination(page) {
    return [page * module.exports.paginationSize, module.exports.paginationSize];
}

module.exports = new Database();
module.exports.handleOptions = handleOptions;
module.exports.paginationSize = 10;
module.exports.pagination = pagination;