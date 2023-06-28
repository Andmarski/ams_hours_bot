const { colors: { cyan, yellow, blue, red } } = require("../../source/basic");
const moment = require("moment");
const fs = require("fs");

const scripts = fs.readdirSync("./events/interaction/interactions").filter(file => file.endsWith(".js"));
const interactions = {};

for(const script of scripts) { //can be maked faster
    const name = script.split(".")[0];
    interactions[name] = require(`./interactions/${script}`);
}

module.exports = async (client, interaction) => {
    if(interaction.isCommand()) {
        console.log(`${cyan(`[${moment().format("HH:mm:ss|DD.MM.YYYY")}]`)} ${yellow(interaction.user.tag)} -> Użytkownik użył komendy ${blue(interaction.commandName)}.`);
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(`${red("Nie znaleziono")} komendy.`);
            return;
        } 
            
        try {
            command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            sendErrorEmbed(interaction, "Wystąpił nieznany błąd przez który komenda nie wykonała się!")
        } finally {
            return;
        }
    } else {
        const interaction_data = interaction.customId.split("|");
        const interaction_custom_id = interaction_data.shift();

        if(interaction.isButton()) console.log(`${cyan(`[${moment().format("HH:mm:ss|DD.MM.YYYY")}]`)} ${yellow(interaction.user.tag)} -> Użytkownik nacisnął przycisk ${blue(interaction.customId)}.`);
        else if(interaction.isStringSelectMenu()) console.log(`${cyan(`[${moment().format("HH:mm:ss|DD.MM.YYYY")}]`)} ${yellow(interaction.user.tag)} -> Użytkownik wybrał ${blue(interaction.values)} z ${blue(interaction.customId)}.`);
        else if(interaction.isModalSubmit()) console.log(`${cyan(`[${moment().format("HH:mm:ss|DD.MM.YYYY")}]`)} ${yellow(interaction.user.tag)} -> Użytkownik przesłał modal ${blue(interaction.customId)}.`);
        
        try {
            if(interaction_data.length > 0) interactions[interaction_custom_id](client, interaction, ...interaction_data);
            else interactions[interaction_custom_id](client, interaction);
        } catch {}
    }
};