const fs = require("fs");

module.exports = (client) => {
    const load_dir = (dir) => {
        const event_files = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith(".js"));

        for(var i = 0; i < event_files.length; i++) {
            const event = require(`../events/${dir}/${event_files[i]}`);
            const event_name = event_files[i].split(".")[0];
            if(dir == "ready") client.once(event_name, event.bind(null, client));
            else client.on(event_name, event.bind(null, client));
        }
    }

    ["ready", "guild", "interaction"].forEach(event => load_dir(event));
};