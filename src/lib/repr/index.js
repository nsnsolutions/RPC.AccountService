'use strict';

module.exports = {
    'empty': (o) => { return {}; },
    'passthru': (o) => { return o; },
    'claimV1': require('./claimV1')
};
