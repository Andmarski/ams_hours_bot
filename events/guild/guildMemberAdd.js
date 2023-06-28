const { start_roles } = require('../../config.json');

module.exports = async (client, member) => {
    for(var i = 0; i < start_roles.length; i++) {
        member.roles.add(start_roles[i]);
    }
};