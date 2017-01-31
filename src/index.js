'use strict';

const AWS = require('aws-sdk');
const redis = require('redis');
const rpcUtils = require('rpc-utils');
const services = require('./services');

module.exports = function RPC_AccountService(App) {

    // Simplify reference to configurations.
    var conf = App.configurations;

    // Validate Shared Configs
    conf.shared.assertMember("region");
    conf.shared.assertMember("cacheEndpoint");
    conf.shared.assertMember("logLevel");

    // Validate Service Configs.
    conf.service.assertMember("sponsorTableName");
    conf.service.assertMember("clientTableName");

    var app = App({
        onConfigUpdate: () => app.restart(),
        onStart: bootstrap,
        onRestart: bootstrap,
        onShutdown:() => process.exit(0)
    });

    app.start();

    // ------------------------------------------------------------------------

    function bootstrap(bus, conf) {

        var redisClient = redis.createClient({ url: conf.shared.cacheEndpoint });
        var dynamoClient = new AWS.DynamoDB({ region: conf.shared.region });

        var tableCacheParams = {
            dynamoClient: dynamoClient,
            redisClient: redisClient,
            tableMap: {
                sponsor: conf.service.sponsorTableName,
                client: conf.service.clientTableName
            }
        };

        rpcUtils.CachedTable.create(tableCacheParams, (err, tables) => {

            if(err) {
                console.error("FATAL: Failed to initialize dynamo cache.", err);
                return process.exit(1);
            }

            var params = {
                dynamoCacheClients: tables,
                logLevel: conf.shared.logLevel
            }

            bus.use(services.AuthorityPlugin, params);
            bus.use(services.CacheManagerPlugin, params);

            bus.rpcClient({ pin: "role:*" });
            bus.rpcServer({ pin: [
                "role:accountService",
                "role:accountService.Pub"
            ]});
            
        });

    }
}
