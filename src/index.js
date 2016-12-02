'use strict';

const services = require('./services');

module.exports = function RPC_AccountService(App) {

    // Validate Shared Configs

    // Validate specific configs

    // Initialize App
    var app = App({
        onConfigUpdate: reload,
        onStart: init,
        onRestart: init,
        onShutdown:() => process.exit(0)
    });

    // Start the service
    app.start();

    // ------------------------------------------------------------------------

    function init(bus, conf) {

        var params = {
        }

        bus.use(services.CommonPlugin, params);
        bus.use(services.HelloPlugin, params);

        bus.rpcClient({ pin: "role:*" });
        bus.rpcServer({ pin: [
          "role:accountService",
          "role:accountService.Pub"
        ]});
    }

    function reload(name, conf) {
    }
}
