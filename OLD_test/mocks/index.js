'use strict';

const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJTUDEiLCJhcGlLZXkiOiJhcGlLZXkxIiwic3BvbnNvcktleSI6InNwb25zb3IxX2tleSIsImNsaWVudEtleSI6ImNsaWVudDFfa2V5IiwidXNlcklkIjoidXNlcjEiLCJ1c2VyTmFtZSI6InVzZXIiLCJmdWxsTmFtZSI6IlVzZXIgT25lIiwiZW1haWwiOiJ1c2VyMUBuby1lbWFpbC5jb20iLCJwaG90b1VybCI6IiIsImlhdCI6MTQ4NDE3MzE3OSwiZXhwIjoxNTE0NzIxNTk5LCJyb2xlcyI6W119.pJ44T8EKELkI9lsqWzdiynUpgyHf94oKPpvkLgucgGg';
const EXPIRED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJTUDEiLCJhcGlLZXkiOiJhcGlLZXkxIiwic3BvbnNvcktleSI6InNwb25zb3IxX2tleSIsImNsaWVudEtleSI6ImNsaWVudDFfa2V5IiwidXNlcklkIjoidXNlcjEiLCJ1c2VyTmFtZSI6InVzZXIiLCJmdWxsTmFtZSI6IlVzZXIgT25lIiwiZW1haWwiOiJ1c2VyMUBuby1lbWFpbC5jb20iLCJwaG90b1VybCI6IiIsImlhdCI6MTQ4NDE3MzE3OSwiZXhwIjoxNDg1MTczMTc5LCJyb2xlcyI6W119.fWvfMjvsxPu77sLcIrd1bdpeQlfCPOrzGLF-dhJkpo8';

module.exports = {
    DocumentClient: require('./mock_DocumentClient'),
    Seneca: require('./mock_Seneca'),
    getDynamoData: () => { return require('./mock_DynamoData.json') },
    tokens: {
        valid: VALID_TOKEN,
        expired: EXPIRED_TOKEN
    }
}


