const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'm!92dRtkM31y',
        database: 'office'
    }
)

module.exports = db