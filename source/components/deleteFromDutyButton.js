const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = (member_id) => {
    return new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`delete_from_duty_button|${member_id}`)
        .setLabel("Usuń ze służby")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🗑️")
    )
};