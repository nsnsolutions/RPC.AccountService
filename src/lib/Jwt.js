'use strict';

/*
 * Simple JWT Implementation
 * Supported Singing Algorythms:
 * - HS256
 * - RS256
 * - none
 *
 * Ref:
 * https://www.rfc-editor.org/rfc/rfc7519.txt
 * https://jwt.io/
 */

const crypto = require('crypto');

const ALG_HS256 = 'HS256';
const ALG_RS256 = 'RS256';
const ALG_NONE = 'none';

module.exports = {
    decodeToken: decodeToken,
    createToken: createToken,
    HS256: { createToken: (c, k) => createToken(c, k, ALG_HS256) },
    RS256: { createToken: (c, k) => createToken(c, k, ALG_RS256) },
    ALG: {
        HS256: ALG_HS256,
        RS256: ALG_RS256,
        NONE: ALG_NONE
    }
}

function decodeToken(token, key) {
    var isSigned = false,
        isJwt = true,
        isSignatureValid = false,
        header = {},
        claim;

    try {
        var parts = token.split(".");
        var index = token.lastIndexOf('.');
        var hc = token.substr(0, index);
        var s = token.substr(index + 1);

        header = jwtDecodePart(parts[0]);
        claim = jwtDecodePart(parts[1]);

        if(header.alg !== "none")
            isSigned = true;

        if(key && jwtCheckSignature(hc, s, key, header.alg) === true) 
            isSignatureValid = true;

    } catch (e) {
        console.warn("Failed to parse JWT: ", e);
        isJwt = false;
    }

    return {
        claim: claim,
        get isJwt() { return isJwt },
        get isSigned() { return isSigned },
        get isValid() { return isSignatureValid },
        asToken: function(key) {
            return isJwt ? createToken(claim, key, header.alg) : null; 
        },
        validate: function(key) {
            if (!isJwt)
                return false;
            isSignatureValid = jwtCheckSignature(hc, s, key, header.alg) === true;
            return isSignatureValid;
        }
    }
}

function createToken(claim, key, alg) {

    if(!alg)
        alg = 'none';

    var h = jwtEncodePart({ typ: "JWT", alg: alg });
    var c = jwtEncodePart(claim);
    var hc = `${h}.${c}`;
    var s = jwtComputeSignature(hc, key, alg);
    return `${hc}.${s}`;
}

function jwtEncodePart(obj) {
    var json = JSON.stringify(obj);
    return b64Encode(json);
}

function jwtDecodePart(str) {
    var json = b64Decode(str);
    return JSON.parse(json);
}

function b64Decode(str) {

    var padding = 4 - (str.length % 4);

    if(padding < 4)
        for(var i = 0; i < padding; i++)
            str+='=';

    return new Buffer(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
}

function b64Encode(str) {
    return new Buffer(str).toString('base64');
}

function jwtComputeSignature(hc, key, alg) {
    switch(alg) {
        case ALG_NONE:
            return "";

        case ALG_HS256:
            var hmac = crypto.createHmac('sha256', key);
            hmac.update(hc);
            return hmac.digest('base64');

        case ALG_RS256:
            var rsaSign = crypto.createSign('RSA-SHA256');
            rsaSign.update(hc);
            return rsaSign.sign(key, "base64");
    }

    return null;
}

function jwtCheckSignature(hc, signature, key, alg) {
    switch(alg) {
        case ALG_NONE:
            return "" === signature;

        case ALG_HS256:
            // Base64 might or might not contain padding chars. Best to decode
            // both to byte arrays and compare the actual data.
            return b64Decode(signature) === b64Decode(jwtComputeSignature(hc,key,alg));

        case ALG_RS256:
            var rsaVerify = crypto.createVerify('RSA-SHA256');
            rsaVerify.update(hc);
            return rsaVerify.verify(key, signature, "base64");
    }

    return null;
}
