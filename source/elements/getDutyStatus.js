const { connection } = require("../../database");
const { options, emoji } = require("../basic");
const { options: config_options } = require("../../config.json");

module.exports = async () => {
    const [users_on_duty] = await connection.execute("SELECT * FROM on_duty ORDER BY first_zone ASC, second_zone ASC");
    if(users_on_duty.length == 0) return "Nikt aktualnie nie jest na służbie.";

    var output = "";
    for(var i = 0; i < users_on_duty.length; i++) {
        const row = users_on_duty[i];
        output += `**${emoji(`(${options(row.first_zone, row.second_zone)})`)} ${config_options[row.first_zone].label}** <@${row.discord_id}>\n`;
    }

    return output;
};