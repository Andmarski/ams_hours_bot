const { codeBlock } = require("discord.js");
const { editLogButton } = require("../components");

module.exports = (now, formated_zones) => { 
    return {
        content: codeBlock(`Wejście: ${now}\nZejście: -\nCzas na służbie: -\nMiejsce pełnienia służby: ${formated_zones}`),
        components: [editLogButton(true)]
    }
};