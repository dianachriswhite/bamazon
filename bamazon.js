
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "root",
	database: "bamazon"
})

connection.connect(function(err){
	if (err) throw err;
	console.log("connection works");
	showdata();

})

var showdata = function(){
	connection.query("SELECT * FROM products", function(err,res){
		for(var i=0; i<res.length;i++){
			console.log(res[i].itemid + "  "+res[i].productname+ "  "
			+res[i].departmentname+" "+res[i].price+" "+res[i].stockquantity
			+"  ");
		}
	askQuestions(res);
	})
}

var askQuestions = function(res){
	inquirer.prompt([{
		type: 'input',
		name: 'choice',
		message: "What do you want to buy?"

	}]).then(function(answer){
		var correct = false;
		for(var i = 0; i<res.length; i++){
			if(res[i].productname==answer.choice){
				correct=true;
				var product = answer.choice;
				var id = i;
				inquirer.prompt({
					type: 'input',
					name: 'quant',
					message: "How many?"
					validate: function(value){
						if(isNaN(value)==false){
							return true;

						}	else{
							return false;
						}
					}
				}).then(function(answer){
					if((res[id].stockquantity-answer.quant)>0){
						connection.query("UPDATE products SET stockquantity=
							'"+(res[id].stockquantity-answer.quant)+"' WHERE productname='"
							+product+"'",function(err,res2){
								console.log("Purchased");
								showdata();

							})
					} else{ 
						console.log("Not enough");
						askQuestions(res);
					}
				})
			}

			
			
		}
	})
}

