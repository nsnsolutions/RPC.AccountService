"use strict";

const ex = require("../rpc-protocol/exceptions");

module.exports = function Sponsor() {

    const seneca = this;
    const inject = seneca.pin("role:dependent,inject:*");
    let sponsorTable, clientTable;

    seneca.rpc.addInternal("role:account,cmd:fetchSponsor", fetchSponsor);
    seneca.rpc.addInternal("role:account,cmd:fetchClient", fetchClient);

    seneca.add({ init: module.exports.name }, (args, done) => {
        init()
            .then(() => done())
            .catch((err) => done(err));
    });

    return { name: module.exports.name };

    // ------------------------------------------------------------------------

    async function init() {
        sponsorTable = await seneca.env.get("account.sponorTable");
        clientTable = await seneca.env.get("account.clientTable");
    }

    async function fetchSponsor(args) {

        const ddbClient = await inject.DocumentClient();
        const result = await ddbClient.query({
            TableName: sponsorTable,
            IndexName: "key-index",
            KeyConditionExpression: "#hkey = :hkey",
            ExpressionAttributeNames: { "#hkey": "key" },
            ExpressionAttributeValues: { ":hkey": args.key },
        }).promise();

        if (result.Items.length === 0 || result.Items[0].isDeleted) {
            throw new ex.BadRequest("Bad Token.");

        }

        return result.Items[0];
    }

    async function fetchClient( args) {

        const ddbClient = await inject.DocumentClient();
        const result = await ddbClient.query({
            TableName: clientTable,
            IndexName: "key-index",
            KeyConditionExpression: "#hkey = :hkey",
            ExpressionAttributeNames: { "#hkey": "key" },
            ExpressionAttributeValues: { ":hkey": args.key },
        }).promise();

        if (result.Items.length === 0 || result.Items[0].isDeleted) {
            throw new ex.BadRequest("Bad Token.");

        }

        return result.Items[0];
    }
};
