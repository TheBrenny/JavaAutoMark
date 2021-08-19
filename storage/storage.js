// This file will be the driver to store and retrieve files between the website and the storage rpovider that gets chosen.
const config = require("../config");
const SMCloudStore = require('smcloudstore');
const Database = require('../db/database');
const db = require("../db/db");

const localStorageTableName = Database.publicUrls.tableName;

const storageProviders = {
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

// Signing function
async function localStorageSigningFunction(method, path, ttl) {
    let token;
    let curUrl = await Database.publicUrls.getUrl(method, path);
    if (curUrl != undefined) {
        if (curUrl.expires > Date.now()) token = curUrl.token;
        await Database.publicUrls.removeUrl(method, path);
    }
    token = token || storage.client.generateRandomUid();
    await Database.publicUrls.addUrl(method, path, token, Date.now() + (ttl * 1000));
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

module.exports = (function () {
    if (!global.hasOwnProperty('storage')) {
        let provider = config.storage.provider;
        let options = config.storage.options;

        if (provider === "localstorage") {
            ensurePublicUrlTable();
            options.signingFn = localStorageSigningFunction;
        } else if (!options.container) throw new Error("A storage container must be specified for non-localstorage");

        let providers = require("./providers");
        let providerObject = providers.getProvider(provider);
        let providerOptions = providers.createOptions(provider, options);

        let cloudStore = SMCloudStore.Create(providerObject, providerOptions);

        cloudStore.ensureContainer(options.container);
        global.storage = cloudStore;
    }
    return global.storage;
})();

module.exports.storageProviders = storageProviders;