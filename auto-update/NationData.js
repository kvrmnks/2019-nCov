var d3 = require("d3");
var fs = require("fs");
//console.log(data.toString());
/*
const parse = require('csv-parse/lib/sync');
const records = parse(data, {
    columns: true,
    skip_empty_lines: true
  })
  
console.log(records);
*/
function readText(pathname) { //去除utf-8 BOM的文本文件读取
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}
var rawData = d3.csvParse(readText('DXYOverall.csv'));
var tret = [];
for(let i in rawData){
    //console.log(rawData[i]);
    if(typeof(rawData[i].updateTime) == 'undefined')continue;
    //console.log(tmp);
    var tmp = {
        confirmedCount: parseInt(rawData[i].confirmedCount),
        suspectedCount: parseInt(rawData[i].suspectedCount),
        curedCount: parseInt(rawData[i].curedCount),
        deadCount: parseInt(rawData[i].deadCount),
        seriousCount: parseInt(rawData[i].seriousCount),
        updateTime: rawData[i].updateTime.slice(0,10)
    };
    if(tmp.updateTime != '')
        tret.push(tmp);
}
tret.sort((a,b)=>a.updateTime < b.updateTime ? -1 : 1);
let ret = [];
for(let i=0;i<tret.length;i++){
    if(typeof(tret[i]) == 'undefined'){
        console.log(tret[i]);
        continue;
    }
    let j = i;
    while(j+1 < parseInt(tret.length) && typeof(tret[j+1]) != 'undefined' &&tret[j+1].updateTime == tret[i].updateTime){
        j++;
    }
    console.log(tret.length);
    console.log(i);
    console.log(j+1);
    console.log(j+1 < parseInt(tret.length));
    console.log(tret[j+1]);
    let mxCon=0,mxSus=0,mxCur=0,mxDed=0,mxSer=0;
    for(let k=i;k<=j;k++){
        if(tret[k].confirmedCount > mxCon) mxCon = tret[k].confirmedCount;
        if(tret[k].suspectedCount > mxSus) mxSus = tret[k].suspectedCount;
        if(tret[k].curedCount > mxCur) mxCur = tret[k].curedCount;
        if(tret[k].deadCount > mxDed) mxDed = tret[k].deadCount;
        if(tret[k].seriousCount > mxSer) mxSer = tret[k].seriousCount;
    }
    let tmp = {
        city_confirmedCount: mxCon,
        city_suspectedCount: mxSus,
        city_curedCount: mxCur,
        city_deadCount: mxDed,
        city_seriousCount: mxSer,
        updateTime: tret[i].updateTime
    };
    ret.push(tmp);  
    i = j;
}
console.log(ret);
//console.log(rawData);
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'Area.csv',
    header: [
        {id: 'city_confirmedCount', title: 'confirmedCount'},
        {id: 'city_suspectedCount', title: 'suspectedCount'},
        {id: 'city_curedCount', title: 'curedCount'},
        {id: 'city_deadCount', title: 'deadCount'},
        {id: 'city_seriousCount', title: 'seriousCount'},
        {id: 'updateTime', title: 'updateTime'}
    ]
});
//fs.writeFileSync('Area2.csv','\uFEFF');
csvWriter.writeRecords(ret)       // returns a promise
    .then(() => {
        console.log('...Done');
        var data = fs.readFileSync('Area.csv','utf8');
        fs.writeFileSync('Overall.csv','\uFEFF'+data.toString());
        //console.log(data);
    });

