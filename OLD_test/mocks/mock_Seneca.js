'use strict';

const rpcDone = require('rpcfw/lib/rpcDone');
const verifiableObject = require('rpcfw').verifiableObject;

module.exports = function MockSeneca() {

    var meths = {};
    var self = {
        rpcAdd: rpcAdd,
        act: act
    };

    return self;

    // ------------------------------------------------------------------------

    function rpcAdd(pattern, meth) {
        meths[pattern] = meth;
    }

    function act(pattern, params, cb) {
        var args = verifiableObject(params);
        var done = rpcDone(cb);
        var meth = meths[pattern];
        if(meth)
            meth(args, done);
        else
            cb({ name: "MOCK", message: "Pattern not found: " + pattern });
    }
}
