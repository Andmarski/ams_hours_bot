const fs = require("fs");
const { colors: { green } } = require("../basic");

module.exports = (interaction, channel, message_name, message_body) => {
    const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
    const message_channel = interaction.guild.channels.cache.get(channel);
    message_channel.messages.fetch(config.messages[message_name])
    .then(() => {console.log(`Wiadomość ${green("została")} znaleziona!`)})
    .catch(() => {
        message_channel.send(message_body).then(message => {
            config.messages[message_name] = message.id;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
            console.log("Utworzono nową wiadomość i zapisano jej id do configu.");
        }); 
    });
};