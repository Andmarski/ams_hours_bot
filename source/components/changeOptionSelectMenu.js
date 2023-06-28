const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { getSelectOptions } = require("../basic");

module.exports = (member_id, pleaceholder) => {
    return new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId(`change_option_select_menu|${member_id}`)
        .setPlaceholder(pleaceholder)
        .setMinValues(1)
        .setMaxValues(2)
        .addOptions(getSelectOptions())
    );
};