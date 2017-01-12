'use strict';

module.exports = {
    'empty': (o) => { return null; },
    'passthru': (o) => { return o; },
    'claimV1': require('./claimV1')
};
