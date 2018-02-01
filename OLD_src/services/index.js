'use strict';

const services = require('require-dir')('.');

module.exports = (function () {

    var self = {};

    init();

    return self;

    // ------------------------------------------------------------------------

    function init() {
        for(var name in services) {
            if(name.startsWith('_'))
                continue;

            self[name] = services[name];
        }
    }
})();
