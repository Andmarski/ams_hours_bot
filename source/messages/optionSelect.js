const { board_roles, special_roles, is_detour } = require("../../config.json");
const permitted_roles = [...board_roles, ...special_roles];
const { hasRole, getSelectOptions } = require("../basic");
const { StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = (member) => {
    const all_zones = getSelectOptions();
    if(!hasRole(member, permitted_roles).has_role && is_detour) all_zones.pop();

    return {
        ephemeral: true,
        components: [
            new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("option_select_menu")
                .setPlaceholder("Wybierz region")
                .setMinValues(1)
                .setMaxValues(2)
                .addOptions(all_zones)
            )
        ]
    }
};