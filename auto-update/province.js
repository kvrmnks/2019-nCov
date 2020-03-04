var d3 = require("d3");
var fs = require("fs");
function readText(pathname) { //去除utf-8 BOM的文本文件读取
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}
var rawData = d3.csvParse(readText('Province2.csv'));

//console.log(rawData);

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fd',
    database: 'ncov'
});
connection.connect();
var sql = 'replace into province (provinceName,confirmedCount,curedCount,deadCount,updateTime,id) values (?,?,?,?,?,?)';
for(let i=0;i<rawData.length;i++){
    var arg = [];
    arg.push(rawData[i].provinceName);
    arg.push(rawData[i].confirmedCount);
    arg.push(rawData[i].curedCount);
    arg.push(rawData[i].deadCount);
    arg.push(rawData[i].updateTime);
    arg.push(rawData[i].id);
    connection.query(sql,arg,(e,d)=>{
        if(e){
            console.log(e.message);
        }
    });
}
connection.end();