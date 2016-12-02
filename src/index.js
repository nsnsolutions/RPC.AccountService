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
        bus.use(services.HelloPlugin, conf);
        bus.rpcClient({ pin: "role:*" });
        bus.rpcServer({ pin: [
          "role:RPC-AccountService",
          "role:RPC-AccountService.Pub"
        ]});
    }

    function reload(name, conf) {
    }
}
