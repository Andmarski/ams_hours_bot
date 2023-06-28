const { options } = require("../../config.json");

module.exports = (first, second) => {
    if(second == null) return options[first].emoji;
    else if(options[first].emoji == options[second].emoji) return options[first].emoji;
    else if(options[first].special) return options[first].emoji;
    else if(options[second].special) return options[second].emoji;
    else return `${options[first].emoji}${options[second].emoji}`;
};