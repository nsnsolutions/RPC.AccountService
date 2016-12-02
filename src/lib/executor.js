'use strict';

const async = require('async');
const repr = require('./repr');

module.exports = function Executor(opts) {

    var name = opts.name;
    var tasks = opts.tasks;
    var rpcDone = opts.rpcDone;
    var reprName = opts.repr || 'empty';

    return { run: run };

    // ------------------------------------------------------------------------

    function run(state) {

        // Copy workflow task list.
        var t = tasks.slice();

        // Bookend the task list with start and end methods
        t.unshift(start);
        t.push(finish);

        // Start the task
        async.waterfall(t, finalize);

        function start(done) {

            console.info("[" + name + "] Starting workflow (" + tasks.length + " tasks)");

            done(null, state);
        }

        function finish(state, done) {

            console.info("[" + name + "] Creating response");

            try {
                done(null, repr(reprName, state));
            } catch(err) {
                return done({
                    name: 'internalError',
                    message: 'Failed to create representation for response.',
                    innerError: err
                });
            }
        }

        function finalize(err, state) {
            if(err) {

                console.error("[" + name + "] Error while executing workflow.", err);

                if(typeof err === 'object' && 'name' in err && err.name in rpcDone)
                    return rpcDone[err.name](err.message);

                return rpcDone.internalError(err.message);
            }

            rpcDone.success(state);

            console.info("[" + name + "] Workflow complete.");
        }
    }
};
