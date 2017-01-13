'use strict';

const Jwt = require('../Jwt');

module.exports = function ParseTokenConstructor(trans, opts) {

    var common = this,
        seneca = trans,
        sponsorTable = opts.dynamoCacheClients.sponsor,
        clientTable = opts.dynamoCacheClients.client;

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        /*
         * Parses a token.
         *
         * If successfull the token has good structure.
         * It does not mean that the token is trust worthy
         *
         * Arguments:
         *
         *   type:
         *     The type of token to parse.
         *     One of: [ 'jwt' ]
         *
         *   token:
         *     The token data to be parsed.
         *
         * result:
         *
         *   claim:
         *     The resulting claim information after parsing the token.
         */

        console.info("Started parsing token");

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

