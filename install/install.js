const semver = require("semver");
const version = require("../package.json").version;
const nonce = require("nonce-express")();
let fs = require("fs");
let path = require("path");
const inquirer = require("inquirer");
inquirer.registerPrompt('fts', require("inquirer-file-tree-selection-prompt"));

const configPath = path.resolve(__dirname, "..", "config");
const configFile = path.join(configPath, "config.json");


async function checkInstall() {
    let installLock = path.join(__dirname, "install.lock");
    if (fs.existsSync(installLock)) {
        let oldVersion = semver.clean(fs.readFileSync(installLock, "utf8"));
        console.log("install.lock found! Installed version: " + colourText(oldVersion, "yellow"));
        console.log("Incoming version: " + colourText(version, "green"));

        if (semver.gt(version, oldVersion)) console.log("It looks like you should update instead of install.");
        else if (semver.lt(version, oldVersion)) console.log("It looks like an upgrade has already occured.");
        else if (semver.eq(version, oldVersion)) console.log("It looks like an installation for this version has already occured.");

        return (await inquirer.prompt({
            name: "0",
            type: "confirm",
            message: "Do you want to continue and overwrite the current configuration?",
            default: false,
        }))[0];
    }
    return true;
}

async function install() {
    let config = {};
    let copyGcsConfig = false;
    let happy = false;
    let output;

    while (!happy) {



        // STORAGE
        let providers = ["localstorage", "aws", "gcs", "azure"];
        config.storage = {};
        config.storage.provider = (await askList("What storage provider do you want to use?", providers, 0));

        let pIndex = ["aws", "gcs", "azure"].indexOf(config.storage.provider);
        let pName = (["AWS", "GCS", "Azure"])[pIndex];
        let accessIDName = (["Access Key ID", "Project ID", "Storage Account"])[pIndex];
        let secretName = (["Secret Access Key", "Key Filename", "Storage Access Key"])[pIndex];
        let containerName = (["Bucket", "Bucket", "Container"])[pIndex];

        config.storage.options = {};
        if (config.storage.provider === "localstorage") {
            config.storage.options.path = (await askPath("Where do you want to store your files?", "/"));
        } else {
            config.storage.options.accessID = (await ask(`What is your ${config.storage.provider} ${accessIDName}?`));
            if (config.storage.provider === "gcs") {
                config.storage.options.secret = (await askPath("Where is your GCS JSON keyfile stored?", ".json"));
            } else {
                config.storage.options.secret = (await ask(`What is your ${config.storage.provider} ${secretName}?`));
            }
            config.storage.options.container = (await ask(`What is your ${config.storage.provider} ${containerName} name?`, "jam-store"));
        }



        // DATABASE
        config.sql = {};
        if (await askYN("Do you want to enter an SQL URL instead of connection details?", true)) {
            config.sql.url = await ask("What is your MySQL database URL?");
        } else {
            let user = await ask("What is your MySQL username?");
            let pass = await ask("What is your MySQL password?");
            let host = await ask("What is your MySQL hostname?");
            let port = await ask("What is your MySQL port?", "3306");
            let db = await ask("What is your MySQL database name?", "jam");
            config.sql.url = `mysql://${user}:${pass}@${host}:${port}/${db}`;
        }



        // SESSION
        config.session = {};
        config.session.secret = await ask("What is your session secret? (leave empty for random 32-char secret)");
        if (config.session.secret === "") config.session.secret = nonce.genNonce(32);
        config.session.cookieName = await ask("What do you want your session cookie name to be called?", "session");



        // CONFIRM
        output = JSON.stringify(config, null, 4);
        output = output.replace(/: (".*?")(,|$)/gm, `: ${colour("yellow")}$1${colour("reset")}$2`);
        console.log(output);
        happy = await askYN("Are you happy with the above settings? ", true);
    }

    if (copyGcsConfig) {
        let dest = path.join(configPath, "gcs-config.json");
        fs.copyFileSync(config.storage.options.secret, dest);
        config.storage.options.secret = dest;
    }

    await fs.promises.writeFile(configFile, JSON.stringify(config, null, 4));
    return fs.promises.writeFile(path.join(__dirname, "install.lock"), `${version}`);
}

async function exit(err) {
    if (err) {
        process.stderr.write(colourText("\nSomething occured during installation:\n", "red", "italic"));
        process.stderr.write(colour("red"));
        console.error(err); // left as console so we can get object writing
        process.stderr.write(colour("reset"));
    }
}

const colours = {
    'red': 31,
    'green': 32,
    'yellow': 33,
    'blue': 34,
    'magenta': 35,
    'cyan': 36,
    'white': 37,
    'bright black': 90,
    'bright red': 91,
    'bright green': 92,
    'bright yellow': 93,
    'bright blue': 94,
    'bright magenta': 95,
    'bright cyan': 96,
    'bright white': 97
};
const attribs = {
    'reset': 0,
    'bold': 1,
    'dim': 2,
    'italic': 3,
    'underline': 4,
    'slow blink': 5,
    'fast blink': 6,
    'inverse': 7,
    'hidden': 8,
    'strike': 9,
};

function colour(c, a) {
    if (c === 'reset') return "\033[0m";
    if (!a) a = "reset";
    return "\x1b[" + attribs[a] + ";" + colours[c] + "m";
}

function colourText(s, c, a) {
    return colour(c, a) + s + colour("reset");
}

async function ask(message, best) {
    return (await inquirer.prompt({
        type: "input",
        name: "d",
        message: message,
        default: best
    })).d;
}

async function askList(message, list, best) {
    return (await inquirer.prompt({
        type: "list",
        name: "d",
        message: message,
        choices: list,
        default: best || 0
    })).d;
}

async function askPath(message, ext) {
    return (await inquirer.prompt({
        type: "fts",
        name: "d",
        message: message,
        validate: (item) => {
            if (ext == undefined) return true;
            if (["/", "\\"].includes(ext)) return fs.statSync(item).isDirectory();
            return path.extname(item) === ext;
        }
    })).d;
}

async function askYN(message, best) {
    return (await inquirer.prompt({
        type: "confirm",
        name: "d",
        message: message,
        default: best
    })).d;
}

if (require.main === module) {
    process.on("SIGINT", exit);
    Promise.resolve()
        .then(checkInstall)
        .then((cont) => {
            if (!cont) {
                console.log(colourText("Already installed", "green", "italic"));
                process.exit(0);
            } else return install();
        })
        .then(() => {
            let installDB = require("../db/tools/installDB");
            return installDB.install(installDB.flags.clean | installDB.flags.install);
        })
        .then(() => {
            console.log(colourText("\nInstallation complete!", "green", "italic"));
            process.exit(0);
        })
        .catch(exit);
} else module.exports = {
    checkInstall,
    install,
    colour,
    colourText
};