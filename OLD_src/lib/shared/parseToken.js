'use strict';

const Jwt = require('../Jwt');

module.exports = function ParseTokenConstructor(opts) {

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        console.info("Parsing token");

        var isValid = false,
            claim = null;

        if(state.type === "jwt") {
            console.debug("Token identified as JWT.");
            var parser = Jwt.decodeToken(state.token);
            isValid = parser.isJwt;
            claim = parser.claim;
        }

        if(!isValid)
            return done({
                name: "badRequest",
                message: "Bad Token.",
                innerError: {
                    name: "forbidden",
                    message: "Could not parse token."
                }
            });

        console.debug("Found claim in token:\n", claim);

        state.set('claim', claim);

        return done(null, state);
    }
}

