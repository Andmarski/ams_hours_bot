const { deleteFromDutyButton, changeOptionSelectMenu } = require("../../../source/components");
const { options, colors: { yellow, green, blue } } = require("../../../source/basic");
const { defaultLog, status } = require("../../../source/messages");
const { connection } = require("../../../database");
const { messages, channels, options: config_options, duty_role, minus_years } = require("../../../config.json");
const moment = require("moment");

module.exports = async (client, interaction) => {
    interaction.deferUpdate();
    const formated_options = options(interaction.values[0], interaction.values.length > 1 ? interaction.values[1] : null);
    const components = [changeOptionSelectMenu(interaction.member.id, `(${formated_options}) ${config_options[interaction.values[0]].label}`), deleteFromDutyButton(interaction.member.id)];

    const [user_thread_id] = await connection.execute("SELECT thread_id FROM users WHERE discord_id = ?", [interaction.member.id]);
    const thread = await interaction.guild.channels.cache.get(channels.threads).threads.fetch(user_thread_id[0].thread_id);
    const thread_starter_message = await thread.fetchStarterMessage();
    await thread_starter_message.edit({ components: components });

    const [if_user_is_on_duty] = await connection.execute("SELECT * FROM on_duty WHERE discord_id = ?", [interaction.member.id]);
    if(if_user_is_on_duty.length == 0) {
        const now = moment().format("HH:mm:ss DD.MM.YYYYr.");
        
        const log_message = await thread.send(defaultLog(moment(now, "HH:mm:ss DD.MM.YYYYr.").subtract(minus_years, "year").format("HH:mm:ss DD.MM.YYYYr."), formated_options));

        Promise.all([
            connection.execute("INSERT INTO logs (message_id, discord_id, entry) VALUES (?, ?, ?)", [log_message.id, interaction.member.id, now]),
            connection.execute("INSERT INTO on_duty (discord_id, first_zone, second_zone) VALUES (?, ?, ?)", [interaction.member.id, ...(interaction.values.length == 1) ? [interaction.values[0], null] : (config_options[interaction.values[0]].special == true) ? [interaction.values[0], null] : (config_options[interaction.values[1]].special == true) ? [interaction.values[1], null] : [interaction.values[0], interaction.values[1]]])
        ]);

        thread_starter_message.edit({ components: components });
        if(duty_role) interaction.member.roles.add(duty_role);

        console.log(`Użytkownik ${yellow(interaction.user.tag)} ${green("wszedł")} na służbę.`);
    } else {
        connection.execute("UPDATE on_duty SET first_zone = ?, second_zone = ? WHERE discord_id = ?", [...(interaction.values.length == 1) ? [interaction.values[0], null] : (config_options[interaction.values[0]].special == true) ? [interaction.values[0], null] : (config_options[interaction.values[1]].special == true) ? [interaction.values[1], null] : [interaction.values[0], interaction.values[1]], interaction.member.id]);

        console.log(`Zmieniono strefy użytkownika ${yellow(interaction.user.tag)} na ${blue(`${interaction.values[0]}${interaction.values.length == 2 ? `,${interaction.values[1]}` : ""}.`)}`);
    }

    const status_message = await interaction.guild.channels.cache.get(channels.duty_status).messages.fetch(messages.duty_status);
    status_message.edit(await status());  
};