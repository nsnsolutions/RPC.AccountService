'use strict';

const _ = require('lodash');

module.exports = function(o) {

    var authority = _.cloneDeep(o.claim);

    // Append sponsor details.
    authority.sponsorId = o.sponsorRecord.id;
    authority.sponsorName = o.sponsorRecord.name;

    // Append client details.
    authority.clientId = o.clientRecord.id;
    authority.clientName = o.clientRecord.name;
    authority.clientPhoneNumber = o.clientRecord.phoneNumber;
    authority.clientAddress = {
        singleLine: o.clientRecord.addressSingleLine,
        line1: o.clientRecord.addressLine1,
        line2: o.clientRecord.addressLine2 || "",
        city: o.clientRecord.addressCity,
        state: o.clientRecord.addressState,
        zip: o.clientRecord.addressZip
    };

    return authority;
};
