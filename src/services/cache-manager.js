'use strict';

const AWS = require('aws-sdk');
const rpcfw = require('rpcfw');
const rpcUtils = require('rpc-utils');
const lib = require('../lib');

module.exports = function CacheManagerPlugin(opts) {

    var seneca = this;
    var shared = new lib.Shared(this, opts);
    var logLevel = opts.logLevel;

    seneca.rpcAdd('role:accountService.Pub,cmd:invalidateSponsorCache.v1', invalidateSponsorCache_v1);
    seneca.rpcAdd('role:accountService.Pub,cmd:invalidateClientCache.v1', invalidateClientCache_v1);

    return { name: "CacheManagerPlugin" };

    // ------------------------------------------------------------------------

    function invalidateSponsorCache_v1(args, rpcDone) {
        var params = {
            logLevel: args.get("logLevel", logLevel),
            repr: lib.repr.empty,
            name: "Invalidate Sponsor Cache (v1)",
            code: "ISC01",
            done: rpcDone,
        };

        params.tasks = [
            validate,
            CheckAuthority,
            shared.fetchSponsor,
            flushRecord
        ];

        rpcUtils.Executor(params).run(args);
    }

    function invalidateClientCache_v1(args, rpcDone) {
        var params = {
            logLevel: args.get("logLevel", logLevel),
            repr: lib.repr.empty,
            name: "Invalidate Client Cache (v1)",
            code: "ICC01",
            done: rpcDone,
        };

        params.tasks = [
            validate,
            CheckAuthority,
            shared.fetchClient,
            flushRecord
        ];

        rpcUtils.Executor(params).run(args);
    }

    function validate(console, state, done) {

        console.info("Started validating client request");

        if(!state.has('key', String))
            return done({ name: "badRequest", message: "Missing required field: key" });

        else if(!state.has('token', String))
            return done({ name: "badRequest", message: "Missing required field: token" });

        done(null, state);
    }

    function CheckAuthority(console, state, done) {

        console.info("Starting check authority");

        seneca.getAuthority(state, (err, result) => {
            if(err) 
                return done(err);

            else if(!result.inRole("Developer"))
                return done({
                    name: "notAuthorized",
                    message: "You do not have sufficient access to execute this action."
                });

            console.debug("User has access: " + result.toString());
            done(null, state);
        });
    }

    function flushRecord(console, state, done) {

        if(!state.record)
            return done(null, state);

        console.info("started flush record.");

        var params = {
            item: state.record,
            logLevel: console.level
        }

        state.record.$flush(params, (err) => {
            if(err)
                return done({
                    name: "internalError",
                    message: "Failed to flush cache for " + state.context + " " + state.key,
                    innerError: err
                });

            done(null, state);
        });
    }
}