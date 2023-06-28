const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold } = require("discord.js");
const { embed_colors } = require("../../config.json");

module.exports = (content) => {
    return {
        content: bold("Podsumowanie tygodnia:"),
        embeds: [
            new EmbedBuilder()
            .setColor(embed_colors.info)
            .setDescription(content)
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("summary_button")
                .setLabel("Podsumuj tydzień")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("📈")
            )
        ]
    }
}; 