const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("discord.js");

module.exports = new ModalBuilder()
.setCustomId("summary_confirmation_modal")
.setTitle("Podsumowanie tygodnia")
.addComponents(
    new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
        .setCustomId("confirm")
        .setLabel("Potwierdzenie")
        .setRequired(true)
        .setMinLength(9)
        .setMaxLength(9)
        .setPlaceholder("Wpisz \"potwierdź\" aby podsumować")
        .setStyle(1)
    )
);