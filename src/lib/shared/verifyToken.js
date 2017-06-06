'use strict';

const Jwt = require('../Jwt');

module.exports = function VerifyTokenConstructor(trans, opts) {

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        console.info("Checking token authenticity.");

        var isValid = false;

        if(state.type === "jwt") {
            console.debug("Checking signature for sponsor " + state.sponsorRecord.code);
            var parser = Jwt.decodeToken(state.token, state.sponsorRecord.secretKey);
            isValid = parser.isSigned && parser.isValid || false;
        }

        if(!isValid)
            return done({
                name: "forbidden",
                message: "Invalid token signature."
            });

        console.debug("Claim is valid for sponsor " + state.sponsorRecord.code);

        done(null, state);
    }
}
