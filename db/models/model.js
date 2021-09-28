class Model {
    constructor(db) {
        this.db = db;
        this.table = this.constructor.table;
        this.fields = this.constructor.fields;
    }

    toObject(obj, ...includeTables) {
        if(!!includeTables) includeTables = Array.from(includeTables);
        if(Array.isArray(obj)) return Array.from(obj).map(o => this.toObject(o, ...includeTables));
        return this.db.toObject(this.table, obj, this.fields, ...includeTables);
    }

    static get fields() {
        throw new Error("Model is effectively abstract and must be extended not instatiated");
    }
    static get table() {
        throw new Error("Model is effectively abstract and must be extended not instatiated");
    }
}

module.exports = Model;