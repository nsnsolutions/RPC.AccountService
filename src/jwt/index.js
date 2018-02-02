"use strict";

const ex = require("../rpc-protocol/exceptions");
const JwtParser = require("./jwt");

module.exports = function JWTPlugin() {

    const seneca = this;

    seneca.rpc.addInternal("role:jwt,cmd:parseToken", parseToken);
    seneca.rpc.addInternal("role:jwt,cmd:toToken", toToken);
    seneca.rpc.addInternal("role:jwt,cmd:checkSignature", checkSignature);

    return { name: module.exports.name };

    // ------------------------------------------------------------------------

    async function parseToken(args) {

        const parser = JwtParser.decodeToken(args.token);

        if (!parser.isJwt) {
            throw new ex.BadRequest("Bad Token.");

        }

        return parser.claim;
    }

    async function toToken(args) {
        return JwtParser.HS256.createToken(args.claim, args.key);
    }

    async function checkSignature(args) {

        const parser = JwtParser.decodeToken(args.token, args.key);

        if (!parser.isJwt) {
            throw new ex.BadRequest("Bad Token.");

        }

        return parser.isSigned && parser.isValid;
    }
};
