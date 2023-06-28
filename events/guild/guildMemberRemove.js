const { connection } = require("../../database");

module.exports = async (client, member) => {
    const [user_to_delete] = await connection.query("SELECT * FROM users WHERE discord_id= ?", [member.id]);
    
    if(user_to_delete.length > 0) {
        await connection.query("DELETE FROM users WHERE discord_id = ?", [member.id]);
        await connection.query("DELETE FROM on_duty WHERE discord_id = ?", [member.id]);
        await connection.query("DELETE FROM logs WHERE discord_id = ?", [member.id]);
        const thread = await member.guild.channels.cache.get(user_to_delete[0].thread_id);
        const thread_message = await thread.fetchStarterMessage();
        thread.delete();
        thread_message.delete();
    }
};