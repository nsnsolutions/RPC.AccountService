"use strict";

const ex = require("../rpc-protocol/exceptions");

module.exports = assertClaim;

async function assertClaim(args) {

    // const seneca = this;

    /*
     * This all assumes claim version 1.0.
     * If you are adding version support, please break this into seperate functions.
     */


    // TODO: Bug: empy string in photoUrl. HotFIx.
    if (!args.claim.photoUrl) {
        args.claim.photoUrl = " ";
    }

    if (!args.claim) {
        throw new ex.BadRequest("Missing claim");

    } else if (!args.claim.ver) {
        throw new ex.BadRequest("Claim missing required field 'ver'");

    } else if (typeof args.claim.ver !== "string") {
        throw new ex.BadRequest("Wrong type for field 'ver'. Expected: String");

    } else if (args.claim.ver !== "1.0") {
        throw new ex.BadRequest("Unsupported claim version.");

    } else if (!args.claim.iss) {
        throw new ex.BadRequest("Claim missing required field: iss");

    } else if (typeof args.claim.iss !== "string") {
        throw new ex.BadRequest("Wrong type for field: iss. Expected: String");

    } else if (!args.claim.sponsorKey) {
        throw new ex.BadRequest("Claim missing required field: sponsorKey");

    } else if (typeof args.claim.sponsorKey !== "string") {
        throw new ex.BadRequest("Wrong type for field: sponsorKey. Expected String.");

    } else if (!args.claim.clientKey) {
        throw new ex.BadRequest("Claim missing required field: clientKey");

    } else if (typeof args.claim.clientKey !== "string") {
        throw new ex.BadRequest("Wrong type for field: clientKey. Expected: String.");

    } else if (!args.claim.userId) {
        throw new ex.BadRequest("Claim missing required field: userId");

    } else if (typeof args.claim.userId !== "string") {
        throw new ex.BadRequest("Wrong type for field: userId. Expected: String");

    } else if (!args.claim.userName) {
        throw new ex.BadRequest("Claim missing required field: userName");

    } else if (typeof args.claim.userName !== "string") {
        throw new ex.BadRequest("Wrong type for field: userName. Expected: String");

    } else if (!args.claim.fullName) {
        throw new ex.BadRequest("Claim missing required field: fullName");

    } else if (typeof args.claim.fullName !== "string") {
        throw new ex.BadRequest("Wrong type for field: fullName. Expected: String");

    } else if (!args.claim.email) {
        throw new ex.BadRequest("Claim missing required field: email");

    } else if (typeof args.claim.email !== "string") {
        throw new ex.BadRequest("Wrong type for field: email. Expected: String");

    } else if (!args.claim.photoUrl) {
        throw new ex.BadRequest("Claim missing required field: photoUrl");

    } else if (typeof args.claim.photoUrl !== "string") {
        throw new ex.BadRequest("Wrong type for field: photoUrl. Expected: String");

    } else if (!args.claim.iat) {
        throw new ex.BadRequest("Claim missing required field: iat");

    } else if (typeof args.claim.iat !== "number") {
        throw new ex.BadRequest("Wrong type for field: iat. Expected: Number");

    } else if (!args.claim.exp) {
        throw new ex.BadRequest("Claim missing required field: exp");

    } else if (typeof args.claim.exp !== "number") {
        throw new ex.BadRequest("Wrong type for field: exp. Expected: Number.");

    } else if (!args.claim.roles) {
        throw new ex.BadRequest("Claim missing required field: roles");

    } else if (typeof args.claim.roles !== "object" || !(args.claim.roles.length > -1)) {
        throw new ex.BadRequest("Wrong type for field: roles. Expected: String Array");

    }

    return args.claim.ver;
}
