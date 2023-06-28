const { embed_colors, error_headers } = require("../../config.json");
const { EmbedBuilder } = require("discord.js");
const { random, emoji } = require("../basic");

module.exports = (interaction, content) => {
    const error_embed = new EmbedBuilder()
    .setColor(embed_colors.error)
    .setDescription(`${emoji('🛑')} ${content}`);

    interaction.reply({content: error_headers[random(0, error_headers.length - 1)], embeds: [error_embed], ephemeral: true })
}; 