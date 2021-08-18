// This file will be the driver to store and retrieve files between the website and the storage rpovider that gets chosen.
const SMCloudStore = require('smcloudstore');
const Database = require('../db/database');
const db = require("../db/db");

const localStorageTableName = "public_urls";

// Signing function
async function localStorageSigningFunction(method, path, ttl) {
    let token;
    let curUrl = await Database.PublicUrls.get(method, path);
    if (curUrl !== null) {
        token = curUrl.token;
        await Database.PublicUrls.update(method, path, token, Date.now() + (ttl * 1000));
    } else {
        token = storage.client.generateRandomUid();
        await Database.PublicUrls.put(method, path, token, Date.now() + (ttl * 1000));
    }
    return token;
}

async function ensurePublicUrlTable() {
    return Database.query("SHOW TABLES")
        .then(r => r.map(o => Object.values(o)[0]))
        .then(r => {
            if (r.includes(localStorageTableName.toLowerCase())) return true;
            else return Database.query(db.sqlFromFile("localStorageTable", {
                t: localStorageTableName
            }));
        })
        .then(() => true)
        .catch(err => Promise.reject(err));
}

module.exports = function (provider, options, container) {
    if (typeof provider === "string") provider = module.exports.storageProviders[provider];

    let p = provider.provider;
    if (provider.id === "localstorage") {
        ensurePublicUrlTable();
        options.signingFn = localStorageSigningFunction;
    } else if (!options.container) throw new Error("A storage container must be specified for non-localstorage");
    let cloudStore = SMCloudStore.Create(p, options);
    container = container || "";

    return cloudStore;
};

module.exports.storageProviders = {
    "aws": {
        id: "aws",
        provider: "aws-s3",
        name: "Amazon S3"
    },
    "azure": {
        id: "azure",
        provider: "azure",
        name: "Azure Storage"
    },
    "gcs": {
        id: "gcs",
        provider: "google-cloud-storage",
        name: "Google Cloud Storage"
    },
    "localstorage": {
        id: "localstorage",
        provider: require("smcloudstore-localstorage"),
        name: "Local Storage"
    }
};
module.exports.createOptions = function (opts) {
    if (opts.provider == "aws") {
        return module.exports.createOptions.awsS3(opts.accessID, opts.secret);
    } else if (opts.provider == "azure") {
        return module.exports.createOptions.azure(opts.accessID, opts.secret);
    } else if (opts.provider == "gcs") {
        return module.exports.createOptions.gcs(opts.accessID, opts.secret);
    } else if (opts.provider == "local") {
        return module.exports.createOptions.local(opts.path, localStorageSigningFunction);
    }
};
module.exports.createOptions.awsS3 = function (accessKeyId, secretAccessKey) {
    return {
        accessKeyId,
        secretAccessKey
    };
};
module.exports.createOptions.azure = function (storageAccount, storageAccessKey) {
    if (storageAccessKey == undefined) return storageAccessKey;
    return {
        storageAccount,
        storageAccessKey
    };
};
module.exports.createOptions.gcs = function (projectId, keyFilename) {
    return {
        projectId,
        keyFilename
    };
};
module.exports.createOptions.localstorage = function (basePath, signingFn) {
    return {
        basePath,
        signingFn
    };
};