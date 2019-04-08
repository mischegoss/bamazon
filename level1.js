
/* Requiring Inquirer and MySql and Setting Up Connection */
var inquirer = require('inquirer');
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

function askQuestion() {
inquirer.prompt([
	{
	type: 'input',
	            name: 'item_id',
	            message: 'Please enter the Item ID which you would like to purchase.'

	}
]).then (function(input)) {
	var selectedid = input.item_id;
	var queryone= 'SELECT * FROM products WHERE ?';
	connection.query(queryone, {item_id: selectedid}, function(error, response) {
		if (error) throw error;
		if (response.length === 0) {
		console.log('Oh no! That didn\'t work. Please selet a valid Product ID');

		} else {
			console.log(selectedid)
			askQuestionTwo()
		}

	})
	
}
}

function askQuestionTwo() {
	console.log('New Question Coming');
}


askQuestion()
