const db = require("../db");
const fs = require("fs");
const path = require("path");
const config = require("../../config");

let dbScripts = path.resolve(__dirname, "..", "scripts");
let readScript = (s, vars) => {
    let sql = fs.readFileSync(path.join(dbScripts, s)).toString();
    vars = vars || {};
    for (let key of Object.keys(vars)) {
        sql = sql.replace(new RegExp("\\$\\{" + key + "\\}", "g"), vars[key]);
    }
    return sql;
};

const flags = {
    clean: 0b100,
    install: 0b010,
    demo: 0b001,
    full: 0b111,
    skip: 0b1000
};

// installFlags is a bitcode number:
// 100 = clean,
// 010 = install,
// 001 = demo
function install(installFlags) {
    let prom = Promise.resolve();

    if (installFlags < 1) {
        console.log("Please provide some actions:");
        console.log(["  cleanDB", "  installDB", "  demoDB"].join("\n"));
        return Promise.reject("No DB install actions provided");
    }

    if (installFlags & flags.clean) {
        prom = prom.then(() => {
            let sql = readScript("clean.sql", {
                db: config.db.url.pathname.substr(1)
            });
            console.log("Cleaning db");
            return sql;
        }).then((sql) => db.query(sql));
    }
    if (installFlags & flags.install) {
        prom = prom.then(() => {
            let sql = readScript("install.sql");
            console.log("Installing db");
            return sql;
        }).then((sql) => db.query(sql));
    }
    if (installFlags & flags.demo) {
        prom = prom.then(() => {
            let sql = readScript("demo.sql");
            console.log("Inserting demo db");
            return sql;
        }).then((sql) => db.query(sql));
    }

    prom.then(() => {
        console.log("\nAll Done!");
    }).catch(err => console.error(err) && process.exit(1));

    return prom;
}

if (require.main === module) install(process.argv.includes("clean") * 0b100 | process.argv.includes("install") * 0b010 | process.argv.includes("demo") * 0b001);
else module.exports = {
    install,
    flags
};