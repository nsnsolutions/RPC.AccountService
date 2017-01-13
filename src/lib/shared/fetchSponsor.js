'use strict';

module.exports = function FetchSponsorConstructor(trans, opts) {

    var common = this,
        seneca = trans,
        sponsorTable = opts.dynamoCacheClients.sponsor,
        clientTable = opts.dynamoCacheClients.client;

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        /*
         * Retrieve the sponsor record from dynamo (with cache)
         *
         * If successfull, record will be added to state.
         *
         * Arguments:
         *
         *   key:
         *     The sponsor key to lookup the record.
         *     You can optionally speficy sponsorKey.
         *
         * Result:
         *
         *   record:
         *     The dynamo record that represents the sponsor.
         */

        console.info("Started fetching sponsor record.");

        var params = {
            key: { key: state.sponsorKey || state.key },
            index: "key-index",
            logLevel: console.level
        };

        console.debug("Searching for sponsor key: " + params.key.key);

        sponsorTable.fetch(params, (err, record) => {
            if(err)
                return done({
                    name: "internalError",
                    message: "Failed to fetch sponsor record.",
                    innerError: err
                })

            else if(!record)
                return done({
                    name: "badRequest",
                    message: "Bad Token.",
                    innerError: {
                        name: "notFound",
                        message: "Sponsor record not found."
                    }
                });

            console.debug(`Sponsor found: ${record.code} (${record.id})`);

            state.set('record', record);
            done(null, state);
        });
    }
}
