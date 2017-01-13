'use strict';

module.exports = function FetchClientConstructor(trans, opts) {

    var common = this,
        seneca = trans,
        sponsorTable = opts.dynamoCacheClients.sponsor,
        clientTable = opts.dynamoCacheClients.client;

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        /*
         * Retrieve the client record from dynamo (with cache)
         *
         * If successfull, record will be added to state.
         *
         * Arguments:
         *
         *   key:
         *     The client key to lookup the record.
         *     You can optionally speficy clientKey.
         *
         * Result:
         *
         *   record:
         *     The dynamo record that represents the client.
         */

        console.info("Started fetching client record.");

        var params = {
            key: { key: state.clientKey || state.key },
            index: "key-index",
            logLevel: console.level
        };

        console.debug("Searching for client key: " + params.key.key);

        clientTable.fetch(params, (err, record) => {
            if(err)
                return done({
                    name: "internalError",
                    message: "Failed to fetch client record.",
                    innerError: err
                })

            else if(!record)
                return done({
                    name: "badRequest",
                    message: "Bad Token.",
                    innerError: {
                        name: "notFound",
                        message: "Client record not found."
                    }
                });

            console.debug(`Client found: ${record.name} (${record.id})`);

            state.set('record', record);
            done(null, state);
        });
    }
}
