module.exports = {
    red: (text) => {
        return `\x1b[1;31m${text}\x1b[0m`;
    },
    green: (text) => {
        return `\x1b[1;32m${text}\x1b[0m`;
    },
    yellow: (text) => {
        return `\x1b[1;33m${text}\x1b[0m`;
    },
    blue: (text) => {
        return `\x1b[1;34m${text}\x1b[0m`;        
    },
    magenta: (text) => {
        return `\x1b[1;35m${text}\x1b[0m`;
    },
    cyan: (text) => {
        return `\x1b[1;36m${text}\x1b[0m`;
    }
}