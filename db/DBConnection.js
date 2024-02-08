const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'jwt'
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connect error", err);
        return;
    }
    console.log("MySQL connected successfully");
});

module.exports = db;
