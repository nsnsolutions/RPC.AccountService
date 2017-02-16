# RPC.AccountService

A service for authority, authorization and account details.

## Quick Start

To run the service locally:

```bash
npm install
npm start -- --debug
```

For automatic code reloading in development:

```bash
npm install -g nodemon
nodemon -- --debug
```

To run on __AMQP__, omit the ```--debug``` option from either command.

<sup>_Note: You will need a running [RabbitMQ and ETCD2](https://github.com/nsnsolutions/rpcfw.env) environment._</sup>

# Interface

This section outlines the details you will need to use this service.

- [Methods](#methods)
- [Representations](#representations)

## Methods

- [Get Authority From Token (v1)](#get-authority-from-token-v1) - Validate an authority token and return a json representation of that authority.
- [Invalidate Sponsor Cache (v1)](#invalidate-sponsor-cache-v1) - Delete the given sponsor from the cache.
- [Invalidate Client Cache (v1)](#invalidate-client-cache-v1) - Delete the given client from the cache.


### Get Authority From Token (v1)

Validate an authority token and return a json representation of that authority.

#### RPC Execution

- Role: accountService.Pub
- Cmd: getAuthorityFromToken.v1

```javascript
var args = { ... }
seneca.act('role:accountService.Pub,cmd:getAuthorityFromToken.v1', args, (err, dat) => {
    /* Handle result */
});
```

#### HTTP Execution

- Service Name: accountService
- Method Name: getAuthorityFromToken
- Version: v1

```
POST /amqp/exec/accountService/getAuthorityFromToken?version=v1 HTTP/1.1
Host: devel.rpc.velma.com
Content-Type: application/json
x-repr-format: RPC
Cache-Control: no-cache

{ ... }
```

#### Arguments

This method accepts the following arguments.

| Param     | Type   | Default | Description |
| --------- | ------ | ------- | ----------- |
| type | String | N/A | The type of token. Currently only `JWT` is supported. |
| token | String | N/A | The token data. |

#### Returns

This method returns the following information.

- [Error Response (v1)](#error-response-v1)
- [Claim (v1)](#claim-v1)

### Invalidate Sponsor Cache (v1)

Delete the given sponsor from the cache.

#### RPC Execution

- Role: accountService.Pub
- Cmd: invalidateSponsorCache.v1

```javascript
var args = { ... }
seneca.act('role:accountService.Pub,cmd:invalidateSponsorCache.v1', args, (err, dat) => {
    /* Handle result */
});
```

#### HTTP Execution

- Service Name: accountService
- Method Name: invalidateSponsorCache
- Version: v1

```
POST /amqp/exec/accountService/invalidateSponsorCache?version=v1 HTTP/1.1
Host: devel.rpc.velma.com
Content-Type: application/json
x-repr-format: RPC
Cache-Control: no-cache

{ ... }
```

#### Arguments

This method accepts the following arguments.

| Param     | Type   | Default | Description |
| --------- | ------ | ------- | ----------- |
| key | String | N/A | The index-key of the sponsor's record to invalidate. |
| token | String | N/A | Authority for this request. |

#### Returns

This method returns the following information.

- [Error Response (v1)](#error-response-v1)
- [Empty (all)](#empty-all)

### Invalidate Client Cache (v1)

Delete the given client from the cache.

#### RPC Execution

- Role: accountService.Pub
- Cmd: invalidateClientCache.v1

```javascript
var args = { ... }
seneca.act('role:accountService.Pub,cmd:invalidateClientCache.v1', args, (err, dat) => {
    /* Handle result */
});
```

#### HTTP Execution

- Service Name: accountService
- Method Name: invalidateClientCache
- Version: v1

```
POST /amqp/exec/accountService/invalidateClientCache?version=v1 HTTP/1.1
Host: devel.rpc.velma.com
Content-Type: application/json
x-repr-format: RPC
Cache-Control: no-cache

{ ... }
```

#### Arguments

This method accepts the following arguments.

| Param     | Type   | Default | Description |
| --------- | ------ | ------- | ----------- |
| key | String | N/A | The index-key of the sponsor's record to invalidate. |
| token | String | N/A | Authority for this request. |

#### Returns

This method returns the following information.

- [Error Response (v1)](#error-response-v1)
- [Empty (all)](#empty-all)


## Representations

All response sent by this service will differ depending on the protocal used
and the control headers set on the request. You can read more about how this
output is create in the [RPC Interface Response Model](https://github.com/nsnsolutions/RPC.Interface#response-object)
documentation.

Excluding [Error Response (v1)](#error-response-v1), this documentation will
only show the result body details.

- [Error Response (v1)](#error-response-v1)
- [Claim (v1)] (#claim-v1)
- [Empty (all)] (#empty-all)

### Error Response (v1)

Represents an execution failure. Details about the failure are placed in
`message` and a numeric value is placed in `code` that is specific to the type
of error.

This response uses the standard
[rpcfw](https://github.com/nsnsolutions/rpcfw/blob/devel/README.md#errors)
error model and codes.

```json
{
    "hasError": true,
    "code": 000,
    "message": "Description of error"
}
```

For more information on workflow error codes:
[RPC-Utils.Executor](https://github.com/nsnsolutions/RPC.Utils/blob/devel/README.md#executor)

<sup>_Note: This detail level is not always returnes. Please see the [RPC Interface Response Model](https://github.com/nsnsolutions/RPC.Interface#response-object) documentation for more information._</sup>


### Claim (v1)

Represents principle authority as declared by the issuing party and
validated by this service.


| Field | Type | Description |
| ----- | ---- | ----------- |
| ver | String | Version of claim |
| iss | String | Issuer code |
| apiKey | String | Api key |
| sponsorKey | String | Sponsor key |
| clientKey | String | Client key |
| userId | String | User's id as defined by the issuer |
| userName | String | Username as defined by the issuer |
| fullName | String | User's full name as defined by the issuer. |
| email | String | User's email address as defined by the issuer. |
| photoUrl | String | URL to a headshot of the user. |
| iat | Number | Date at which this token was issuesed. |
| exp | Number | Date at which this token will expire. |
| roles | Array | A list of roles assigned by the sponsor to this user. |
| sponsorId | String | The unique id of the sponsor record. |
| sponsorName | String | The friendly name of the sponsor record. |
| clientId | String | The unique id of the client record. |
| clientName | String | The friendly name of the client record. |
| clientPhoneNumber | String | The client's phone number. |
| clientAddress.singleLine | String | The client's physical address in single line format. |
| clientAddress.line1 | String | First line of the client's physical address. |
| clientAddress.line2 | String | Second line of the client's physical address. |
| clientAddress.city | String | City part of the client's physical address. |
| clientAddress.state | String | City part of the client's physical address. |
| clientAddress.zip | String | Zip part of the client's physical address. |


### Empty (all)

Represents a empty data return.


_Empty Representations_



---

<sup>_This documentation was generated by Ian's handy template engine. If you find errors, please let hime know._</sup>