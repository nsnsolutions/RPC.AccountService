"use strict";

const Seneca = require("seneca");

const PACKAGE = require("../package.json");
const overrides = require("../environment/overrides.json");

const opts = {
    legacy: { logging: false },
    serviceName: PACKAGE.name,
};


const seneca = Seneca(opts)
    .use("env", { overrides })
    .use("logger")
    .use("rpc-protocol")
    .listen({
        type: "http",
        port: "4000",
        host: "0.0.0.0",
        path: "/account",
        protocol: "http",
        pin: [ "role:account", "role:seneca,cmd:stats" ],
    });

seneca.env.get("common.logLevel").then((d) => seneca.setLogLevel(d));
seneca.ready(() => seneca.log.info({ msg: `${PACKAGE.name} ready. GOOD LUCK AND GOOD LOGIC!` }));
