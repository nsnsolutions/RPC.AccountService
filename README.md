# RCP RPC.AccountService

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

To run __AMPQ__, omit the `--debug` option from either command.

_NOTE: you will need a running RabbitMQ and ETCD2 Environment._

---

# API

## Error Model:

Standard RPCFW error models

```json
{
    "hasError": true,
    "code": 000,
    "message": "Description of error"
}
```

__Application Codes__

No application specific error codes exist.

## Methods

The following is a list of all the available methods provided by this service.
More detail can be found for each method in dedicated sections below.

| role               | cmd                       | Plugin             | Description                                                                    |
| ------------------ | ------------------------- | ------------------ | ------------------------------------------------------------------------------ |
| accountService.Pub | getAuthorityFromToken.v1  | AuthorityPlugin    | Validate a authority token and return a json representation of that authority. |
| accountService.Pub | invalidateSponsorCache.v1 | CacheManagerPlugin | Delete the given sponsor from the __CACHE__.                                   |
| accountService.Pub | invalidateClientCache.v1  | CacheManagerPlugin | Delete the given client from the __CACHE__.                                    |

### Get Authority From Token (V1)

Validate an authoirty token and return a json representation of that authority.

- role: accountService.Pub
- cmd: getAuthorityFromToken.v1
- Plugin: AuthorityPlugin
- Logging: AFT01

__API Interface URI__

`/{PREFIX}/exec/accountService/getAuthorityFromToken?version=1`

__Arguments__

| Param    | Type      | Default                | Description                                                          |
| -------- | --------- | ---------------------- | -------------------------------------------------------------------- |
| logLevel | String    | `Environment Default`  | Override logLevel to increase/decrease logging output for this call. |
| type     | String    | N/A                    | The type of token. Currently only `JWT` is support.                  |
| token    | String    | N/A                    | The actual token to validate.                                        |

### Invalidate Sponsor Cache (V1)

Delete the given sponsor from the cache.  This does not alter the record in any
way. It only invalidates the cache object. The record will be reloaded into
cache on request.

- role: accountService.Pub
- cmd: invalidateSponsorCache.v1
- Plugin: CacheManagerPlugin
- Logging: ISC01

__API Interface URI__

`/{PREFIX}/exec/accountService/invalidateSponsorCache?version=1`

__Arguments__

| Param    | Type      | Default                | Description                                                          |
| -------- | --------- | ---------------------- | -------------------------------------------------------------------- |
| logLevel | String    | `Environment Default`  | Override logLevel to increase/decrease logging output for this call. |
| token    | String    | N/A                    | A token used to check the authority of the request.                  |
| key      | String    | N/A                    | The index-key Key of the sponsor to invalidate the record for.       |

### Invalidate Client Cache (V1)

Delete the given client from the cache.  This does not alter the record in any
way. It only invalidates the cache object. The record will be reloaded into
cache on request.

- role: accountService.Pub
- cmd: invalidateClientCache.v1
- Plugin: CacheManagerPlugin
- Logging: ICC01

__API Interface URI__

`/{PREFIX}/exec/accountService/invalidateClientCache?version=1`

__Arguments__

| Param    | Type      | Default                | Description                                                          |
| -------- | --------- | ---------------------- | -------------------------------------------------------------------- |
| logLevel | String    | `Environment Default`  | Override logLevel to increase/decrease logging output for this call. |
| token    | String    | N/A                    | A token used to check the authority of the request.                  |
| key      | String    | N/A                    | The index-key Key of the client to invalidate the record for.        |
