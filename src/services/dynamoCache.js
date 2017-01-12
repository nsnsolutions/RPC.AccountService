'use strict';

const lib = require('../lib');

module.exports = function DynamoCachePlugin(opts) {

    var seneca = this;

    //seneca.decorate('ddb', { fetch: null });

    return { name: "DynamoCachePlugin" };

    // ------------------------------------------------------------------------

    function pulse(console, state, done) {
        console.log("Test");
        state.raw.test = "Here";
        done(null, state);
    }
};
