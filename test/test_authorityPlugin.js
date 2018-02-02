"use strict";

const assert = require("chai").assert;
const Seneca = require("seneca");

const senecaOpts = { serviceName: "account-service-unittest" };

describe("AuthorityPlugin v1", () => {

    before(function () {
        this.envConfig = {
            overrides: {
                "local.common.logLevel": "debug",
                "local.account.sponorTable": "UNITTEST_VFS_Sponsor",
                "local.account.clientTable": "UNITTEST_VFS_Client",
            },
        };
    });

    it("should return sponsorName in response body.", function (done) {

        const seneca = Seneca(senecaOpts)
            .test(done)
            .use("../src/pin")
            .use("../src/env", this.envConfig)
            .use("../src/rpc-protocol")
            .use("../src/authority")
            .use("../src/jwt");

        seneca.rpc.add("role:dependent,inject:SSM", async () => ({ getParameters: () => {} }));

        seneca.rpc.add("role:account,cmd:fetchSponsor", async () => ({
            "code": "VEL",
            "id": "315bd1536ecf4f91848ab1c17975da27",
            "isDeleted": false,
            "key": "70d1e05967d44c8d9a550fefe4530633",
            "name": "TheSponsor",
            "secretKey": "secret",
            "updateDate": "2017-05-12T17:29:05.983Z",
        }));

        seneca.rpc.add("role:account,cmd:fetchClient", async () => ({
            "addressCity": "Somewhere",
            "addressLine1": "123 Maple St.",
            "addressLine2": " ",
            "addressSingleLine": "123 Maple St., Somewhere, US 12345",
            "addressState": "US",
            "addressZip": "12345",
            "createDate": "2016-10-01T08:00:00.000Z",
            "id": "f058b799b351480c8c3e231247314ff7",
            "isActive": true,
            "isDeleted": false,
            "key": "f03cbf3cabac41b0ad9518462c897d1c",
            "name": "TheClient",
            "sponsorId": "315bd1536ecf4f91848ab1c17975da27",
            "updateDate": "2017-05-22T16:39:24.046Z",
        }));

        seneca.ready(() => {

            var params = {
                "type": "jwt",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJWRUwiLCJhcGlLZXkiOiJtOWp0elloWnVuOTVQMDRhWmJPN1M4WHhjbUl6dDhsZjlZRHVESmZKIiwic3BvbnNvcktleSI6IjcwZDFlMDU5NjdkNDRjOGQ5YTU1MGZlZmU0NTMwNjMzIiwiY2xpZW50S2V5IjoiZjAzY2JmM2NhYmFjNDFiMGFkOTUxODQ2MmM4OTdkMWMiLCJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJnbHVjYXMiLCJmdWxsTmFtZSI6Ikdlb3JnZSBMdWNhcyIsImVtYWlsIjoiZ2x1Y2FzQHZlbG1hdG9vbHMuY29tIiwicGhvdG9VcmwiOiIiLCJpYXQiOjE0ODQxNzMxNzksImV4cCI6MTkxNDcyMTU5OSwicm9sZXMiOlsiQ29udHJpYnV0b3IiXX0.IeltxeKn6GXLipntYeDuPm0m6ack8-BxfuvjGe2s198",
            };

            seneca.act("role:account,ver:v1,cmd:getAuthorityFromToken", params, (err, data) => {
                assert(data.result, data.message || "Result object is empty.");
                assert.ok(data.result.sponsorName, "Sponsor Name was not returned.");
                assert.strictEqual(data.result.sponsorName, "TheSponsor", "Sponsor name was not the expected value.");
                done();
            });
        });
    });

    it("should return clientName in response body.", function (done) {

        const seneca = Seneca(senecaOpts)
            .test(done)
            .use("../src/pin")
            .use("../src/env", this.envConfig)
            .use("../src/rpc-protocol")
            .use("../src/authority")
            .use("../src/jwt");

        seneca.rpc.add("role:dependent,inject:SSM", async () => ({ getParameters: () => {} }));

        seneca.rpc.add("role:account,cmd:fetchSponsor", async () => ({
            "code": "VEL",
            "id": "315bd1536ecf4f91848ab1c17975da27",
            "isDeleted": false,
            "key": "70d1e05967d44c8d9a550fefe4530633",
            "name": "TheSponsor",
            "secretKey": "secret",
            "updateDate": "2017-05-12T17:29:05.983Z",
        }));

        seneca.rpc.add("role:account,cmd:fetchClient", async () => ({
            "addressCity": "Somewhere",
            "addressLine1": "123 Maple St.",
            "addressLine2": " ",
            "addressSingleLine": "123 Maple St., Somewhere, US 12345",
            "addressState": "US",
            "addressZip": "12345",
            "createDate": "2016-10-01T08:00:00.000Z",
            "id": "f058b799b351480c8c3e231247314ff7",
            "isActive": true,
            "isDeleted": false,
            "key": "f03cbf3cabac41b0ad9518462c897d1c",
            "name": "TheClient",
            "sponsorId": "315bd1536ecf4f91848ab1c17975da27",
            "updateDate": "2017-05-22T16:39:24.046Z",
        }));

        seneca.ready(() => {

            var params = {
                "type": "jwt",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJWRUwiLCJhcGlLZXkiOiJtOWp0elloWnVuOTVQMDRhWmJPN1M4WHhjbUl6dDhsZjlZRHVESmZKIiwic3BvbnNvcktleSI6IjcwZDFlMDU5NjdkNDRjOGQ5YTU1MGZlZmU0NTMwNjMzIiwiY2xpZW50S2V5IjoiZjAzY2JmM2NhYmFjNDFiMGFkOTUxODQ2MmM4OTdkMWMiLCJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJnbHVjYXMiLCJmdWxsTmFtZSI6Ikdlb3JnZSBMdWNhcyIsImVtYWlsIjoiZ2x1Y2FzQHZlbG1hdG9vbHMuY29tIiwicGhvdG9VcmwiOiIiLCJpYXQiOjE0ODQxNzMxNzksImV4cCI6MTkxNDcyMTU5OSwicm9sZXMiOlsiQ29udHJpYnV0b3IiXX0.IeltxeKn6GXLipntYeDuPm0m6ack8-BxfuvjGe2s198",
            };

            seneca.act("role:account,ver:v1,cmd:getAuthorityFromToken", params, (err, data) => {
                assert(data.result, data.message || "Result object is empty.");
                assert.ok(data.result.clientName, "Client Name was not returned.");
                assert.strictEqual(data.result.clientName, "TheClient", "Client name was not the expected value.");
                done();
            });
        });
    });

    it("should reject expired tokens.", function (done) {

        const seneca = Seneca(senecaOpts)
            .test(done)
            .use("../src/pin")
            .use("../src/env", this.envConfig)
            .use("../src/rpc-protocol")
            .use("../src/authority")
            .use("../src/jwt");

        seneca.rpc.add("role:dependent,inject:SSM", async () => ({ getParameters: () => {} }));

        seneca.rpc.add("role:account,cmd:fetchSponsor", async () => ({
            "code": "VEL",
            "id": "315bd1536ecf4f91848ab1c17975da27",
            "isDeleted": false,
            "key": "70d1e05967d44c8d9a550fefe4530633",
            "name": "TheSponsor",
            "secretKey": "secret",
            "updateDate": "2017-05-12T17:29:05.983Z",
        }));

        seneca.rpc.add("role:account,cmd:fetchClient", async () => ({
            "addressCity": "Somewhere",
            "addressLine1": "123 Maple St.",
            "addressLine2": " ",
            "addressSingleLine": "123 Maple St., Somewhere, US 12345",
            "addressState": "US",
            "addressZip": "12345",
            "createDate": "2016-10-01T08:00:00.000Z",
            "id": "f058b799b351480c8c3e231247314ff7",
            "isActive": true,
            "isDeleted": false,
            "key": "f03cbf3cabac41b0ad9518462c897d1c",
            "name": "TheClient",
            "sponsorId": "315bd1536ecf4f91848ab1c17975da27",
            "updateDate": "2017-05-22T16:39:24.046Z",
        }));

        seneca.ready(() => {

            var params = {
                "type": "jwt",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJWRUwiLCJhcGlLZXkiOiJtOWp0elloWnVuOTVQMDRhWmJPN1M4WHhjbUl6dDhsZjlZRHVESmZKIiwic3BvbnNvcktleSI6IjcwZDFlMDU5NjdkNDRjOGQ5YTU1MGZlZmU0NTMwNjMzIiwiY2xpZW50S2V5IjoiZjAzY2JmM2NhYmFjNDFiMGFkOTUxODQ2MmM4OTdkMWMiLCJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJnbHVjYXMiLCJmdWxsTmFtZSI6Ikdlb3JnZSBMdWNhcyIsImVtYWlsIjoiZ2x1Y2FzQHZlbG1hdG9vbHMuY29tIiwicGhvdG9VcmwiOiIiLCJpYXQiOjE0ODQxNzMxNzksImV4cCI6MTQ4NDE3MzE4OSwicm9sZXMiOlsiQ29udHJpYnV0b3IiXX0.PICxL_w214W77zThQ8XFLaabMQXMsSsQ4JXJUwlLDSc",
            };

            seneca.act("role:account,ver:v1,cmd:getAuthorityFromToken", params, (err, data) => {
                assert(data.hasError, "There was no error raised by method.");
                assert.strictEqual(data.code, 400, "Wrong error code returned.");
                assert(data.message.startsWith("Claim rejected. Token expired."), "Wrong error message returned: "+data.message);
                done();
            });
        });
    });

    it("should reject inconsistent tokens - ISS and sponsor.code miss-match.", function (done) {

        const seneca = Seneca(senecaOpts)
            .test(done)
            .use("../src/pin")
            .use("../src/env", this.envConfig)
            .use("../src/rpc-protocol")
            .use("../src/authority")
            .use("../src/jwt");

        seneca.rpc.add("role:dependent,inject:SSM", async () => ({ getParameters: () => {} }));

        seneca.rpc.add("role:account,cmd:fetchSponsor", async () => ({
            "code": "badbad",
            "id": "315bd1536ecf4f91848ab1c17975da27",
            "isDeleted": false,
            "key": "70d1e05967d44c8d9a550fefe4530633",
            "name": "TheSponsor",
            "secretKey": "secret",
            "updateDate": "2017-05-12T17:29:05.983Z",
        }));

        seneca.rpc.add("role:account,cmd:fetchClient", async () => ({
            "addressCity": "Somewhere",
            "addressLine1": "123 Maple St.",
            "addressLine2": " ",
            "addressSingleLine": "123 Maple St., Somewhere, US 12345",
            "addressState": "US",
            "addressZip": "12345",
            "createDate": "2016-10-01T08:00:00.000Z",
            "id": "f058b799b351480c8c3e231247314ff7",
            "isActive": true,
            "isDeleted": false,
            "key": "f03cbf3cabac41b0ad9518462c897d1c",
            "name": "TheClient",
            "sponsorId": "315bd1536ecf4f91848ab1c17975da27",
            "updateDate": "2017-05-22T16:39:24.046Z",
        }));

        seneca.ready(() => {

            var params = {
                "type": "jwt",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJWRUwiLCJhcGlLZXkiOiJtOWp0elloWnVuOTVQMDRhWmJPN1M4WHhjbUl6dDhsZjlZRHVESmZKIiwic3BvbnNvcktleSI6IjcwZDFlMDU5NjdkNDRjOGQ5YTU1MGZlZmU0NTMwNjMzIiwiY2xpZW50S2V5IjoiZjAzY2JmM2NhYmFjNDFiMGFkOTUxODQ2MmM4OTdkMWMiLCJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJnbHVjYXMiLCJmdWxsTmFtZSI6Ikdlb3JnZSBMdWNhcyIsImVtYWlsIjoiZ2x1Y2FzQHZlbG1hdG9vbHMuY29tIiwicGhvdG9VcmwiOiIiLCJpYXQiOjE0ODQxNzMxNzksImV4cCI6MTkxNDcyMTU5OSwicm9sZXMiOlsiQ29udHJpYnV0b3IiXX0.IeltxeKn6GXLipntYeDuPm0m6ack8-BxfuvjGe2s198",
            };

            seneca.act("role:account,ver:v1,cmd:getAuthorityFromToken", params, (err, data) => {
                assert(data.hasError, "There was no error raised by method.");
                assert.strictEqual(data.code, 400, "Wrong error code returned.");
                assert(data.message.startsWith("Claim rejected. Inconsistent iss."), "Wrong error message returned: "+data.message);
                done();
            });
        });
    });

});
