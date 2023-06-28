const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold } = require("discord.js");
const { embed_colors } = require("../../config.json");
const { getDutyStatus } = require("../elements");

module.exports = async () => {
    const status = await getDutyStatus();
    return {
        content: bold("Osoby aktualnie na służbie:"),
        embeds: [
            new EmbedBuilder()
            .setColor(embed_colors.default)
            .setDescription(status)
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("duty_button")
                .setLabel("Wpis/Wypis")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("✏")
            )
        ]
    }
};