'use strict';

const AWS = require('aws-sdk');
const redis = require('redis');
const async = require('async');
const services = require('./services');
const rpcUtils = require('rpc-utils');

module.exports = function RPC_AccountService(App) {

    // Validate specific configs
    App.configurations.config.assertMember("sponsorTableName");
    App.configurations.config.assertMember("clientTableName");

    // Validate Shared Configs
    App.configurations.shared.assertMember("region");
    App.configurations.shared.assertMember("cacheEndpoint");
    App.configurations.shared.assertMember("logLevel");

    var redisClient = redis.createClient({ url: App.configurations.shared.cacheEndpoint });
    var dynamoClient = new AWS.DynamoDB({ region: App.configurations.shared.region });
    var dynamoCacheClients = {};

    // Cache connect / Service initialize
    redisClient.on('connect', () => {
        console.log("Connected to cache server.");
        init();
    });

    // ------------------------------------------------------------------------

    function init() {

        var params = {
            dynamoClient: dynamoClient,
            redisClient: redisClient,
            tableMap: {
                sponsor: App.configurations.config.sponsorTableName,
                client: App.configurations.config.clientTableName
            }
        };

        rpcUtils.CachedTable.create(params, (err, tables) => {
            if(err) {
                console.error("FATAL: Failed to initialize dynamo cache.", err);
                return process.exit(1);
            }

            dynamoCacheClients = tables;

            var app = App({
                onConfigUpdate: reload,
                onStart: initApp,
                onRestart: initApp,
                onShutdown: () => process.exit(0)
            }).start();
        });
    }

    function initApp(bus, conf) {

        var params = {
            dynamoCacheClients: dynamoCacheClients,
            logLevel: conf.shared.logLevel
        }

        bus.use(rpcUtils.plugins.AuthorityPlugin, { logLevel: conf.shared.logLevel });
        bus.use(services.CommonPlugin, params);
        bus.use(services.AuthorityPlugin, params);
        bus.use(services.CacheManagerPlugin, params);

        bus.rpcClient({ pin: "role:*" });
        bus.rpcServer({ pin: [
            "role:accountService",
            "role:accountService.Pub"
        ]});
    }

    function reload(name, conf) {
        /* NOT IMPLEMENTED */
    }
}
