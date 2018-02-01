'use strict';

const reprs = require('require-dir')('.');

module.exports = (function () {

    var self = {};

    init();

    return self;

    // ------------------------------------------------------------------------

    function init() {
        for(var name in reprs) {
            if(name.startsWith('_'))
                continue;

            self[name] = reprs[name];
        }
    }
})();
