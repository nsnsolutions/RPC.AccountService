'use strict'

module.exports = function(database) {

    var data = database || require('./mock_DynamoData.json');

    return {
        getSI: getSI
    }

    function getSI(p, cb) {
        if(p.TableName in data)
            cb(null, data[p.TableName]);
        else
            cb(new Error('MOCK: Unkonwn table: ' + p.TableName));
    }
}
