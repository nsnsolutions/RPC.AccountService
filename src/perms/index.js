"use strict";

const ex = require("../rpc-protocol/exceptions");
const allperms = require("./perms.json");

module.exports = function Permissions(opts) {

    const seneca = this;
    const authority = seneca.pin("role:account,ver:v1,cmd:*");

    seneca.rpc.add("role:account,ver:v1,cmd:getPermissions", getPerms_v1);

    seneca.log.debug({ msg: `${module.exports.name} loaded`, opts });
    return { name: module.exports.name };

    // ------------------------------------------------------------------------

    async function getPerms_v1(args) {

        if (!args.functionalGroups) {
            throw new ex.BadRequest("Missing required field 'functionalGroups'");

        } else if (!(args.functionalGroups.length > -1)) {
            throw new ex.BadRequest("Wrong type for required field 'functionalGroups'. Expected String[]");

        }

        var perms = [];

        const claim = await authority.getAuthorityFromToken({ 
            type: args.type,
            token: args.token,
        });

        for (let group of args.functionalGroups) {

            const levelSet = allperms[group];
            const limit = findMaxLevel(group, claim.roles);

            for (let set of levelSet) {
                if (set.level <= limit) {
                    perms = perms.concat(set.perms);
                }
            }
        }

        return perms;
    }

    function findMaxLevel(group, roles) {
        let ret;
        for (let role of roles) {
            const access = splitAuthority(role);
            if (group === access.group) {
                ret = Math.max(ret || 0, access.level);
            }
        }
        return ret;
    }

    function splitAuthority(role) {
        const parts = role.split(":");
        return {
            group: parts[0] || "NONE",
            level: parts[1] || 0,
        };
    }
};
