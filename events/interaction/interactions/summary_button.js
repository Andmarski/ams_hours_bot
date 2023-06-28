const { board_roles } = require("../../../config.json");
const { hasRole } = require("../../../source/basic");
const { sendErrorEmbed } = require("../../../source/embeds");
const { bold } = require("discord.js");
const { summaryConfirmationModal } = require("../../../source/components");

module.exports = async (client, interaction) => {
    if(!hasRole(interaction.member, board_roles).has_role) {
        console.log("Użytkownik nie posiada roli zarządu.");
        sendErrorEmbed(interaction, `${bold("Nie masz")} odpowiednich uprawnień!`);
        return;
    }

    interaction.showModal(summaryConfirmationModal);
    console.log(`Wystawiono modal z potwierdzeniem podsumowania tygodnia.`);
};