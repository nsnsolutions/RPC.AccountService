'use strict';

const lib = require('../lib');

module.exports = function Plugin(opts) {

    var seneca = this;
    var common = this.common;

    seneca.rpcAdd('role:accountService.Pub,cmd:hello.v1', hello_v1);

    return { name: "Plugin" };

    // ------------------------------------------------------------------------

    function hello_v1(args, rpcDone) {

        var workflow = {
            name: 'SCH.001',
            rpcDone: rpcDone,
            repr: 'empty',
            tasks: [ 
                common.pulse
            ]
        }

        lib.Executor(workflow).run(args);
    }
};
