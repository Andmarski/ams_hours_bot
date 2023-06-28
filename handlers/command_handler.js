const { token, guild_id, client_id } = require("../config.json")
const { Collection, REST, Routes } = require("discord.js");
const fs = require("fs");


module.exports = async (client) => {
    client.commands = new Collection();
    const command_files = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
    const rest = new REST({ version: "10" }).setToken(token);

    const commands = [];

    for(var i = 0; i < command_files.length; i++) {
        const command = require(`../commands/${command_files[i]}`);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.log(`Komenda ../commands/${command_files[i]} nie posiada kodu wykonywalnego lub nazwy.`);
        }
    }
 
    try {
        console.log(`Ustawianie kommend aplikacji (ilość: ${commands.length}).`);
        await rest.put(Routes.applicationCommands(client_id, guild_id), { body: commands });

        console.log(`Pomyślnie odświeżono wszystkie komendy.`);
    } catch(error) {
        console.log(error);
    }
};