'use strict';

const AWS = require('aws-sdk');
const rpcfw = require('rpcfw');
const rpcUtils = require('rpc-utils');
const lib = require('../lib');

module.exports = function CacheManagerPlugin(opts) {

    var seneca = this;
    var common = this.common;
    var logLevel = opts.logLevel;
    var sponsorTable = opts.dynamoCacheClients.sponsor;
    var clientTable = opts.dynamoCacheClients.client;

    seneca.rpcAdd('role:accountService.Pub,cmd:invalidateCache.v1', invalidateCache_v1);

    return { name: "CacheManagerPlugin" };

    // ------------------------------------------------------------------------

    function invalidateCache_v1(args, rpcDone) {
        var params = {
            logLevel: args.get("logLevel", logLevel),
            repr: lib.repr.empty,
            name: "Invalidate Cache (v1)",
            code: "IVC01",
            done: rpcDone,
        };

        params.tasks = [
            validate,
            CheckAuthority,
            findRecord,
            flushRecord
        ];

        rpcUtils.Executor(params).run(args);
    }

    function validate(console, state, done) {

        console.info("Started validating client request");

        var _context = state.get('context', '').toLowerCase();

        if(!state.has('key', String))
            return done({ name: "badRequest", message: "Missing required field: key" });

        else if(!state.has('token', String))
            return done({ name: "badRequest", message: "Missing required field: token" });

        else if(!state.has('context', String))
            return done({ name: "badRequest", message: "Missing required field: context" });


        if(_context === "sponsor")
            state.set('table', sponsorTable);

        else if(_context === "client")
            state.set('table', clientTable);

        else
            return done({ name: "badRequest", message: "Invalid value for context. Must be one of: sponsor, client" });


        state.set('context', _context);

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


        //seneca.act("role:accountService.Pub,cmd:getAuthorityFromToken.v1", (err, result) => {
            //console.info(err, result);
            //done(null, state);
        //});
    }

    function findRecord(console, state, done) {

        console.info("Started fetching record.");

        var params = {
            key: { key: state.key },
            index: "key-index",
            logLevel: console.level
        };

        console.debug("Searching for " + state.context + " key: " + state.key);

        state.table.fetch(params, (err, record) => {

            if(err)
                return done({
                    name: "internalError",
                    message: "Failed to fetch record.",
                    innerError: err
                })

            if(record) {
                console.debug(`Record found: ${record.id}`);
                state.set('record', record);
            } else {
                console.warn("Record not found.");
            }

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

        state.table.flush(params, (err) => {
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
