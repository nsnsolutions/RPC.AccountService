'use strict';

const Jwt = require('../Jwt');

module.exports = function VerifyTokenConstructor(trans, opts) {

    var common = this,
        seneca = trans,
        sponsorTable = opts.dynamoCacheClients.sponsor,
        clientTable = opts.dynamoCacheClients.client;

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        /*
         * Verify a token is trust worthy
         *
         * If successfull, the token was issued by the identified sponsor.
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
         *   sponsorRecord:
         *     The sponsor's database record.
         *
         * Result:
         *  Nothing
         */

        console.info("Started token verification");

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
