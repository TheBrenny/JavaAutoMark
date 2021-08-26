const path = require('path');
let mysql = require("mysql2/promise");
const fs = require('fs');
const config = require('../config');

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const dbFolder = path.join(__dirname);
const sqlFolder = path.join(dbFolder, "scripts");
const templateFolder = path.join(dbFolder, "templates");

module.exports = (async function () {
    if (!global.hasOwnProperty('db')) {
        let dbUrl = config.db.url;
        if (config.db.isDev) {
            dbUrl.searchParams.append("debug", "true");
        }

        global.db = mysql.createConnection({
            uri: dbUrl.href,
            multipleStatements: true
        });
    }
    return global.db;
})();

let dbOps = ["query", "end", "execute"];
dbOps.forEach(op => {
    global.db[op] = module.exports[op] = async function () {
        let theDB = (await global.db);
        return theDB[op].apply(theDB, arguments);
    };
});


module.exports.sessionStore = new MySQLStore({}, global.db);

module.exports.sqlFolder = sqlFolder;
module.exports.sqlFromFile = function (filename) {
    filename = path.basename(filename, path.extname(filename)); // kill the file extension
    filename = path.join(sqlFolder, filename + ".sql"); // add our own!
    return compressSQL(fs.readFileSync(filename).toString());
};
module.exports.templateFromFile = function (filename, values) {
    // filename = path.basename(filename, path.extname(filename)); // kill the file extension
    // opting to not kill the file extension -- this should be documented.
    filename = path.join(templateFolder, filename + ".template.sql"); // add our own!
    let template = compressSQL(fs.readFileSync(filename).toString());

    if (!Array.isArray(values)) values = [values];

    let out = [];

    out.push(template.substring(0, template.indexOf("@{beginDupe}")));
    template = template.substring(template.indexOf("@{beginDupe}") + "@{beginDupe}".length);
    let dupeTemplate = template.substring(0, template.indexOf("@{endDupe}"));

    let dupeArr = [];
    Array.from(values).forEach(v => { // v is an object
        let dupe = dupeTemplate;
        for (let e of Object.entries(v)) {
            let r = new RegExp("\\$\\{" + e[0] + "\\}", "g"); // lucky this is only run by trusted sources using trusted sources...
            dupe = dupe.replace(r, e[1]);
        }
        dupeArr.push(dupe);
    });
    out.push(dupeArr.join(", "));

    out.push(template.substring(template.indexOf("@{endDupe}") + "@{endDupe}".length));

    return compressSQL(out.join(" "));
};
module.exports.compressSQL = compressSQL;

function compressSQL(data) {
    return data.replace(/(\/\*(.|\s)+?\*\/|^\s*--.*?$)/gm, "").replace(/\n\r/, " ").replace(/\s+/, " ").trim();
}

// Returns a Promise!
// This should be used as require('./db').then(blah).blah...