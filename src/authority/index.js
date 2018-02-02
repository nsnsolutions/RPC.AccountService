"use strict";

module.exports = function AuthorityPlugin() {

    const seneca = this;
    const getAuthorityFromToken_v1 = require("./getAuthorityFromToken").bind(seneca);
    const renewToken_v1 = require("./renewToken").bind(seneca);
    const assertClaim = require("./assertClaim").bind(seneca);

    // Public Interface
    seneca.rpc.add("role:account,ver:v1,cmd:getAuthorityFromToken", getAuthorityFromToken_v1);
    seneca.rpc.add("role:account,ver:v1,cmd:renewToken", renewToken_v1);

    // Service Internal Interface
    seneca.rpc.addInternal("role:authority,cmd:assertClaim", assertClaim);

    return { name: module.exports.name };

};
