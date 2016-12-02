'use strict';

const lib = require('../lib');

module.exports = function CommonPlugin(opts) {

    var seneca = this;

    seneca.decorate('common', {
        pulse: pulse
    });

    return { name: "CommonPlugin" };

    // ------------------------------------------------------------------------

    function pulse(state, done) {
        console.log("[SCP.001] Test");
        state.raw.test = "Here";
        done(null, state);
    }
};
