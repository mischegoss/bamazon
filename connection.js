/* This is the connection to MySQL. Use your username, password */
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	// Your username
	user: 'root',

	// Your password
    password: 'password',
    
    database: 'bamazon'
	
});


 