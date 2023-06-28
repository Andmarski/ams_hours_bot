const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require("./config.json");

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
]});

["event_handler", "command_handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(token);