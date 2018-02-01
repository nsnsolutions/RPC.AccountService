'use strict'

module.exports = function Constructor(opts) {

    var seneca = this,
        ddbClient = opts.ddbClient,
        tables = opts.tables;

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        var clientKey = state.clientKey || state.get('claim.clientKey');

        if(!clientKey)
            return done({
                name: 'badRequest',
                message: "Bad Token.",
            });

        var params = {
            TableName: tables.client,
            IndexName: 'key-index',
            Key: { key: clientKey }
        };

        console.info(`Looking up client by key: ${clientKey}`);

        ddbClient.getSI(params, (err, result) => {
            if(err)
                return done({
                    name: 'internalError',
                    message: 'Failed to fetch client record.',
                    innerError: err
                });

            else if(!result.Items || result.Items.length === 0 || result.Items[0].isDeleted)
                return done({
                    name: 'badRequest',
                    message: "Bad Token.",
                    innerError: {
                        name: "notFound",
                        message: "Client record not found."
                    }
                });

            else if(!result.Items[0].isActive)
                return done({
                    name: 'badRequest',
                    message: "Bad Token.",
                    innerError: {
                        name: "badRequest",
                        message: "Client not active."
                    }
                });

            state.set('clientRecord', result.Items[0]);

            done(null, state);
        });
    }
}
