const { bold, inlineCode } = require("discord.js");
const moment = require("moment");
const { duration } = require("../basic");
const days_names = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

module.exports = (values) => {
    var output = "", sum = 0;

    for(var i = 0; i < 7; i++) {
        output += `${inlineCode(duration(moment.duration(values[i], "second")))} - ${days_names[i]}\n`;
        sum += values[i];
    }
    output += `\n${bold(`Suma całkowita: ${inlineCode(duration(moment.duration(sum, "second")))}`)}`;

    return { output, sum };
};


