const { bold } = require("discord.js");
const { sendErrorEmbed } = require("../../../source/embeds");
const { board_roles } = require("../../../config.json");
const { hasRole, colors: { red } } = require("../../../source/basic");
const { editLogModal } = require("../../../source/components");

module.exports = async (client, interaction) => {
    if(!hasRole(interaction.member, board_roles).has_role) { 
        console.log(`Użytkownik ${red("nie posiada")} roli zarządu.`);
        sendErrorEmbed(Discord, interaction, `${bold("Nie masz")} odpowiednich uprawnień!`);
        return;
    }
    
    interaction.showModal(editLogModal);
};