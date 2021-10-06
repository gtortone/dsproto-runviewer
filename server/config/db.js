const mysql = require('mysql')

const db = mysql.createConnection({
host: "set_your_host_here",
user: "set_your_user_here",
password: "set_your_password_here",
database:"set_your_database_here" 
})

module.exports = db;
