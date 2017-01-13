'use strict';

const Jwt = require('../Jwt');

module.exports = function ValidateClaimConstructor(trans, opts) {

    var common = this,
        seneca = trans,
        sponsorTable = opts.dynamoCacheClients.sponsor,
        clientTable = opts.dynamoCacheClients.client;

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        /*
         * Verify that the given claim has all the required fields.
         * This method does consider claim version.
         *
         * If this method completes, the claim can be considered verified.
         *
         * Arguments:
         *
         *   claim:
         *     The claim to verify
         *
         * Result:
         *   None
         */

        console.info("Started validating structure of claim");

        if(!state.has('claim.ver', String))
            return done({ name: "badRequest", message: "Claim missing required field: ver" });

        else if(['1.0'].indexOf(state.claim.ver) < 0)
            return done({ name: "badRequest", message: "Claim contains an unrecognized version: " + state.claim.ver });

        /* CLAIM VERSION 1.0 */

        console.debug("Claim version: " + state.claim.ver);

        if(state.claim.ver === '1.0' && !state.has('claim.iss', String))
            return done({ name: "badRequest", message: "Claim missing required field: iss" });

        else if(state.claim.ver === '1.0' && !state.has('claim.sponsorKey', String))
            return done({ name: "badRequest", message: "Claim missing required field: sponsorKey" });

        else if(state.claim.ver === '1.0' && !state.has('claim.clientKey', String))
            return done({ name: "badRequest", message: "Claim missing required field: clientKey" });

        else if(state.claim.ver === '1.0' && !state.has('claim.userId', String))
            return done({ name: "badRequest", message: "Claim missing required field: userId" });

        else if(state.claim.ver === '1.0' && !state.has('claim.userName', String))
            return done({ name: "badRequest", message: "Claim missing required field: userName" });

        else if(state.claim.ver === '1.0' && !state.has('claim.fullName', String))
            return done({ name: "badRequest", message: "Claim missing required field: fullName" });

        else if(state.claim.ver === '1.0' && !state.has('claim.email', String))
            return done({ name: "badRequest", message: "Claim missing required field: email" });

        else if(state.claim.ver === '1.0' && !state.has('claim.photoUrl', String))
            return done({ name: "badRequest", message: "Claim missing required field: photoUrl" });

        else if(state.claim.ver === '1.0' && !state.has('claim.iat', Number))
            return done({ name: "badRequest", message: "Claim missing required field: iat" });

        else if(state.claim.ver === '1.0' && !state.has('claim.exp', Number))
            return done({ name: "badRequest", message: "Claim missing required field: exp" });

        else if(state.claim.ver === '1.0' && !state.has('claim.roles', Array))
            return done({ name: "badRequest", message: "Claim missing required field: roles" });

        console.debug("Claim is valid for version " + state.claim.ver);

        done(null, state);
    }
}
