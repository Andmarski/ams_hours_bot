const { ActivityType } = require('discord.js');
const { colors: { green } } = require('../../source/basic');

module.exports = (client) => {
    console.log(`${green("Zalogowano")} jako ${client.user.tag}!`);
    client.user.setActivity("karyty zatrzymanych", { type: ActivityType.Watching });
};