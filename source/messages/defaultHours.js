const { EmbedBuilder, roleMention, userMention, inlineCode, bold } = require("discord.js");
const { emoji } = require("../basic");
const { embed_colors } = require("../../config.json");

module.exports = (member_id, role_id) => {
    return {
        content: bold(`Rubryczka ${userMention(member_id)}:`),
        embeds: [
            new EmbedBuilder()
            .setColor(embed_colors.no_norm)
            .setDescription(`${bold("Ranga:")} ${roleMention(role_id)}\n\n${emoji("📊")} ${bold("Podsumowanie tygodnia:")}\n${inlineCode("0:00:00")} - Niedziela\n${inlineCode("0:00:00")} - Poniedziałek\n${inlineCode("0:00:00")} - Wtorek\n${inlineCode("0:00:00")} - Środa\n${inlineCode("0:00:00")} - Czwartek\n${inlineCode("0:00:00")} - Piątek\n${inlineCode("0:00:00")} - Sobota\n\nSuma całkowita: ${inlineCode("0:00:00")}`)
        ]
    }
};