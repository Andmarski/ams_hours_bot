const { norms, embed_colors } = require("../../config.json");

module.exports = (sum) => {
    if (sum < norms.norm * 60 * 60) return embed_colors.no_norm;
    else if (sum < norms.bonus * 60 * 60) return embed_colors.norm;
    else return embed_colors.bonus;
};