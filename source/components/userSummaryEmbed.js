const { EmbedBuilder, bold, inlineCode } = require("discord.js");
const { emoji } = require("../basic");
const { getSummaryEmbedColor, getContentAndSum } = require("../elements");

module.exports = (duty_duration, values, remove = false) => {
    const { output, sum } = getContentAndSum(values);
    return new EmbedBuilder()
    .setColor(getSummaryEmbedColor(sum))
    .setDescription(`${(remove) ? `${emoji("🛑")} ${bold("Zostałeś wypisany ze służby przez zarząd!")}\n\n` : ""}${emoji("🕓")} ${bold(`Twoja służba trwała ${inlineCode(duty_duration)}\n\n${emoji("📊")} Podsumowanie tygodnia:`)}\n${output}`);
};