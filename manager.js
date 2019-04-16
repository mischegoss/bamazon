/*Basic Manager done */

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
/* Initial Prompt */
function firstPrompt() {

    inquirer.prompt([{

        type: "list",
        name: "choices",
        message: "Pick an option",
        choices: ["View Inventory", 
        "View Low Inventory", 
        "Add Stock", 
        "Add New Product",
        "Exit"
    ]

    }]).then(function(answers) {
            var pick = answers.choices;
            console.log(pick)

            switch(pick) {
                case "View Inventory":
                  makeTable();
                  break;
                
                case "View Low Inventory":
                  lowStock();
                  break;

                case "Add Stock":
                   addStock();
                  break;

                case "Add New Product":
                  newItem();
                  break;
                
                default:
                  console.log("Something went wrong.")
              }

            })};

/* View Table */


/* Make Table function */
            function makeTable() {
                var queryfortable = "Select * FROM products";
                connection.query(queryfortable, function(error, results){
                    if(error) throw error;
                    var tableMaker = new Table ({
                        head: ["ID", "Product Name", "Department", "Price", "Stock"],
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
                    firstPrompt()
                })
            }
/* Low stock function */
            function lowStock() {
                var queryfortable = "Select * FROM products WHERE stock_quantity < 5";
                connection.query(queryfortable, function(error, results){
                    if(error) throw error;
                    var tableMaker = new Table ({
                        head: ["ID", "Product Name", "Department", "Price", "Stock"],
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
                    firstPrompt()
                });
            }
/* Add stock function */
            function addStock() {

                inquirer.prompt([{
            
                        type: "input",
                        name: "promptid",
                        message: "Enter the ID that you want to add stock to",
                    },
                    {
                        type: "input",
                        name: "quantity",
                        message: "Add the total number that you want to add to the stock",
            
                    }
                ]).then(function(answers){
                    let promptid = answers.promptid;
                    let quantity = parseInt(answers.quantity);
                    updateStock(promptid, quantity);
                });
               };
/* Update stock function (recycled from customer) */
               function updateStock(promptid, quantity){

                var queryStr = 'SELECT * FROM products WHERE ?';
            
                connection.query(queryStr, {item_id: promptid}, function(err,res){
                    if(err){console.log(err)};
                    if(quantity >= 0 ){
                       
                        var updatedStock = (parseInt(res[0].stock_quantity) + quantity);
                        var stockpromptid = parseInt(promptid);
                        console.log(updatedStock, stockpromptid)
                        confirmPrompt(updatedStock, stockpromptid)
                    
                        
                    } else{
                        console.log("Oh no, we are out of " + res[0].product_name + ".");
                    };
                    makeTable();
                });
            };
            
            function confirmPrompt(updatedStock, stockpromptid) {
            
                connection.query("UPDATE products SET ? WHERE ?", [
                    {stock_quantity: updatedStock},
                    {item_id: stockpromptid}
                    ], function(err, res){
                        if(err) throw err;
                        
                    });
                  
            }

/* Create new item function */
function newItem(){
	inquirer.prompt([

	{
		
        type: "input",
        name: "itemid",
		message: "Add ID Number"

	},	
	{
		
        type: "input",
        name: "name",
		message: "What is name of product you would like to stock?"
	},
	{
		
        type:"input",
        name:"category",
		message:"What is the department?"
	},
	{
		
        type:"input",
        name:"price",
		message:"What is the price for item?"
	},
	{
		
        type:"input",
        name:"quantity_new",
		message:"How many you would like to add?"
	},

	]).then(function(answers){
		var id = answers.itemid;
		var name = answers.name;
		var category = answers.category;
		var price = answers.price;
		var quantity = answers.quantity_new;
		buildNewItem(id,name,category,price,quantity); 
	});
  };

  function buildNewItem(id, name,category,price,quantity){
  	connection.query('INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES("' + id + '","' + name + '","' + category + '",' + price + ',' + quantity +  ')');
  	makeTable();
  };
  
  firstPrompt();
