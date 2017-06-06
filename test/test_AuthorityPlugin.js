'use strict';

const assert = require('assert'),
      rpcfwErrors = require('rpcfw/lib/errors'),
      mocks = require('./mocks'),
      services = require('../src/services');

describe('AuthorityPlugin', function() {
    describe('getAuthorityFromToken (v1)', function() {

        before(function() {

            this.logLevel = 'none';

            // The data can be changed by specfic tests if needed.
            this.dynamoData = mocks.getDynamoData();
            this.sponsorData = this.dynamoData.mock_sponsor.Items[0];
            this.clientData = this.dynamoData.mock_client.Items[0];

            // These items are hung on the global incase spies or stubs are needed.
            this.seneca = mocks.Seneca();
            this.ddbClient = mocks.DocumentClient(this.dynamoData);

            services.AuthorityPlugin.call(this.seneca, {
                ddbClient: this.ddbClient,
                logLevel: this.logLevel,
                tables: {
                    sponsor: 'mock_sponsor',
                    client: 'mock_client'
                }
            });

        });

        it('should return sponsorName in response body.', function(done) {

            var params = {
                'type': 'jwt',
                'token': mocks.tokens.valid
            };

            this.seneca.act('role:accountService.Pub,cmd:getAuthorityFromToken.v1', params, (err, data) => {
                assert(data.result, data.message || "Result object is empty.");
                assert.ok(data.result.sponsorName, "Sponsor Name was not returned.");
                assert.strictEqual(data.result.sponsorName, this.sponsorData.name, "Sponsor name was not the expected value.");
                done();
            });

        });

        it('should return clientName in response body.', function(done) {

            var params = {
                'type': 'jwt',
                'token': mocks.tokens.valid
            };

            this.seneca.act('role:accountService.Pub,cmd:getAuthorityFromToken.v1', params, (err, data) => {
                assert(data.result, data.message || "Result object is empty.");
                assert.ok(data.result.clientName, "Client Name was not returned.");
                assert.strictEqual(data.result.clientName, this.clientData.name, "Client name was not the expected value.");
                done();
            });

        });

        it('should reject expired tokens.', function(done) {

            var params = {
                'type': 'jwt',
                'token': mocks.tokens.expired
            };

            this.seneca.act('role:accountService.Pub,cmd:getAuthorityFromToken.v1', params, (err, data) => {
                assert(data.hasError, 'There was no error raised by method.');
                assert.strictEqual(data.code, rpcfwErrors.ERRINT_BAD_REQUEST, "Wrong error code returned.");
                assert(data.message.startsWith('Claim rejected. Token expired.'), "Wrong error message returned: "+data.message);
                done();
            });

        });

        it('should reject inconsistent tokens - ISS and sponsor.code miss-match.', function(done) {

            var params = {
                'type': 'jwt',
                'token': mocks.tokens.expired
            };

            this.sponsorData.code = "miss-match";

            this.seneca.act('role:accountService.Pub,cmd:getAuthorityFromToken.v1', params, (err, data) => {
                assert(data.hasError, 'There was no error raised by method.');
                assert.strictEqual(data.code, rpcfwErrors.ERRINT_BAD_REQUEST, "Wrong error code returned.");
                assert(data.message.startsWith('Claim rejected. Inconsistent iss.'), "Wrong error message returned: "+data.message);
                done();
            });

        });

    });
});
