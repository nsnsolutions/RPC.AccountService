"use strict";

const assert = require("chai").assert;
const mock = require("mock-require");
const sinon = require("sinon");
const Seneca = require("seneca");

const senecaOpts = { serviceName: "account-service-unittest" };

describe("AuthorityPlugin v1", () => {

    beforeEach(function () {

        this.dynamoQueryStub = sinon.stub();
        this.envConfig = {
            overrides: {
                "local.common.logLevel": "debug",
                "local.account.sponorTable": "UNITTEST_VFS_Sponsor",
                "local.account.clientTable": "UNITTEST_VFS_Client",
            },
        };

        mock("aws-sdk", {
            SSM: function () {
                return {
                    getParameters: () => { },
                };
            },
            DynamoDB: {
                DocumentClient: function () {
                    this.query = () => this.dynamoQueryStub();
                },
            },
        });
    });

    it.only("should return sponsorName in response body.", function (done) {

        this.dynamoQueryStub.returns({});

        const seneca = Seneca(senecaOpts)
            .test(done)
            .use("../src/env", this.envConfig)
            .use("../src/rpc-protocol")
            .use("../src/authority")
            .use("../src/account")
            .use("../src/jwt");

        seneca.ready(() => {

            var params = {
                "type": "jwt",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJWRUwiLCJhcGlLZXkiOiJtOWp0elloWnVuOTVQMDRhWmJPN1M4WHhjbUl6dDhsZjlZRHVESmZKIiwic3BvbnNvcktleSI6IjcwZDFlMDU5NjdkNDRjOGQ5YTU1MGZlZmU0NTMwNjMzIiwiY2xpZW50S2V5IjoiZjAzY2JmM2NhYmFjNDFiMGFkOTUxODQ2MmM4OTdkMWMiLCJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJnbHVjYXMiLCJmdWxsTmFtZSI6Ikdlb3JnZSBMdWNhcyIsImVtYWlsIjoiZ2x1Y2FzQHZlbG1hdG9vbHMuY29tIiwicGhvdG9VcmwiOiIiLCJpYXQiOjE0ODQxNzMxNzksImV4cCI6MTkxNDcyMTU5OSwicm9sZXMiOlsiQ29udHJpYnV0b3IiXX0.IeltxeKn6GXLipntYeDuPm0m6ack8-BxfuvjGe2s198",
            };

            this.seneca.act("role:account,ver:v1,cmd:getAuthorityFromToken", params, (err, data) => {
                done();
            });
        });

        /*
        var params = {
            "type": "jwt",
            "token": mocks.tokens.valid
        };

        this.seneca.act("role:accountService.Pub,cmd:getAuthorityFromToken.v1", params, (err, data) => {
            assert(data.result, data.message || "Result object is empty.");
            assert.ok(data.result.sponsorName, "Sponsor Name was not returned.");
            assert.strictEqual(data.result.sponsorName, this.sponsorData.name, "Sponsor name was not the expected value.");
            done();
        });
        */

    });

    it("should return clientName in response body.", function(done) {

        var params = {
            "type": "jwt",
            "token": mocks.tokens.valid
        };

        this.seneca.act("role:accountService.Pub,cmd:getAuthorityFromToken.v1", params, (err, data) => {
            assert(data.result, data.message || "Result object is empty.");
            assert.ok(data.result.clientName, "Client Name was not returned.");
            assert.strictEqual(data.result.clientName, this.clientData.name, "Client name was not the expected value.");
            done();
        });

    });

    it("should reject expired tokens.", function(done) {

        var params = {
            "type": "jwt",
            "token": mocks.tokens.expired
        };

        this.seneca.act("role:accountService.Pub,cmd:getAuthorityFromToken.v1", params, (err, data) => {
            assert(data.hasError, "There was no error raised by method.");
            assert.strictEqual(data.code, rpcfwErrors.ERRINT_BAD_REQUEST, "Wrong error code returned.");
            assert(data.message.startsWith("Claim rejected. Token expired."), "Wrong error message returned: "+data.message);
            done();
        });

    });

    it("should reject inconsistent tokens - ISS and sponsor.code miss-match.", function(done) {

        var params = {
            "type": "jwt",
            "token": mocks.tokens.expired
        };

        this.sponsorData.code = "miss-match";

        this.seneca.act("role:accountService.Pub,cmd:getAuthorityFromToken.v1", params, (err, data) => {
            assert(data.hasError, "There was no error raised by method.");
            assert.strictEqual(data.code, rpcfwErrors.ERRINT_BAD_REQUEST, "Wrong error code returned.");
            assert(data.message.startsWith("Claim rejected. Inconsistent iss."), "Wrong error message returned: "+data.message);
            done();
        });

    });

});
