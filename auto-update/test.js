var mysql = require('mysql');
var connection =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fd',
    database: 'ncov'
});
connection.connect();



var express = require('express');
var app = express();

app.all('*',function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/',(req,res)=>{
    res.send('Hello world');
});
app.get('/yayaya&hehe',(req,res)=>{
    console.log(req.path);
    res.json({'a':1,'b':2});
});
app.get('/nation*',(req,res)=>{
    let sql = 'select * from nation';
    connection.query(sql,(e,d)=>{
        if(e){console.log(e.sqlMessage);return;}
        res.json(d);
    });
    //res.send('heheda');
});
app.get('/province*',(req,res)=>{
    let path = req.path;
    let arg = 'provinceName=';
    let pos = path.indexOf(arg);
    let provinceName = null;
    if(pos != -1){
        provinceName = path.slice(pos+arg.length,path.length);
        console.log(decodeURI(provinceName));
        let hasArg = 'select * from province where provinceName=\''+decodeURI(provinceName)+'\'';
        console.log(hasArg);
        connection.query(hasArg,(e,d)=>{
            if(e){
                console.log(e.message);
                return;
            }
            res.json(d);
        });
    }
});
app.get('/city*',(req,res)=>{
    let path=req.path;
    let arg1 = 'provinceName=';
    let arg2 = 'cityName=';
    let pos1 = path.indexOf(arg1);
    let pos2 = path.indexOf(arg2);

    if(pos1 == -1 && pos2 == -1) return;
    if(pos1 != -1){
        let provinceName = path.slice(pos1+arg1.length,path.length);
        let arg = 'select * from city where provinceName=\''+decodeURI(provinceName)+'\'';
        console.log(arg);
        connection.query(arg,(e,d)=>{
            if(e){console.log(e.message);return;}
            res.json(d);
        });
    }else{
        let cityName = path.slice(pos2+arg2.length,path.length);
        let arg = 'select * from city where cityName=\''+decodeURI(cityName)+'\'';
        console.log(arg);
        connection.query(arg,(e,d)=>{
            if(e){console.log(e.message);return;}
            res.json(d);
        }); 
    }
});
var server = app.listen(8080,()=>{
    var host = server.address().address;
    var port = server.address().port;
    console.log(host + port);
});


