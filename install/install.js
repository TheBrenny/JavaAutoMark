const semver = require("semver");
const wget = require("wget-improved");
const progress = require("cli-progress");
const decompress = require("decompress");
const version = require("../package.json").version;
const nonce = require("nonce-express")();
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
inquirer.registerPrompt('fts', require("inquirer-file-tree-selection-prompt"));

const driveRoot = path.resolve(...process.cwd().split(path.sep).map(() => ".."));
let oldVersion = "0.0.0";
const lockfile = path.join(__dirname, "install.lock");
const configPath = path.resolve(__dirname, "..", "config");
const configFile = path.join(configPath, "config.json");
let oldConfig = {};

const installerChoices = {
    "Overwrite installation": 1,
    "Update only": 2,
    "Don't install and try run": 0
};

// API Ref: https://api.adoptopenjdk.net/q/swagger-ui/#/Assets/searchReleasesByVersion
const javaVersion = "11";
const getJavaLink = async (os, arch) => {
    let url = new URL(`https://api.adoptopenjdk.net/v3/assets/version/(${javaVersion},${javaVersion + 1})?image_type=jre&jvm_impl=hotspot&lts=true`);
    let map = {
        "win32": "windows",
        "darwin": "mac",
        "linux": "linux",
        "x32": "x32",
        "x64": "x64",
        "s390x": "s390x",
        "ppc64": "ppc64le",
        "arm64": "aarch64",
        "arm": "arm"
    };
    url.searchParams.append("os", map[os]);
    url.searchParams.append("arch", map[arch]);
    return new Promise((resolve, reject) => {
        let req = wget.request({
            protocol: url.protocol.trim().toLowerCase().replace(/:$/, ""),
            host: url.hostname,
            path: url.href,
            method: "GET"
        }, (res) => {
            if(res.statusCode === 404) return resolve(undefined);
            if(res.statusCode !== 200) return reject(new Error("Error getting latest version: " + res.statusCode));

            let content = "";
            res.on("data", (chunk) => content += chunk);
            res.on("end", () => resolve(JSON.parse(content)));
        });

        req.end();
    }).then(json => json === undefined ? undefined : json[0].binaries[0].package.link);
};

async function getInstalledVersion() {
    if(oldVersion !== "0.0.0") return oldVersion;
    if(!fs.existsSync(lockfile)) return "0.0.0";
    oldVersion = semver.clean(await fs.promises.readFile(lockfile, "utf8"));
    return oldVersion;
}

async function getInstalledConfig() {
    if(!fs.existsSync(configFile)) return {};
    else return (oldConfig = JSON.parse(await fs.promises.readFile(configFile, "utf8")));
}

async function checkInstall() {
    await getInstalledVersion();

    let choice = Object.keys(installerChoices)[0];

    if(fs.existsSync(lockfile)) {
        console.log("install.lock found! Installed version: " + colourText(oldVersion, "yellow"));
        console.log("Incoming version: " + colourText(version, "green"));

        let choices = [];
        choices.push(Object.keys(installerChoices)[0]);

        if(semver.gt(version, oldVersion)) {
            console.log(colourText("    New version available! You can update only!", "yellow", "bold"));
            choices.push(Object.keys(installerChoices)[1]);
        }
        else if(semver.lt(version, oldVersion)) console.log("It looks like an upgrade has already occured.");
        else if(semver.eq(version, oldVersion)) console.log("It looks like an installation for this version has already occured.");

        choices.push(Object.keys(installerChoices)[2]);

        choice = (await inquirer.prompt({
            name: "0",
            type: "list",
            message: "What action to you want to take?",
            default: 1,
            choices: choices
        }))[0];
    }

    return installerChoices[choice];
}

async function install(method) {
    await getInstalledConfig();

    let config = {};
    let copyGcsConfig = false;
    let happy = false;
    let output;

    let methodVersion = method === 1 ? "0.0.0" : oldVersion;
    if(method === 0) return Promise.resolve();
    if(method === undefined) method = 2;

    while(!happy) {


        // The if conditions at the start of each block are to check to see if we've already installed that stuff.
        // This is useful for when we're updating from 1.0.0 to 1.1.0 for example, because we'll skip all the settings
        // that we'eve already installed, hit the new ones -- that is hit the settings that are introduced in a version
        // that is greater than our current one.
        // For example, run `git pull && npm install && npm start` and you might see it update if this package did


        // STORAGE
        if(semver.lt(methodVersion, "1.0.0")) {
            let providers = ["localstorage", "aws", "gcs", "azure"];
            config.storage = {};
            config.storage.provider = (await askList("What storage provider do you want to use?", providers, 0));

            let pIndex = ["aws", "gcs", "azure"].indexOf(config.storage.provider);
            let pName = (["AWS", "GCS", "Azure"])[pIndex];
            let accessIDName = (["Access Key ID", "Project ID", "Storage Account"])[pIndex];
            let secretName = (["Secret Access Key", "Key Filename", "Storage Access Key"])[pIndex];
            let containerName = (["Bucket", "Bucket", "Container"])[pIndex];

            config.storage.options = {};
            if(config.storage.provider === "localstorage") {
                config.storage.options.path = (await askPath("Where do you want to store your files?", "/"));
            } else {
                config.storage.options.accessID = (await ask(`What is your ${pName} ${accessIDName}?`));
                if(config.storage.provider === "gcs") {
                    config.storage.options.secret = (await askPath("Where is your GCS JSON keyfile stored?", ".json"));
                } else {
                    config.storage.options.secret = (await ask(`What is your ${pName} ${secretName}?`));
                }
                config.storage.options.container = (await ask(`What is your ${pName} ${containerName} name?`, "jam-store"));
            }
        }


        // DATABASE
        if(semver.lt(methodVersion, "1.0.0")) {
            config.sql = {};
            if(await askYN("Do you want to enter an SQL URL instead of connection details?", true)) {
                config.sql.url = await ask("What is your MySQL database URL?");
            } else {
                let user = await ask("What is your MySQL username?");
                let pass = await ask("What is your MySQL password?");
                let host = await ask("What is your MySQL hostname?");
                let port = await ask("What is your MySQL port?", "3306");
                let db = await ask("What is your MySQL database name?", "jam");
                config.sql.url = `mysql://${user}:${pass}@${host}:${port}/${db}`;
            }
        }



        // SESSION
        if(semver.lt(methodVersion, "1.0.0")) {
            config.session = {};
            config.session.secret = await ask("What is your session secret? (leave empty for random 32-char secret)");
            if(config.session.secret === "") config.session.secret = nonce.genNonce(32);
            config.session.cookieName = await ask("What do you want your session cookie name to be called?", "session");
        }



        // JAVA
        if(semver.lt(methodVersion, "1.1.0")) {
            config.java = {};

            if(await askYN("Do you want to locate your own Java Executable (saying no will download our recommended executable)?", true)) {
                config.java.java = await askPath("Where is your java executable located?", undefined, driveRoot);
            } else {
                const exeExt = (process.platform === "win32" ? ".exe" : ""); // used to add .exe on windows
                const javaLink = await getJavaLink(process.platform, process.arch);
                if(javaLink === undefined) throw new Error(`Unsupported platform/architecture combination [${process.platform}/${process.arch}]. Please provide your own binary.`);
                const javaLoc = path.resolve(__dirname, "..", "app", "jenv", "bin", "jre" + javaVersion);
                const zipLoc = path.resolve(javaLoc + getFileExtension(javaLink));
                fs.mkdirSync(javaLoc, {recursive: true});

                await download(javaLink, zipLoc, false);
                await extract(zipLoc, javaLoc);
                await fs.promises.unlink(zipLoc);

                config.java.java = path.resolve(javaLoc, "bin", "java" + exeExt);
            }

            if(await askYN("Do you want to locate your own Java Compiler (saying no will download our recommended compiler)?", false)) {
                config.java.compiler = await askPath("Where is your java compiler located?", undefined, driveRoot);
            } else {
                const compilerLink = "https://mirror.aarnet.edu.au/pub/eclipse/eclipse/downloads/drops4/R-4.20-202106111600/ecj-4.20.jar";
                const compilerLoc = path.resolve(__dirname, "..", "app", "jenv", "bin", "compiler.jar");
                fs.mkdirSync(path.dirname(compilerLoc), {recursive: true});

                await download(compilerLink, compilerLoc, false);
                config.java.compiler = compilerLoc;
            }
        }



        // CONFIRM
        output = JSON.stringify(config, null, 4);
        output = output.replace(/: (".*?")(,|$)/gm, `: ${colour("yellow")}$1${colour("reset")}$2`);
        console.log(output);
        happy = await askYN("Are you happy with the above settings? ", true);
    }

    if(copyGcsConfig) {
        let dest = path.join(configPath, "gcs-config.json");
        fs.copyFileSync(config.storage.options.secret, dest);
        config.storage.options.secret = dest;
    }

    await fs.promises.writeFile(configFile, JSON.stringify(Object.assign({}, oldConfig, config), null, 4));
    return fs.promises.writeFile(path.join(__dirname, "install.lock"), `${version}`);
}

async function installDB() {
    let dbInstaller = require("../db/tools/installDB");
    let choices = [
        "Clean entire database (deletes and recreates the database object)",
        "Install JAM application",
        "Install demo data",
        "Skip databse installation"
    ];
    let modes = await askMultiList("What installer methods do you want to run on the database? ", choices, [0, 1, 2],
        (answers) => {
            if(answers.length < 1) return `If you don't want to affect the database, choose 'Skip'`;
            if(answers.length > 1 && answers.includes(choices[3])) return `You can't choose to 'Skip' ${colour([], "italic")}and${colour("reset")} operate!`;
            return true;
        });

    let choiceToModeMap = ["clean", "install", "demo", "skip"];
    modes = modes.map(mode => choiceToModeMap[choices.indexOf(mode)]);
    modes = modes.reduce((a, c) => a | dbInstaller.flags[c], 0);

    return dbInstaller.install(modes).then(() => {
        if(modes & dbInstaller.flags.install) {
            console.log(`The admin account is ${colour("yellow")}admin${colour("reset")}:${colour("yellow")}admin${colour("reset")}.`);
        }
    });
}

function getFileExtension(archive) {
    let ext = path.extname(archive);
    if(ext === ".gz") ext = path.extname(archive.substring(0, archive.length - 3)) + ext;
    return ext;
}

async function download(link, dest) {
    return new Promise((resolve, reject) => {
        console.log(colourText(`Downloading ${link.substring(link.lastIndexOf("/") + 1)}...`, "blue", "italic"));
        // Download the thing
        const req = wget.download(link, dest);
        req.on("error", (err) => reject(err));

        let size = 0;
        let pBar;

        // Show progress bar
        req.on("start", (fileSize) => {
            size = fileSize;
            pBar = new progress.SingleBar({
                autopadding: true,
                hideCursor: true,
            }, progress.Presets.shades_classic);
            pBar.start(size, 0);
        });
        req.on("progress", (p) => {
            pBar.update(Math.floor(p * size));
        });
        req.on("end", (out) => {
            pBar.update(size);
            pBar.stop();
            console.log(colourText(`Downloaded!`, "green"));
            resolve(out);
        });
    });
}

async function extract(archive, destFolder, force) {
    const Spinner = function (opts) {
        opts = opts || {};

        this.interval = opts.interval || 80;
        this.frames = opts.frames || ["( ●    )", "(  ●   )", "(   ●  )", "(    ● )", "(     ●)", "(    ● )", "(   ●  )", "(  ●   )", "( ●    )", "(●     )"];
        this.frameIndex = 0;
        this.message = opts.msg || "";
        this.completeMessage = opts.completeMsg || "";
        this.hideCursor = opts.hideCursor || false;
        this.id = null;

        this.start = () => {
            if(this.hideCursor) process.stdout.write("\x1b[?25l");
            process.stdout.write(` \x1b7${this.frames[0]} ${this.message}\x1b8`);
            this.id = setInterval(() => {
                process.stdout.write(`\x1b7${this.frames[this.frameIndex++]}\x1b8`);
                this.frameIndex %= this.frames.length;
            }, this.interval);
        };
        this.changeMessage = (msg) => {
            this.message = msg;
            process.stdout.write(`\x1b7${this.frames[this.frameIndex]} ${this.message}\x1b8`);
        };
        this.stop = (msg) => {
            clearInterval(this.id);
            process.stdout.write(`\r\n\x1b[?25h${msg ?? this.completeMessage}\r\n`);
            this.id = null;
        };
        return this;
    };

    const s = new Spinner({
        msg: colourText("Extracting...", "blue", "italic"),
        completeMsg: colourText("Extraction complete!", "green"),
        hideCursor: true
    });
    return Promise.resolve()
        .then(() => s.start())
        .then(() => decompress(archive, destFolder, { // MAYBE: try and find a way to hook in to get the count of files to extract
            map: (file) => {
                // Removes the top level folder which is just
                // the folder containing the actual contents
                file.path = file.path.split("/");
                file.path.shift();
                file.path = file.path.join("/");
                return file;
            }
        })).then((files) => s.stop(colourText(`Extracted ${files.length} files!`, "green")));
}

const colours = {
    'black': 30,
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
    'bright white': 97,
    'bg.black': 40,
    'bg.red': 41,
    'bg.green': 42,
    'bg.yellow': 43,
    'bg.blue': 44,
    'bg.magenta': 45,
    'bg.cyan': 46,
    'bg.white': 47,
    'bg.bright black': 100,
    'bg.bright red': 101,
    'bg.bright green': 102,
    'bg.bright yellow': 103,
    'bg.bright blue': 104,
    'bg.bright magenta': 105,
    'bg.bright cyan': 106,
    'bg.bright white': 107,
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
    if(c === 'reset' || (Array.isArray(c) && c.includes('reset'))) return "\033[0m";
    if(!a) a = [];
    if(!Array.isArray(c)) c = [c];
    if(!Array.isArray(a)) a = [a];
    let cos = c.map(c => colours[c]);
    let ats = a.map(a => attribs[a]);
    let full = cos.concat(ats).join(";");
    return "\x1b[" + full + "m";
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
async function askMultiList(message, list, best, val) {
    let choices = list.map((item, index) => ({
        name: item,
        checked: best && best.includes(index)
    }));
    return (await inquirer.prompt({
        type: "checkbox",
        name: "d",
        message: message,
        choices: choices,
        validate: val
    })).d;
}

async function askPath(message, ext, root) {
    return (await inquirer.prompt({
        type: "fts",
        name: "d",
        message: message,
        onlyShowValid: true,
        root: root,
        validate: (item) => {
            try {
                fs.accessSync(item, fs.constants.R_OK | fs.constants.X_OK);
            } catch(e) {
                return false;
            }

            if(ext == undefined) return true;
            if(["/", "\\"].includes(ext)) return fs.statSync(item).isDirectory();
            if(typeof ext === "string") return path.extname(item) === ext;
            if(ext instanceof RegExp) return ext.test(path.basename(item));
            if(typeof ext === "function") return ext(item);
            if(ext === true) return !fs.statSync(item).isDirectory();
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

function exit(err) {
    if(err) {
        process.stderr.write(colourText("\nSomething occured during installation:\n", "red", "italic"));
        process.stderr.write(colour("red"));
        console.error(err); // left as console so we can get object writing
        process.stderr.write(colour("reset"));
        process.exit(1);
    }
    process.exit(0);
}

if(require.main === module) {
    process.on("SIGINT", exit);
    Promise.resolve()
        .then(checkInstall)
        .then((cont) => {
            if(!cont) {
                console.log(colourText("Already installed", "green", "italic"));
                process.exit(0);
            } else return install(cont);
        })
        .then(() => {
            return installDB();
        })
        .then(() => {
            console.log(colourText("\nInstallation complete!", "green", "italic"));
            process.exit(0);
        })
        .catch(exit);
} else module.exports = {
    checkInstall,
    getInstalledVersion,
    isInstalled: async () => (await getInstalledVersion() !== "0.0.0"),
    shouldUpdate: async () => (semver.lt(await getInstalledVersion(), version)),
    install,
    installDB,
    colour,
    colourText
};