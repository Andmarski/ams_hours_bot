const fs = require("fs");

const scripts = fs.readdirSync("./source/elements/").filter(file => file.endsWith(".js"));
const payload = {};

for(var i = 0; i < scripts.length; i++) {
    const name = scripts[i].split(".")[0];
    payload[name] = require(`./elements/${scripts[i]}`);
}

module.exports = payload;