const moment = require("moment");

module.exports = (entry, exit) => {
    var before = 0, after = 0;

    if(exit.isSame(entry, "day")) {
        before = moment.duration(exit.diff(entry)).asSeconds();
    } else if(exit.isAfter(entry, "day")) {
        const midnight = moment(`00:00:00 ${exit.format("DD.MM.YYYYr.")}`, "HH:mm:ss DD.MM.YYYYr.")
    
        before = moment.duration(midnight.diff(entry)).asSeconds();
        after = moment.duration(exit.diff(midnight)).asSeconds();
    }

    return { before, after };
};