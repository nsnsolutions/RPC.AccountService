"use strict";

const ex = require("./rpc-protocol/exceptions");
const AWS = require("aws-sdk");

module.exports = function Dependent() { };
module.exports.preload = function DependentPreload() {

    const seneca = this;
    let dynamoClient;

    seneca.rpc.add("role:dependent,inject:DocumentClient", getDocumentClient);
    seneca.rpc.add("role:dependent,inject:redisClient", getRedisClient);

    seneca.add({ init: module.exports.name }, (args, done) => {
        init()
            .then(() => done())
            .catch((err) => done(err));
    });

    this.sub("role:seneca,cmd:close,closing$:true", shutdown);

    return { name: module.exports.name };

    // ------------------------------------------------------------------------

    async function init() { }

    async function shutdown() { }

    async function getDocumentClient() {

        if (!dynamoClient) {
            dynamoClient = new AWS.DynamoDB.DocumentClient();
        }

        return dynamoClient;
    }

    async function getRedisClient() {
        throw new ex.NotImplemented("Injector is not configured.");
    }
};
