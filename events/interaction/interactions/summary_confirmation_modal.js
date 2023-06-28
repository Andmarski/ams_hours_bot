const { connection } = require("../../../database");
const { sendErrorEmbed, sendSuccesEmbed } = require("../../../source/embeds");
const { emoji, duration, countDurations } = require("../../../source/basic")
const { userMention, bold, codeBlock, inlineCode} = require("discord.js");
const { summary } = require("../../../source/messages");
const { channels, minus_years, norms, messages } = require("../../../config.json");
const { defaultLog, defaultHours } = require("../../../source/messages");
const moment = require("moment");

module.exports = async (client, interaction) => {
    const confirm = interaction.fields.getTextInputValue("confirm");

    if(confirm != "potwierdź") {
        console.log("Błędnie wpisano potwierdzenie!");
        sendErrorEmbed(interaction, `${bold("Błędnie")} wpisano potwierdzenie!`);
        return;
    }    
	sendSuccesEmbed(interaction, `${bold("Tydzień został podsumowany!")} Poczekaj, aż discord odświeży wiadomości!`);

    const [all_logs] = await connection.execute("SELECT * FROM logs INNER JOIN users ON users.discord_id = logs.discord_id");
    if(all_logs.length == 0) return;
           
    const [all_users_on_duty] = await connection.execute("SELECT * FROM users WHERE discord_id IN (SELECT discord_id FROM on_duty)");

    for(var i = all_users_on_duty.length - 1; i >= 0; i--) {
        const [log_to_update] = await connection.execute("SELECT * FROM logs WHERE discord_id = ? ORDER BY message_id DESC LIMIT 1", [all_users_on_duty[i].discord_id]);

        const now = moment().format("HH:mm:ss DD.MM.YYYYr.");
        const entry = moment(log_to_update[0].entry, "HH:mm:ss DD.MM.YYYYr.");
        const exit = moment(now, "HH:mm:ss DD.MM.YYYYr.");
        const { before, after } = countDurations(entry, exit);

        await connection.execute("UPDATE logs SET `exit` = ?, `before` = ?, after = ? WHERE message_id = ?", [now, before, after, log_to_update[0].message_id]);

        const thread = await interaction.guild.channels.cache.get(channels.threads).threads.fetch(all_users_on_duty[i].thread_id);
        const last_log_message = await thread.messages.fetch(log_to_update[0].message_id);
        last_log_message.edit({ content: codeBlock(`Wejście: ${moment(entry.subtract(minus_years, "year")).format("HH:mm:ss DD.MM.YYYYr.")}\nZejście: ${moment(exit.subtract(minus_years, "years")).format("HH:mm:ss DD.MM.YYYYr.")}\nCzas na służbie: ${duration(moment.duration(before + after, "second"))}\nMiejsce pełnienia słuzby: ❔`) });
    }
    
    const [users_total_sums] = await connection.execute("SELECT users.*, SUM(`before` + `after` + COALESCE(`correction`, 0)) AS `sum` FROM logs INNER JOIN users ON users.discord_id = logs.discord_id GROUP BY users.discord_id");
    const threads_channel = await interaction.guild.channels.cache.get(channels.threads);

    var description = "";

    for(var i = users_total_sums.length - 1; i >= 0; i--) {
        const user = users_total_sums[i];
        const duration_format_from_sum = duration(moment.duration(user.sum, "second"));
        const summary_emoji = (user.sum < norms.norm * 60 * 60) ? "🔴" : (user.sum < norms.bonus * 60 * 60) ? "🟢" : "🟡";

        try {
            const thread = await threads_channel.threads.fetch(user.thread_id);
            thread.send({content: codeBlock(`Podsumowanie tygodnia: ${summary_emoji} ${duration_format_from_sum}`)});

            const message = await thread.fetchStarterMessage();
            message.edit(defaultHours(user.discord_id, user.role_id));
        } catch {}

        description += `${emoji(summary_emoji)} ${userMention(user.discord_id)} - ${inlineCode(duration_format_from_sum)}\n`;
    }

    const summary_message = await threads_channel.messages.fetch(messages.week_summary);
    summary_message.edit(summary(description));

    await connection.execute("TRUNCATE logs;");
    var promise_table = [];

    for(var i = all_users_on_duty.length - 1; i >= 0; i--) {
        const now = moment().format("HH:mm:ss DD.MM.YYYYr.");
        try {
            const thread = await threads_channel.threads.fetch(all_users_on_duty[i].thread_id);
            const log_message = await thread.send(defaultLog(now, "❔"));
            promise_table.push(connection.execute("INSERT INTO logs (message_id, discord_id, entry) VALUES (?, ?, ?)", [log_message.id, all_users_on_duty[i].discord_id, now]));
        } catch {}
    }

    await Promise.all(promise_table);
            
    for(var i = all_logs.length - 1; i >= 0; i--) {
        try {
            const thread = await threads_channel.threads.fetch(all_logs[i].thread_id);
            const log_message = await thread.messages.fetch(all_logs[i].message_id);
            log_message.edit({ content: log_message.content, components: [] });
        } catch {}
    }
    
    console.log("Wystwiono podsumowanie tygodnia.");
};
