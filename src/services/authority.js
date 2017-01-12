'use strict';

const AWS = require('aws-sdk');
const rpcfw = require('rpcfw');
const rpcUtils = require('rpc-utils');
const lib = require('../lib');

module.exports = function AuthorityPlugin(opts) {

    var seneca = this;
    var common = this.common;
    var logLevel = opts.logLevel

    seneca.rpcAdd('role:accountService.Pub,cmd:getAuthorityFromToken.v1', getAuthorityFromToken_v1);

    return { name: "AuthorityPlugin" };

    // ------------------------------------------------------------------------

    function getAuthorityFromToken_v1(args, rpcDone) {

        var params = {
            logLevel: args.get("logLevel", logLevel),
            repr: lib.repr.claimV1,
            name: "Get Authority From Token (v1)",
            code: "AFT01",
            done: rpcDone,
        };

        params.tasks = [
            validate,
            common.parseToken,
            common.validateClaim,
            fetchSponsor,
            fetchClient,
            common.verifyToken,
            testConsistency
        ];

        rpcUtils.Executor(params).run(args);
    }

    function validate(console, state, done) {

        console.info("Started validating client request");

        var type = (state.get('type') || "").toLowerCase();

        if(!state.has('type', String))
            return done({ name: "badRequest", message: "Missing required field: type" });

        else if(['jwt'].indexOf(type) < 0)
            return done({ name: "badRequest", message: "Unsupported token format." });

        else if(!state.has('token', String))
            return done({ name: "badRequest", message: "Missing required field: token" });

        // Normalize type
        state.set('type', type);

        done(null, state);
    }

    function fetchSponsor(console, state, done) {

        var params = rpcfw.verifiableObject({
            sponsorKey: state.claim.sponsorKey
        });

        common.fetchSponsor(console, params, (err, result) => {
            state.set('sponsorRecord', result && result.record);
            done(err, state);
        });
    }

    function fetchClient(console, state, done) {
        var params = rpcfw.verifiableObject({
            clientKey: state.claim.clientKey
        });

        common.fetchClient(console, params, (err, result) => {
            state.set('clientRecord', result && result.record);
            done(err, state);
        });
    }

    function testConsistency(console, state, done) {

        console.info("Checking claim consistency.");

        if(state.claim.iss !== state.sponsorRecord.code)
            done({ name: "badRequest", message: "Claim rejected. Inconsistent iss." });

        else if(state.claim.sponsorKey !== state.sponsorRecord.key)
            done({ name: "badRequest", message: "Claim rejected. Inconsistent sponsorKey." });

        else if(state.claim.clientKey !== state.clientRecord.key)
            done({ name: "badRequest", message: "Claim rejected. Inconsistent clientKey." });

        else if(state.clientRecord.sponsorId !== state.sponsorRecord.id)
            done({ name: "badRequest", message: "Claim rejected. Inconsistent clientKey." });

        else if(state.claim.exp < rpcUtils.helpers.fmtTimestamp())
            done({ name: "badRequest", message: "Claim rejected. Inconsistent exp." });

        else if(state.claim.exp < state.claim.iat)
            done({ name: "badRequest", message: "Claim rejected. Inconsistent iat." });

        console.debug(`Claim is consistent for client ${state.clientRecord.name} under sponsor ${state.sponsorRecord.code}`);

        done(null, state);
    }
};
