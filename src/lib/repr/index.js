'use strict';

const MAP = {
    'empty': (n, o) => { return {}; }
};

module.exports = (n, o) => MAP[n](o);
