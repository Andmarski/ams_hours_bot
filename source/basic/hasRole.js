module.exports = (member, roles) => {
    var has_role = false;

    for(var i = 0; i < roles.length; i++) {
        if(member.roles.cache.has(roles[i])) {
            has_role = true;
            break; 
        }
    }

    return { has_role: has_role, index_of_role: i };
}