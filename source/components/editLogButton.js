const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = (disabled) => {
    return new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("edit_log_button")
        .setLabel("Edytuj")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📝")
        .setDisabled(disabled)
    );
};
    