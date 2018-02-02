"use strict";

const ex = require("../rpc-protocol/exceptions");

module.exports = renewToken_v1;

async function renewToken_v1(args) {

    const seneca = this;

    if (!args.type) {
        throw new ex.BadRequest("Missing required field 'type'");

    } else if (typeof args.type !== "string") {
        throw new ex.BadRequest("Wrong type for required field 'type'. Expected String.");

    } else if (!args.token) {
        throw new ex.BadRequest("Missing required field 'token'");

    } else if (typeof args.token !== "string") {
        throw new ex.BadRequest("Wrong type for required field 'token'. Expected String.");

    }

    // TODO: Validate the token type. We only support jwt currently, so the step is skipped.

    const claim = await seneca.rpc.actInternal("role:jwt,cmd:parseToken", { token: args.token });

    await seneca.rpc.actInternal("role:authority,cmd:assertClaim", { claim });

    const sponsor = await seneca.rpc.actInternal("role:account,cmd:fetchSponsor", { key: claim.sponsorKey });
    const client = await seneca.rpc.actInternal("role:account,cmd:fetchClient", { key: claim.clientKey });
    const trusted = await seneca.rpc.actInternal("role:jwt,cmd:checkSignature", {
        token: args.token,
        key: sponsor.secretKey,
    });

    let nowTs = Math.round((new Date()).getTime() / 1000);

    if (!trusted) {
        throw new ex.Forbidden("Invalid token signature.");

    } else if(claim.iss !== sponsor.code) {
        throw new ex.BadRequest("Claim rejected. Inconsistent iss.");

    } else if(claim.sponsorKey !== sponsor.key) {
        throw new ex.BadRequest("Claim rejected. Inconsistent sponsorKey.");

    } else if(claim.clientKey !== client.key) {
        throw new ex.BadRequest("Claim rejected. Inconsistent clientKey.");

    } else if(client.sponsorId !== sponsor.id) {
        throw new ex.BadRequest("Claim rejected. Inconsistent clientKey.");

    } else if(sponsor.isDeleted) {
        throw new ex.BadRequest("Claim rejected. Sponsor no longer exists.");

    } else if(client.isDeleted) {
        throw new ex.BadRequest("Claim rejected. Client no longer exists.");

    } else if(!client.isActive) {
        throw new ex.BadRequest("Claim rejected. Client not active.");

    } else if(claim.exp < (nowTs - 10)) {
        throw new ex.BadRequest("Claim rejected. Token expired.");

    } else if(claim.iat > (nowTs + 10)) {
        throw new ex.BadRequest("Claim rejected. Inconsistent iat.");

    }

    if (claim.photoUrl === " ") {
        // BUGFIX
        claim.photoUrl = "";

    }

    /*
     * Extend JWT Token by 70 hrs.
     * This is to accomidate a weekend. 24 hrs on sat and sun
     * + 7 hrs (5pm to midnight) on friday.
     * + 9 hrs (12am to 9am) on monday
     * 24+24+7+9=64 -> round up to 70
     */

    claim.exp = nowTs + 252000; // 70hrs

    seneca.log.info({ msg: `Renewed token: ${claim.fullName} <${claim.email}>` });

    return seneca.rpc.actInternal("role:jwt,cmd:toToken", { claim, key: sponsor.secretKey });
}
