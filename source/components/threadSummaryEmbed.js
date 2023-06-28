const { EmbedBuilder, bold, roleMention } = require("discord.js");
const { getSummaryEmbedColor, getContentAndSum  } = require("../elements");
const { emoji } = require("../basic");

module.exports = (role_id, values) => {
    const { output, sum } = getContentAndSum(values);
    return new EmbedBuilder()
    .setColor(getSummaryEmbedColor(sum))
    .setDescription(`${bold("Ranga:")} ${roleMention(role_id)}\n\n${emoji("📊")} ${bold("Podsumowanie tygodnia:")}\n${output}`);
};