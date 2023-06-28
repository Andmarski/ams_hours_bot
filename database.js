const { database } = require("./config.json");
const mysql = require("mysql2/promise");

const connection = mysql.createPool({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`Połączono z bazą danych MySQL (${connection.pool.config.connectionConfig.database})!`);

module.exports = { connection: connection };