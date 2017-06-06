'use strict';

const AWS = require('aws-sdk');
const rpcfw = require('rpcfw');
const rpcUtils = require('rpc-utils');
const lib = require('../lib');

module.exports = function AuthorityPlugin(opts) {

    var seneca = this,
        shared = lib.shared.call(seneca, opts),
        logLevel = opts.logLevel;

    seneca.rpcAdd('role:accountService.Pub,cmd:getAuthorityFromToken.v1', getAuthorityFromToken_v1);

    return { name: "AuthorityPlugin" };

    // ------------------------------------------------------------------------

    function getAuthorityFromToken_v1(args, rpcDone) {

        if(args.has('type', String))
            args.set('type', args.type.toLowerCase());

        var params = {

            name: "Get Authority From Token (v1)",
            code: "AFT01",
            repr: lib.repr.claim_v1,

            transport: seneca,
            logLevel: args.get("logLevel", logLevel),
            done: rpcDone,

            required: [
                { field: "type", type: String, regex: '^(jwt)$' },
                { field: "token", type: String },
            ],

            tasks: [
                shared.parseToken,
                setLoggingContext,
                shared.validateClaim,
                shared.fetchSponsor,
                shared.fetchClient,
                shared.verifyToken,
                testConsistency
            ]

        };

        rpcUtils.Workflow
            .Executor(params)
            .run(args);
    }

    function setLoggingContext(console, state, done) {
        console.context.add('userName', state.get('claim.userName')); 
        console.log(`Succuessfully parsed claim for userId: ${state.get('claim.userId')}`);
        done(null, state);
    }

    function testConsistency(console, state, done) {

        var _nowTs = rpcUtils.helpers.fmtTimestamp();

        console.info("Checking consistency.");

        if(state.claim.iss !== state.sponsorRecord.code)
            return done({ name: "badRequest",
                message: "Claim rejected. Inconsistent iss." });

        else if(state.claim.sponsorKey !== state.sponsorRecord.key)
            return done({ name: "badRequest",
                message: "Claim rejected. Inconsistent sponsorKey." });

        else if(state.claim.clientKey !== state.clientRecord.key)
            return done({ name: "badRequest",
                message: "Claim rejected. Inconsistent clientKey." });

        else if(state.clientRecord.sponsorId !== state.sponsorRecord.id)
            return done({ name: "badRequest",
                message: "Claim rejected. Inconsistent clientKey." });

        else if(state.sponsorRecord.isDeleted)
            return done({ name: "badRequest",
                message: "Claim rejected. Sponsor no longer exists." });

        else if(state.clientRecord.isDeleted)
            return done({ name: "badRequest",
                message: "Claim rejected. Client no longer exists." });

        else if(!state.clientRecord.isActive)
            return done({ name: "badRequest",
                message: "Claim rejected. Client not active." });

        else if(state.claim.exp < _nowTs)
            return done({ name: "badRequest",
                message: "Claim rejected. Token expired." });

        else if(state.claim.iat > _nowTs)
            return done({ name: "badRequest",
                message: "Claim rejected. Inconsistent iat." });

        console.info(`Claim is consistent for client ${state.clientRecord.name} under sponsor ${state.sponsorRecord.code}`);

        done(null, state);
    }
};