const moment = require("moment");

module.exports = (duration) => {
    const first = Math.floor(moment.duration(duration).asHours());
    const second = moment.utc(moment.duration(duration).asMilliseconds()).format("mm:ss");
    
    return `${first}:${second}`;
}