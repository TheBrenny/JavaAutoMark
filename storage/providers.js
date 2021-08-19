// We're using functions so we aren't loading all providers.
// This means we can (sort of) keep the memory footprint down.
module.exports = {
    "localstorage": () => require("smcloudstore-localstorage"),
    "aws": () => require("@smcloudstore/aws-s3"),
    "gcs": () => require("@smcloudstore/google-cloud-storage"),
    "azure": () => require("@smcloudstore/azure-storage"),
};

// This invokes one of the above providers and returns it as if
//     it were used as p = require("p")
module.exports.getProvider = (provider) => module.exports[provider]();

module.exports.createOptions = function createOptions(provider, opts) {
    if (provider == "aws") {
        return module.exports.createOptions.awsS3(opts.accessID, opts.secret);
    } else if (provider == "azure") {
        return module.exports.createOptions.azure(opts.accessID, opts.secret);
    } else if (provider == "gcs") {
        return module.exports.createOptions.gcs(opts.accessID, opts.secret);
    } else if (provider == "localstorage") {
        return module.exports.createOptions.localstorage(opts.path, opts.signingFn);
    } else {
        throw new Error("Unsupported provider: " + provider);
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