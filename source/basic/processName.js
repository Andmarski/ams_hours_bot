const { username_pattern } = require("../../config.json");
const mask = new RegExp(username_pattern);

module.exports = (input) => {
    const tested_name = input.match(mask);
    if(!tested_name) return false;
    const [full_name] = tested_name;
    const [name, surname] = full_name.split(" ");
    if(!surname) return { name, surname: null }; 
    return { name, surname }; 
};