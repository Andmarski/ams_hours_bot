const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("discord.js");
module.exports = new ModalBuilder()
.setCustomId("edit_log_modal")
.setTitle("Podsumowanie tygodnia")
.addComponents(
    new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
        .setCustomId("hours_to_add")
        .setLabel("Ilość godzin do dodania/usunięcia")
        .setRequired(true)
        .setMinLength(7)
        .setMaxLength(9)
        .setPlaceholder("np. 10:20:30 lub -0:45:00")
        .setStyle(1)
    )
);
