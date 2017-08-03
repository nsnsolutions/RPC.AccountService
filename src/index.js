'use strict';

const AWS = require('aws-sdk');
const async = require('async');
const redis = require('redis');
const rpcUtils = require('rpc-utils');

const lib = require('./lib');
const services = require('./services');
const computeRedisKey = rpcUtils.helpers.computeRedisKey;

module.exports = function RPC_AccountService(App) {

    let ddbClient, redisClient;

    var config = App.configurations;

    // Validate Service Configs.
    config.service.assertMember("sponsorTableName");
    config.service.assertMember("clientTableName");

    // Validate Shared Configs
    config.shared.assertMember("region");
    config.shared.assertMember("logLevel");
    config.shared.assertMember('stackName');
    config.shared.assertMember('dynamoCache');

    var app = App({
        onConfigUpdate: () => app.restart(),
        onStart: bootstrap,
        onRestart: restart,
        onShutdown: shutdown,
    });

    app.start();

    // ------------------------------------------------------------------------

    function bootstrap(bus, conf) {

        // DynamoDB with transparent cache - Make sure your tables have the 
        // database trigger setup to the update lambda for cache invalidation.
        ddbClient = new rpcUtils.DynamoDB.DocumentClient({
            region: config.shared.region,
            cache: {
                disableCache: isCacheDisabled(conf),
                url: conf.shared.dynamoCache,
                ttl: 1800
            }
        });


        var startupTasks = [
            // Add setup items here.
            (cb) => installPlugins(bus, conf, cb)
        ];


        async.waterfall(startupTasks, (err) => {

            if(err) {
                console.error("FAILURE!", err);
                throw err;
            }

            // Allow outbound calls to everything.
            bus.rpcClient({ pin: "role:*" });

            // These are the route keys that the RabbitMQ queue will subscribe to
            // on the seneca rpc exchange. Only *.Pub keys are routed from
            // rpc.interface. non .Pub routes are used for interal calls only.

            bus.rpcServer({ pin: [
                "role:accountService",
                "role:accountService.Pub"
            ]});

            bus.on('close', () => {
                console.log("[ X:APP ] Seneca bus is shutting down...");
                //bus.emit('stopConsuming');
            });

            bus.ready(() => {
                console.log("[ X:APP ] Seneca bus is ready...");
                //setTimeout(() => bus.emit('startConsuming'), 3000);
            });

        });

    }

    function shutdown() {
        cleanUp();
        process.exit(0);
    }

    function restart(bus, conf) {
        cleanUp();
        bootstrap(bus, conf);
    }

    function installPlugins(bus, conf, callback) {

        var params = {
            ddbClient: ddbClient,
            logLevel: conf.shared.logLevel,
            tables: {
                sponsor: conf.service.sponsorTableName,
                client: conf.service.clientTableName
            }
        }

        // Add additional plugins here.
        bus.use(services.AuthorityPlugin, params);

        callback();
    }

    function cleanUp() {
        if(ddbClient && ddbClient.close)
            ddbClient.close();
    }

    function isCacheDisabled(conf) {
        var strFlag = conf.shared.get('disableCache', 'false');
        var ret = strFlag.toLowerCase() == "true";

        if(ret) {
            console.warn("[ X:APP ] Cache layer is disabled",
                "** This should only happen during local development. **");
        }

        return ret;
    }

}
