const express =require("express");
const mysql = require("mysql");
const fs =require("fs");
const bodyParser= require("body-parser");


app =new express();





app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


//Create Nysql Connection
var conn =mysql.createConnection({

	host : 'localhost',
	user : 'root',
	password : '',
	database : 'bank',
	insecureAuth : true,

});




conn.connect(function(err){

	if(err)
		console.log(err);
	else
		console.log("connect established.....")
})







// to Load HomePage
app.get('/',function(req,res){

	fs.readFile('./MainPage.html',function(error,data){

		if(error)
			res.write(error);
		else
			res.write(data);
		res.end();
	})
})




//Load Insert Data Page
app.get('/insertPage', function(req,res){
	

	fs.readFile('./InsertData.html',function(error,data){

		if(error)
			res.write(error);
		else
			res.write(data);
		res.end();
	})

	

	

})


// insert new  data in BankDetails Table.

app.post('/insertdata', function(req,res){
	


  	console.log(req.body);
	var name=req.body.name;
	var bal=req.body.balance;

	
	var sqlquery="insert into BankDetails(name,balance) values('"+name+"',"+bal+")";
	conn.query(sqlquery,function(err){

		if(err)
			throw err;
	});

	res.redirect('/');
	res.end();

})



//Display All Transaction Page 
app.get('/DisplayTransaction', function(req,res){
	

		var sqlquery1="select * from Transactions";
		
	
		conn.query(sqlquery1, (err, data)=>{
      		if(err) throw err;

      		console.log(data);

      		var table =''; //to store html table

      		//create html table with data from res.
      		for(var i=0; i<data.length; i++){
        			table +='<tr><td>'+ data[i].t_id +'</td><td>'+ data[i].u_id +'</td><td>'+ data[i].details +'</td></tr>';
      		}

      		table ='<table border="1"><tr><th>ID</th><th>User Id</th><th>Details</th></tr>'+ table +'</table>';


      		    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    			res.write(table);
    			res.end();
		})


})








//Load Page to Transfer money
app.get('/TransactionPage', function(req,res){
	

	fs.readFile('./TransactionPage.html',function(error,data){

		if(error)
			res.write(error);
		else
			res.write(data);
		res.end();
	})	

})


//Trnasfer money From One Account To Another

app.post('/TransactionData', function(req,res){
		
	//update Balance of User1



	var sqlquery1="select * from Bankdetails where id= "+req.body.id1;

	conn.query(sqlquery1 ,function(err,data1){
		if(err)
			throw err;

		var bal1=data1[0].Balance-req.body.balance;//if Bal1 has come negative then also work ,negative Balance condition has not apply yet.


		var sqlquery2="UPDATE BankDetails SET Balance="+bal1+" WHERE id="+req.body.id1;

		conn.query(sqlquery2,function(err){
			if(err)
				throw err;
		})

	})



		//update Balance of User2


	var sqlquery3="select * from Bankdetails where id= "+req.body.id2;
	conn.query(sqlquery3 ,function(err,data2){
		if(err)
			throw err;

	
		
		var bal2=parseInt(data2[0].Balance) + parseInt(req.body.balance);
		console.log(bal2);	


		var sqlquery4="UPDATE BankDetails SET Balance="+bal2+" WHERE id="+req.body.id2;

		conn.query(sqlquery4,function(err){
			if(err)
				throw err;
		})

	})


	//Add Transaction Details in Transactions Table

	var sqlquery5="insert into Transactions(u_id,Details) values("+req.body.id1+ ",'Trnasfer money "+req.body.balance+" to "+req.body.id2+"')";

		conn.query(sqlquery5,function(err){

			if(err)
				throw err;
		});


	//redirect on Home Page
	res.redirect('/');
	res.end();

})


app.listen(8080);
