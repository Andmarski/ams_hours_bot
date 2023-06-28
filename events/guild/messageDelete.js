const { channels } = require("../../config.json");
const { connection } = require("../../database");

module.exports = async (client, message) => {
    if(message.channel.id == channels.threads) {
        if(message.hasThread) {
            const [user_to_delete] = await connection.query("SELECT * FROM users WHERE thread_id = ?", [message.thread.id]);
            if(user_to_delete.length > 0) {
                await connection.query("DELETE FROM users WHERE discord_id = ?", [user_to_delete[0].discord_id]);
                await connection.query("DELETE FROM on_duty WHERE discord_id = ?", [user_to_delete[0].discord_id]);
                await connection.query("DELETE FROM logs WHERE discord_id = ?", [user_to_delete[0].discord_id]);
                message.thread.delete();
            }
        }
    }
};