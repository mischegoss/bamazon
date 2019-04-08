/* THIS IS BROKEN! Here is where I got as of Sunday night  but I am still  working! 
 * I submitted this to show I am still working but I am not done and will keep  pushing
  * to GitHub until I get working code.
  * This code includes patches from other people's code as well!
  * Sorry for the delay. I am trying to get it done!*/

  /* Require dependencies */

 const inquirer = require('inquirer');
 const mysql = require('mysql');
 const Table = require("cli-table");
  
 /*This is the connection. Use your user and password here */
 const connection = mysql.createConnection({
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

/* The first thing displayed is a table of products. I saw others had used CLI-Table so I tried it here. */

 
function makeTable() {
	 var queryfortable = "Select * FROM products";
	 connection.query(queryfortable, function(error, results){
		 if(error) throw error;
		 var tableMaker = new Table ({
			 head: ["ID", "Product Name", "Department", "Price", "Quantity in Stock"],
			 colWidths: [10,25,20,10,20]
		 });
		 for(var i = 0; i < results.length; i++){
			 tableMaker.push(
				 [results[i].item_id,
				 results[i].product_name,
				  results[i].department_name, 
				  results[i].price,
				  results[i].stock_quantity]
				 );
		 }
		 console.log(tableMaker.toString());
		 customerPrompt();
	 });
 }

 /* This uses Inquirer to ask questions.  It does not deduct from quantity yet */ 
 
 function customerPrompt(){
	 inquirer.prompt([
	 {
		 name: "promptid",
		 type: "input",
		 message:"Please enter Item ID you like to purchase."
		 
	 },
	 {
		 name:"quantity",
		 type:"input",
		 message:"How many items do you wish to purchase?"
		 
	 },
 
  ]).then(function(answers){
	  let promptid = answers.promptid;
	  let quantity = answers.quantity;
	  makeOrder(promptid, quantity);
  });
 };

 function makeOrder(promptid, quantity){

	var queryStr = 'SELECT * FROM products WHERE ?';

	connection.query(queryStr, {item_id: promptid}, function(err,res){
		if(err){console.log(err)};
		if(quantity <= res[0].stock_quantity){
            var total = res[0].price * quantity;
            var updatedStock = (res[0].stock_quantity - quantity);
            var stockpromptid = promptid;
            console.log(updatedStock, stockpromptid)
           
			console.log("Item " + promptid + " is in stock.");
            console.log("Your total cost for " + quantity + " " +res[0].product_name + " is $" + total + " Thank you!");
            confirmPrompt(updatedStock, stockpromptid)
        
			
		} else{
			console.log("Oh no, we are out of " + res[0].product_name + ".");
		};
		makeTable();
	});
};

function confirmPrompt(updatedStock, stockpromptid) {
    var resetquery = 'UPDATE Products SET ? WHERE ?'
    console.log(updatedStock, stockpromptid)
}

makeTable();