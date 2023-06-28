const { board_roles, channels, options: config_options, messages } = require("../../../config.json");
const { hasRole, colors: { red, yellow, blue }, options } = require("../../../source/basic");
const { sendErrorEmbed } = require("../../../source/embeds");
const { bold } = require("discord.js");
const { deleteFromDutyButton, changeOptionSelectMenu } = require("../../../source/components");
const { connection } = require("../../../database");
const { status } = require("../../../source/messages");

module.exports = async (client, interaction, member_id) => {
    interaction.deferUpdate();

    if(!hasRole(interaction.member, board_roles).has_role) {
        console.log(`Użytkownik ${red("nie posiada")} roli zarządu.`);
        sendErrorEmbed(interaction, `${bold("Nie masz")} odpowiednich uprawnień!`);
        return;
    }

    const [user] = await connection.execute("SELECT * FROM users WHERE discord_id = ?", [member_id]);
    const thread = await interaction.guild.channels.cache.get(channels.threads).threads.fetch(user[0].thread_id)
    const thread_starter_message = await thread.fetchStarterMessage();
    const member = await interaction.guild.members.fetch(user[0].discord_id);

    await connection.execute("UPDATE on_duty SET first_zone = ?, second_zone = ? WHERE discord_id = ?", [...(interaction.values.length == 1) ? [interaction.values[0], null] : (config_options[interaction.values[0]].special == true) ? [interaction.values[0], null] : (config_options[interaction.values[1]].special == true) ? [interaction.values[1], null] : [interaction.values[0], interaction.values[1]], member_id]);
    
    thread_starter_message.edit({components: [changeOptionSelectMenu(member_id, `(${options(interaction.values[0], interaction.values.length > 1 ? interaction.values[1] : null)}) ${interaction.values.length == 1 ? config_options[interaction.values[0]].label : config_options[interaction.values[1]].special ? config_options[interaction.values[1]].label : config_options[interaction.values[0]].label}`), deleteFromDutyButton(member_id)]});
    
    const status_message = await interaction.guild.channels.cache.get(channels.duty_status).messages.fetch(messages.duty_status);
    status_message.edit(await status());

    console.log(`Zmieniono strefy użytkownika ${yellow(member.user.tag)} na ${blue(`${interaction.values[0]}${interaction.values.length > 1 ? `,${interaction.values[1]}` : ""}`)}.`);
};