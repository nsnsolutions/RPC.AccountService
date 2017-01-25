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

        // TODO: Verify each field has valid values: Ie: email should be an
        // email and photoUrl should be a URL.
        
        console.info("Started validating structure of claim");

        if(!state.has('claim.ver'))
            return done({ name: "badRequest",
                message: "Claim missing required field: ver" });

        else if(!state.has('claim.ver', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: ver. Expected: String" });

        else if(['1.0'].indexOf(state.claim.ver) < 0)
            return done({ name: "badRequest",
                message: "Invalid value for field: ver. Expected: " + state.claim.ver });

        /* CLAIM VERSION 1.0 */

        console.debug("Claim version: " + state.claim.ver);

        if(state.claim.ver === '1.0' && !state.has('claim.iss'))
            return done({ name: "badRequest",
                message: "Claim missing required field: iss" });

        else if(state.claim.ver === '1.0' && !state.has('claim.iss', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: iss. Expected: String" });

        else if(state.claim.ver === '1.0' && !state.has('claim.sponsorKey'))
            return done({ name: "badRequest",
                message: "Claim missing required field: sponsorKey" });

        else if(state.claim.ver === '1.0' && !state.has('claim.sponsorKey', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: sponsorKey. Expected String." });

        else if(state.claim.ver === '1.0' && !state.has('claim.clientKey'))
            return done({ name: "badRequest",
                message: "Claim missing required field: clientKey" });

        else if(state.claim.ver === '1.0' && !state.has('claim.clientKey', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: clientKey. Expected: String." });

        else if(state.claim.ver === '1.0' && !state.has('claim.userId'))
            return done({ name: "badRequest",
                message: "Claim missing required field: userId" });

        else if(state.claim.ver === '1.0' && !state.has('claim.userId', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: userId. Expected: String" });

        else if(state.claim.ver === '1.0' && !state.has('claim.userName'))
            return done({ name: "badRequest",
                message: "Claim missing required field: userName" });

        else if(state.claim.ver === '1.0' && !state.has('claim.userName', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: userName. Expected: String" });

        else if(state.claim.ver === '1.0' && !state.has('claim.fullName'))
            return done({ name: "badRequest",
                message: "Claim missing required field: fullName" });

        else if(state.claim.ver === '1.0' && !state.has('claim.fullName', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: fullName. Expected: String" });

        else if(state.claim.ver === '1.0' && !state.has('claim.email'))
            return done({ name: "badRequest",
                message: "Claim missing required field: email" });

        else if(state.claim.ver === '1.0' && !state.has('claim.email', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: email. Expected: String" });

        else if(state.claim.ver === '1.0' && !state.has('claim.photoUrl'))
            return done({ name: "badRequest",
                message: "Claim missing required field: photoUrl" });

        else if(state.claim.ver === '1.0' && !state.has('claim.photoUrl', String))
            return done({ name: "badRequest",
                message: "Wrong type for field: photoUrl. Expected: String" });

        else if(state.claim.ver === '1.0' && !state.has('claim.iat'))
            return done({ name: "badRequest",
                message: "Claim missing required field: iat" });

        else if(state.claim.ver === '1.0' && !state.has('claim.iat', Number))
            return done({ name: "badRequest",
                message: "Wrong type for field: iat. Expected: Number" });

        else if(state.claim.ver === '1.0' && !state.has('claim.exp'))
            return done({ name: "badRequest",
                message: "Claim missing required field: exp" });

        else if(state.claim.ver === '1.0' && !state.has('claim.exp', Number))
            return done({ name: "badRequest",
                message: "Wrong type for field: exp. Expected: Number." });

        else if(state.claim.ver === '1.0' && !state.has('claim.roles'))
            return done({ name: "badRequest",
                message: "Claim missing required field: roles" });

        else if(state.claim.ver === '1.0' && !state.has('claim.roles', Array))
            return done({ name: "badRequest",
                message: "Wrong type for field: roles. Expected: String Array" });

        console.debug("Claim is valid for version " + state.claim.ver);

        // TODO: Bug: empy string in photoUrl. HotFIx.
        if(state.get('claim.photoUrl') === "")
            state.set('claim.photoUrl', null);

        done(null, state);
    }
}
