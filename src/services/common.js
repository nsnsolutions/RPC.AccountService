'use strict';

const lib = require('../lib');

module.exports = function CommonPlugin(opts) {

    var seneca = this;
    var sponsorTable = opts.dynamoCacheClients.sponsor;
    var clientTable = opts.dynamoCacheClients.client;

    seneca.decorate('common', {
        parseToken: parseToken,
        verifyToken: verifyToken,
        validateClaim: validateClaim,
        fetchSponsor: fetchSponsor,
        fetchClient: fetchClient
    });

    return { name: "CommonPlugin" };

    // ------------------------------------------------------------------------

    function parseToken(console, state, done) {

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
            var parser = lib.Jwt.decodeToken(state.token);
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

    function verifyToken(console, state, done) {

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
            var parser = lib.Jwt.decodeToken(state.token, state.sponsorRecord.secretKey);
            isValid = parser.isSigned && parser.isValid || false;
        }

        if(!isValid)
            return done({
                name: "badRequest",
                message: "Bad Token.",
                innerError: {
                    name: "forbidden",
                    message: "Invalid token signature."
                }
            });

        console.debug("Claim is valid for sponsor " + state.sponsorRecord.code);

        done(null, state);
    }

    function validateClaim(console, state, done) {

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

        /* CLAIM VERSION 1.0 */

        console.debug("Claim version: " + state.claim.ver);

        if(state.claim.ver === '1.0' && !state.has('claim.iss', String))
            return done({ name: "badRequest", message: "Claim missing required field: " });

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

    function fetchSponsor(console, state, done) {

        /*
         * Retrieve the sponsor record from dynamo (with cache)
         *
         * If successfull, record will be added to state.
         *
         * Arguments:
         *
         *   key:
         *     The sponsor key to lookup the record.
         *     You can optionally speficy sponsorKey.
         *
         * Result:
         *
         *   record:
         *     The dynamo record that represents the sponsor.
         */

        console.info("Started fetching sponsor record.");

        var params = {
            key: { key: state.sponsorKey || state.key },
            index: "key-index",
            logLevel: console.level
        };

        console.debug("Searching for sponsor key: " + params.key.key);

        sponsorTable.fetch(params, (err, record) => {
            if(err)
                return done({
                    name: "internalError",
                    message: "Failed to fetch sponsor record.",
                    innerError: err
                })

            else if(!record)
                return done({
                    name: "badRequest",
                    message: "Bad Token.",
                    innerError: {
                        name: "notFound",
                        message: "Sponsor record not found."
                    }
                });

            console.debug(`Sponsor found: ${record.code} (${record.id})`);

            state.set('record', record);
            done(null, state);
        });
    }

    function fetchClient(console, state, done) {

        /*
         * Retrieve the client record from dynamo (with cache)
         *
         * If successfull, record will be added to state.
         *
         * Arguments:
         *
         *   key:
         *     The client key to lookup the record.
         *     You can optionally speficy clientKey.
         *
         * Result:
         *
         *   record:
         *     The dynamo record that represents the client.
         */

        console.info("Started fetching client record.");

        var params = {
            key: { key: state.clientKey || state.key },
            index: "key-index",
            logLevel: console.level
        };

        console.debug("Searching for client key: " + params.key.key);

        clientTable.fetch(params, (err, record) => {
            if(err)
                return done({
                    name: "internalError",
                    message: "Failed to fetch client record.",
                    innerError: err
                })

            else if(!record)
                return done({
                    name: "badRequest",
                    message: "Bad Token.",
                    innerError: {
                        name: "notFound",
                        message: "Client record not found."
                    }
                });

            console.debug(`Client found: ${record.name} (${record.id})`);

            state.set('record', record);
            done(null, state);
        });
    }
};
