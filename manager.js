/* This  is still a work in progress. Two of the choices are working at the basic level. (I broke the Add Stock) */

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

function firstPrompt() {

    inquirer.prompt([{

        type: "list",
        name: "choices",
        message: "Pick an option",
        choices: ["View Products For Sale", 
        "View Low Inventory", 
        "Add Stock", 
        "Add New Product"]

    }]).then(function(answers) {
            var pick = answers.choices;
            console.log(pick)

            switch(pick) {
                case "View Products for Sale":
                makeTable();
                  break;
                case "View Low Inventory":
                  lowStock();
                  break;

                case "Add Stock":
                   addStock();
                  break;

                case "Add New Product":
                  console.log('Add New Product');

                default:
                  // code block
              }

            })};

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
                });
            }

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

            function addStock() {

                inquirer.prompt([{
            
                        type: "input",
                        name: "inputId",
                        message: "Enter the ID that you want to add stock to",
                    },
                    {
                        type: "input",
                        name: "inputNumber",
                        message: "Add the total number that you want to add to the stock",
            
                    }
                ]).then(function(addedstock) {

                  

            })
        }

makeTable();