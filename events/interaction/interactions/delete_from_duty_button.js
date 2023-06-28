const { board_roles, duty_role, channels, cast_roles, messages, minus_years } = require("../../../config.json");
const { hasRole, colors: { red, yellow }, countDurations, duration, options } = require("../../../source/basic");
const { sendErrorEmbed } = require("../../../source/embeds");
const { bold, codeBlock } = require("discord.js");
const { editLogButton, threadSummaryEmbed, userSummaryEmbed }= require("../../../source/components");
const { connection } = require("../../../database");
const { status } = require("../../../source/messages");
const { countHours } = require("../../../source/elements");
const moment = require("moment");

module.exports = async (client, interaction, member_id) => {
    if(!hasRole(interaction.member, board_roles).has_role) {
        console.log("Użytkownik nie posiada roli zarządu.");
        sendErrorEmbed(interaction, `${bold("Nie masz")} odpowiednich uprawnień!`);
        return;
    }

    const [log_to_update] = await connection.execute("SELECT * FROM logs INNER JOIN on_duty ON logs.discord_id = on_duty.discord_id INNER JOIN users ON logs.discord_id = users.discord_id WHERE logs.discord_id = ? ORDER BY message_id DESC LIMIT 1", [member_id]);
    const now = moment().format("HH:mm:ss DD.MM.YYYYr.");
    const entry = moment(log_to_update[0].entry, "HH:mm:ss DD.MM.YYYYr.");
    const exit = moment(now, "HH:mm:ss DD.MM.YYYYr.");
    const { before, after } = countDurations(entry, exit);

    await Promise.all([
        connection.execute("UPDATE logs SET `exit` = ?, `before` = ?, after = ? WHERE message_id = ?", [now, before, after, log_to_update[0].message_id]),
        connection.execute("DELETE FROM on_duty WHERE discord_id = ?", [member_id])
    ]);

    const values = await countHours(interaction.member.id), duty_duration = duration(moment.duration(before + after, "second"));
    const user = await interaction.guild.members.fetch(member_id);

    user.user.send({ content: bold("Czas służby:"), embeds: [userSummaryEmbed(duty_duration, values, true)] }).then(() => {
        interaction.deferUpdate();
    }).catch(() => {
        interaction.deferUpdate();
    });
    
    const thread = await interaction.guild.channels.cache.get(channels.threads).threads.fetch(log_to_update[0].thread_id);
    const log_message = await thread.messages.fetch(log_to_update[0].message_id)
    log_message.edit({ content: codeBlock(`Wejście: ${moment(entry.subtract(minus_years, "year")).format("HH:mm:ss DD.MM.YYYYr.")}\nZejście: ${moment(exit.subtract(minus_years, "year")).format("HH:mm:ss DD.MM.YYYYr.")}\nCzas na służbie: ${duration(moment.duration(before + after, "second"))}\nMiejsce pełnienia służby: ${options(log_to_update[0].first_zone, log_to_update[0].second_zone)}`), components: [editLogButton(false)] });
    
    const thread_starter_message = await thread.fetchStarterMessage();
    thread_starter_message.edit({ embeds: [threadSummaryEmbed(cast_roles[hasRole(user, cast_roles).index_of_role], values)], components: [] });
    
    if(duty_role) user.roles.remove(duty_role);

    console.log(`${red("Usunięto")} użytkownika ${yellow(user.user.tag)} ze szłużby.`);

    const status_message = await interaction.guild.channels.cache.get(channels.duty_status).messages.fetch(messages.duty_status);
    status_message.edit(await status());
};