const { connection } = require("../../../database");
const { duration, hasRole, colors: { red, green } } = require("../../../source/basic");
const { sendSuccesEmbed } = require("../../../source/embeds");
const { threadSummaryEmbed } = require("../../../source/components");
const { cast_roles } = require("../../../config.json");
const { countHours } = require("../../../source/elements");
const { codeBlock } = require("discord.js");
const moment = require("moment");

module.exports = async (client, interaction) => {
    var hours_to_add = interaction.fields.getTextInputValue("hours_to_add");
    if(/^-?(2[0-4]|1[0-9]|0[0-9]|[0-9]):[0-5][0-9]:[0-5][0-9]/.test(hours_to_add)) {
        const [log_to_update] = await connection.execute("SELECT * FROM logs INNER JOIN users ON logs.discord_id = users.discord_id WHERE message_id = ?", [interaction.message.id]);
        const log_message = await interaction.channel.messages.fetch(interaction.message.id);
        const emojis = log_message.content.split(" ").pop().replace("\n```", "");

        if(hours_to_add[0] == '-') {
            var hours_to_add = hours_to_add.replace("-", "");
            hours_to_add = hours_to_add.split(":");
            hours_to_add = -1 * (hours_to_add[0] * 3600 + hours_to_add[1] * 60 + hours_to_add[2] * 1);

            const log_time = (log_to_update[0].after) ? log_to_update[0].after + after_and_after[0].before : log_to_update[0].before;

            if(log_time + hours_to_add < 0) return;

            await log_message.edit(codeBlock(`Wejście: ${log_to_update[0].entry}\nZejście: ${log_to_update[0].exit}\nCzas służby: ${duration(moment.duration(log_time, "second"))} (-${duration(moment.duration(-1 * hours_to_add, "second"))})\nMiejsce pełnienia służby: ${emojis}`));

            console.log(`${red("Usunięto")} ${-1 * hours_to_add}s z logu.`);
        } else {
            var hours_to_add = hours_to_add.split(":");
            hours_to_add = hours_to_add[0] * 3600 + hours_to_add[1] * 60 + hours_to_add[2] * 1;

            const log_time = (log_to_update[0].after) ? log_to_update[0].after + after_and_after[0].before : log_to_update[0].before;

            await log_message.edit(codeBlock(`Wejście: ${log_to_update[0].entry}\nZejście: ${log_to_update[0].exit}\nCzas służby: ${duration(moment.duration(log_time, "second"))} (+${duration(moment.duration(hours_to_add, "second"))})\nMiejsce pełnienia służby: ${emojis}`));

            console.log(`${green("Dodano")} ${hours_to_add}s do logu.`);
        }

        await connection.execute("UPDATE logs SET correction = ? WHERE message_id = ?", [hours_to_add, interaction.message.id]);
        const thread_starter_message = await interaction.channel.fetchStarterMessage();
        const values = await countHours(log_to_update[0].discord_id);
        thread_starter_message.edit({ embeds: [threadSummaryEmbed(cast_roles[hasRole(interaction.guild.members.cache.get(log_to_update[0].discord_id), cast_roles).index_of_role], values)] });
        
        sendSuccesEmbed(interaction, "Pomyślnie edytowano log!");
    }
}