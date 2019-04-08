/* THIS IS BROKEN! Here is where I got as of Sunday night  but I am still  working! 
 * I submitted this to show I am still working but I am not done and will keep  pushing
  * to GitHub until I get working code.
  * This code includes patches from other people's code as well!
  * Sorry for the delay. I am trying to get it done!*/
  
var mysql = require("mysql");
 var inquirer = require("inquirer");
 var Table = require("cli-table");
 
 var connection = mysql.createConnection({
	 host:"localhost",
	 port:3306,
	 user:"root",
	 password:"password",
	 database:"bamazon"
 });
 
 connection.connect(function(err){
	 if(err)throw err;
	 console.log("connected as id" + connection.threadId);
 });
 
function displayProducts() {
	 var query = "Select * FROM products";
	 connection.query(query, function(error, results){
		 if(error) throw error;
		 var displayTable = new Table ({
			 head: ["Unique ID", "Product Name", "Department", "Price", "Quantity in Stock"],
			 colWidths: [10,25,25,10,10]
		 });
		 for(var i = 0; i < results.length; i++){
			 displayTable.push(
				 [results[i].item_id,
				 results[i].product_name,
				  results[i].department_name, 
				  results[i].price,
				  results[i].stock_quantity]
				 );
		 }
		 console.log(displayTable.toString());
		 purchasePrompt();
	 });
 }
 
 function purchasePrompt(){
	 inquirer.prompt([
	 {
		 name: "promptid",
		 type: "input",
		 message:"Please enter Item ID you like to purchase.",
		 filter:Number
	 },
	 {
		 name:"quantity",
		 type:"input",
		 message:"How many items do you wish to purchase?",
		 filter:Number
	 },
 
  ]).then(function(answers){
	  var resquantity = answers.quantity;
	  var respromptid = answers.promptid;
	  purchaseOrder(resquantity, respromptid);
  });
 };

 function purchaseOrder(promptid, quantity){

	var queryStr = 'SELECT * FROM products WHERE ?';
	connection.query(queryStr, {item_id: promptid}, function(err,res){
		if(err){console.log(err)};
		if(quantity <= res[0].stock_quantity){
			var totalCost = res[0].price * quantity;
			console.log("Good news your order is in stock!");
			console.log("Your total cost for " + quantity + " " +res[0].product_name + " is " + totalCost + " Thank you!");

			

			/*connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amtNeeded + "WHERE item_id = " + ID);*/
		} else{
			console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "to complete your order.");
		};
		displayProducts();
	});
};

displayProducts();