
/* Require Node and MySQL  */
var inquirer = require('inquirer');
var mysql = require('mysql');
const connection = require('./connection');



function promptUserPurchase() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'inputtedid',
			message: 'What item would you like to purchase? Please enter the Item Number',
        }
        
	]).then(function(input) {
		
		var item = input.inputtedid;
        var quantity = input.quantity;
        
        console.log(item)

		// Query db to confirm that the given item ID exists in the desired quantity
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, response) {
			if (err) throw err;

			if (response.length === 0) {

				connection.query('SELECT MAX(item_id) FROM products', function (err, results) {

					if(err) {
					console.error(err.stack);
					return;
					}
			
					if(results.length > 0) {
						var myresult = results[0];
						console.log(results)
					else
					{
						console.log('Crap, not');
					}
				})
			});
				
				console.log('You selected ' + item + '. That is not a valid entry. Please try again. ');

				displayInventory();


			} else {
				var productData = data[0];
				if (quantity <= productData.stock_quantity) {
					console.log('Congratulations, the product you requested is in stock! Placing order!');

					// Construct the updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					// console.log('updateQueryStr = ' + updateQueryStr);

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your order has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
					})
				} else {
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					displayInventory();
				}
			}
		})
	})
}

function displayInventory() {
	// console.log('___ENTER displayInventory___');

	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + ' // ';
			strOut += 'Stock: ' + data[i].stock_quantity + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase
	  	promptUserPurchase();
	})
}

// runBamazon will execute the main application logic
function runBamazon() {
	// console.log('___ENTER runBamazon___');

	// Display the available inventory
	displayInventory();
}

// Run the application logic
runBamazon();
