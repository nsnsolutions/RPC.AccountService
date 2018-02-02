"use strict";

const ex = require("../rpc-protocol/exceptions");

module.exports = getAuthorityFromToken_v1;

async function getAuthorityFromToken_v1(args) {

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

    // Create repr

    if (claim.photoUrl === " ") {
        // BUGFIX
        claim.photoUrl = "";

    }

    claim.sponsorId = sponsor.id;
    claim.sponsorName = sponsor.name;
    claim.clientId = client.id;
    claim.clientName = client.name;
    claim.clientPhoneNumber = client.phoneNumber;
    claim.clientAddress = {
        singleLine: client.addressSingleLine,
        line1: client.addressLine1,
        line2: client.addressLine2 || "",
        city: client.addressCity,
        state: client.addressState,
        zip: client.addressZip,
    };

    seneca.log.info({ msg: `Validated user: ${claim.fullName} <${claim.email}>` });

    return claim;
}
