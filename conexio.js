var mysql = require('mysql');
var db = require("./db.json");
var connection = mysql.createConnection({
	host: db.host,
	user: db.user,
	password: db.password,
	database: db.database
});

module.exports = { connection };