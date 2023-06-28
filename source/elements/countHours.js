const { connection } = require("../../database");
const moment = require("moment");

module.exports = async (member_id) => {
    const [all_user_logs] = await connection.execute("SELECT * FROM logs WHERE discord_id = ? ORDER BY message_id ASC", [member_id]);
    const values = [0, 0, 0, 0, 0, 0, 0];
    for(var i = 0; i < all_user_logs.length; i++) {
        const log = all_user_logs[i];
        const entry = moment(log.entry, "HH:mm:ss DD.MM.YYYYr.");
        const exit = moment(log.exit, "HH:mm:ss DD.MM.YYYYr.");

        if(exit.isSame(entry, "day")) { //can go over 24h!
            values[entry.day()] += log.before + log.correction; 
        } else if(exit.isAfter(entry, "day")) {    
            const diffrence = log.after + log.correction;
            if(diffrence > 0) {
                values[entry.day()] += log.before;
                values[exit.day()] += diffrence;
            } else {
                values[entry.day()] += log.before + diffrence;
            }
        }
    }
    return values;
};