const { cast_roles, guild_id, channels, duty_role, minus_years, messages } = require("../../../config.json");
const { hasRole, colors: { red, yellow }, processName, countDurations, duration, options } = require("../../../source/basic");
const { sendErrorEmbed } = require("../../../source/embeds");
const { defaultHours, optionSelect, status } = require("../../../source/messages");
const { editLogButton, threadSummaryEmbed, userSummaryEmbed }= require("../../../source/components");
const { connection } = require("../../../database");
const { inlineCode, bold, codeBlock } = require("discord.js");
const fs = require("fs");
const moment = require("moment");
const { countHours } = require("../../../source/elements");

module.exports = async (client, interaction) => {
    const { has_role, index_of_role } = hasRole(interaction.member, cast_roles);
    if(!has_role) {
        console.log(`Użytkownik ${red("nie posiada")} roli pracownika.`);
        sendErrorEmbed(interaction, `${bold("Nie masz")} odpowiednich uprawnień!`);
        return;
    }

    const display_name = processName(interaction.member.displayName);
    if(!display_name) {
        console.log(`Pseudonim użytkownika ${red("nie pasuje")} do maski.`);
        sendErrorEmbed(interaction, `Ustaw pseudonim jako ${inlineCode("imię nazwisko")} IC!`);
        return;
    }

    const { name, surname } = display_name;
    const [user_is_in_database] = await connection.execute("SELECT * FROM users WHERE discord_id = ?", [interaction.member.id]);
    
    if(user_is_in_database.length == 0) {
        console.log(`${yellow("Nie znaleziono")} użytkownika w bazie danych.`);

        const config = JSON.parse(fs.readFileSync("./config.json"));
        const threads_channel = await client.guilds.cache.get(guild_id).channels.cache.get(channels.threads);
        const week_summary_message = await threads_channel.messages.fetch(config.messages.week_summary);
        week_summary_message.delete();

        const thread_message = await threads_channel.send(defaultHours(interaction.member.id, cast_roles[index_of_role]));
        const thread = await thread_message.startThread({
            name: `${name} ${surname}`,
            autoArchiveDuration: 60,
            locked: true
        });

        await connection.execute("INSERT INTO users (discord_id, role_id, thread_id, name, surname) VALUES (?, ?, ?, ?, ?)", [interaction.member.id, cast_roles[index_of_role], thread.id, name, surname]);
        console.log("Dodano użytkownika do bazy danych.");

        const new_week_summary_message = await threads_channel.send({ content: week_summary_message.content, embeds: [...week_summary_message.embeds], components: [...week_summary_message.components] });
        config.messages.week_summary = new_week_summary_message.id;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

        interaction.reply(optionSelect(interaction.member));
    } else {
        await connection.execute("UPDATE users SET role_id = ?, name = ?, surname = ? WHERE discord_id = ?", [cast_roles[index_of_role], name, surname, interaction.member.id]);
        console.log("Zaktualizowano dane użytkonwika w bazie danych.");

        const [last_log] = await connection.execute("SELECT * FROM logs INNER JOIN on_duty ON logs.discord_id = on_duty.discord_id INNER JOIN users ON logs.discord_id = users.discord_id WHERE logs.discord_id = ? ORDER BY message_id DESC LIMIT 1;", [interaction.member.id]);
        if(last_log.length == 0 || last_log[0].exit != null) {  
            interaction.reply(optionSelect(interaction.member));
        } else {
            const now = moment().format("HH:mm:ss DD.MM.YYYYr.");
            const entry = moment(last_log[0].entry, "HH:mm:ss DD.MM.YYYYr.");
            const exit = moment(now, "HH:mm:ss DD.MM.YYYYr.");
            const { before, after } = countDurations(entry, exit);
            
            await Promise.all([
                connection.execute("UPDATE logs SET `exit` = ?, `before` = ?, after = ? WHERE message_id = ?", [now, before, after, last_log[0].message_id]),
                connection.execute("DELETE FROM on_duty WHERE discord_id = ?", [interaction.member.id])
            ]);

            const values = await countHours(interaction.member.id), duty_duration = duration(moment.duration(before + after, "second"));

            interaction.user.send({ content: bold("Czas służby:"), embeds: [userSummaryEmbed(duty_duration, values)] }).then(() => {
                interaction.deferUpdate();
            }).catch(() => {
                interaction.reply({ content: bold("Czas służby:"), embeds: [userSummaryEmbed(duty_duration, values)], ephemeral: true });
            });

            const thread = await interaction.guild.channels.cache.get(channels.threads).threads.fetch(last_log[0].thread_id);
            const log_message = await thread.messages.fetch(last_log[0].message_id);
            log_message.edit({ content: codeBlock(`Wejście: ${moment(entry.subtract(minus_years, "year")).format("HH:mm:ss DD.MM.YYYYr.")}\nZejście: ${moment(exit.subtract(minus_years, "year")).format("HH:mm:ss DD.MM.YYYYr.")}\nCzas na służbie: ${duration(moment.duration(before + after, "second"))}\nMiejsce pełnienia służby: ${options(last_log[0].first_zone, last_log[0].second_zone)}`), components: [editLogButton(false)] });

            const thread_starter_message = await thread.fetchStarterMessage();
            thread_starter_message.edit({ embeds: [threadSummaryEmbed(cast_roles[index_of_role], values)], components: [] });

            if(duty_role) interaction.member.roles.remove(duty_role);

            console.log(`Użytkownik ${yellow(interaction.user.tag)} ${red("zszedł")} ze szłużby.`);

            const status_message = await interaction.guild.channels.cache.get(channels.duty_status).messages.fetch(messages.duty_status);
            status_message.edit(await status()); 
        }
    } 
};