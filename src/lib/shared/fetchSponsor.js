'use strict'

module.exports = function Constructor(opts) {

    var seneca = this,
        ddbClient = opts.ddbClient,
        tables = opts.tables;

    return handler;

    // ------------------------------------------------------------------------

    function handler(console, state, done) {

        var sponsorKey = state.sponsorKey || state.get('claim.sponsorKey');

        if(!sponsorKey)
            return done({
                name: 'badRequest',
                message: "Bad Token.",
            });

        var params = {
            TableName: tables.sponsor,
            IndexName: 'key-index',
            Key: { key: sponsorKey }
        };

        console.info(`Looking up sponsor by key: ${sponsorKey}`);

        ddbClient.getSI(params, (err, result) => {
            if(err)
                return done({
                    name: 'internalError',
                    message: 'Failed to fetch sponsor record.',
                    innerError: err
                });

            else if(!result.Items || result.Items.length === 0 || result.Items[0].isDeleted)
                return done({
                    name: 'badRequest',
                    message: "Bad Token.",
                    innerError: {
                        name: "notFound",
                        message: "Sponsor record not found."
                    }
                });

            state.set('sponsorRecord', result.Items[0]);

            done(null, state);
        });
    }
}
