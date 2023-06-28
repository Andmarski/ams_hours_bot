const { options } = require("../../config.json");

module.exports = () => {
    const all_options = [];
    for(var i = 0; i < options.length; i++) {
        all_options.push({
            label: `${options[i].emoji} ${options[i].label}`,
            value: i.toString()
        });
    }
    return all_options;
}