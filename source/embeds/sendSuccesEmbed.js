const { embed_colors, succes_headers } = require("../../config.json");
const { EmbedBuilder } = require("discord.js");
const { random, emoji } = require("../basic");

module.exports = (interaction, content) => {
    const error_embed = new EmbedBuilder()
    .setColor(embed_colors.succes)
    .setDescription(`${emoji('👌')} ${content}`);

    interaction.reply({content: succes_headers[random(0, succes_headers.length - 1)], embeds: [error_embed], ephemeral: true })
}; 