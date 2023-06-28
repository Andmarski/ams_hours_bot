const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { status, summary, debts } = require("../source/messages");
const { channels } = require("../config.json");
const { checkMessage } = require("../source/elements");
const { sendSuccesEmbed } = require("../source/embeds");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("send_messages")
    .setNameLocalization("pl", "wyślij_wiadomości")
    .setDescription("Sends all messages nessesary for the bot to work.")
    .setDescriptionLocalization("pl", "Wysyła wszystkie wiadomości potrzebne do działania bota.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(client, interaction) {
        await checkMessage(interaction, channels.duty_status, "duty_status", await status());
        await checkMessage(interaction, channels.threads, "week_summary", summary("Tu pojawi się podsumowanie tygodnia."));
        sendSuccesEmbed(interaction, "Udało się wysłać wszystkie potrzebne wiadomości!");
    }
};