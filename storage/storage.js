// This file will be the driver to store and retrieve files between the website and the storage rpovider that gets chosen.
const SMCloudStore = require('smcloudstore');

// Signing function
async function localStorageSigningFunction(method, path, ttl) {
    let token;
    let curUrl = await db.signedUrls.get(method, path);
    if (curUrl !== null) {
        token = curUrl.token;
        await db.signedUrls.update(method, path, token, Date.now() + (ttl * 1000));
    } else {
        token = storage.client.generateRandomUid();
        await db.signedUrls.put(method, path, token, Date.now() + (ttl * 1000));
    }
    return token;
}



module.exports = function (provider, options) {
    let p = provider.provider;
    let cloudStore = new SMCloudStore(p, options);
    let container = options.container || options.bucket;

    return SMCloudStore.create(p, options);
};


module.exports.storageProviders = [{
        provider: "aws-s3",
        name: "Amazon S3"
    },
    {
        provider: "azure",
        name: "Azure Storage"
    },
    {
        provider: "google-cloud-storage",
        name: "Google Cloud Storage"
    },
    {
        provider: require("smcloudstore-localstorage"),
        name: "Local Storage"
    }
];
module.exports.createOptions = {};
module.exports.createOptions.awsS3 = function (accessKeyId, secretAccessKey, region) {
    return {
        accessKeyId,
        secretAccessKey,
        region
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