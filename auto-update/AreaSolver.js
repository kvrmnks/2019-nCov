var d3 = require("d3");
var fs = require("fs");
function readText(pathname) { //去除utf-8 BOM的文本文件读取
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}
var rawData = d3.csvParse(readText('DXYArea.csv'));
rawData.sort((a,b) =>{
    let pca = a.provinceName;
    let pcb = b.provinceName;
    let cca = a.cityName;
    let ccb = b.cityName;
    if(pca == pcb)
        return cca < ccb ? -1 : 1;
    else
        return pca < pcb ? -1 : 1;
});
//console.log(rawData);
let ret = [];
for(let i=0;i<rawData.length;i++){
    let j = i;
    while(j+1 < rawData.length && rawData[j+1].cityName == rawData[i].cityName){
        j++;
    }
    let tmp = [];
    for(let k=i;k<=j;k++)tmp.push(rawData[k]);
    tmp.sort((a,b)=>{
        return a.updateTime.slice(0,10) < b.updateTime.slice(0,10) ? -1 : 1;
    });
    //let solvedTmp = [];
    for(let k=0;k<tmp.length;k++){
        let g = k;
        let province_confirmedCount = 0, province_curedCount=0,province_deadCount=0,city_confirmedCount=0,city_curedCount=0,city_deadCount=0;
        while(g+1<tmp.length && tmp[g+1].updateTime.slice(0,10) == tmp[k].updateTime.slice(0,10)) g++;
        for(let f=k;f<=g;f++){
            if(parseInt(tmp[f].city_deadCount) == 2990) tmp[f].city_deadCount = 0;
            if(tmp[f].province_confirmedCount > province_confirmedCount) province_confirmedCount = tmp[f].province_confirmedCount;
            if(tmp[f].province_curedCount > province_curedCount) province_curedCount = tmp[f].province_curedCount;
            if(tmp[f].province_deadCount > province_deadCount) province_deadCount = tmp[f].province_deadCount;
            if(tmp[f].city_confirmedCount > city_confirmedCount) city_confirmedCount = tmp[f].city_confirmedCount;
            if(tmp[f].city_curedCount > city_curedCount) city_curedCount = tmp[f].city_curedCount;
            if(tmp[f].city_deadCount > city_deadCount) city_deadCount = tmp[f].city_deadCount;
        }
        ret.push({
            provinceName: tmp[k].provinceName,
            cityName: tmp[k].cityName,
            province_confirmedCount: province_confirmedCount,
            province_curedCount: province_curedCount,
            province_deadCount: province_deadCount,
            city_confirmedCount: city_confirmedCount,
            city_curedCount: city_curedCount,
            city_deadCount: city_deadCount,
            updateTime: tmp[k].updateTime.slice(0,10),
            id: tmp[k].updateTime.slice(0,10)+tmp[k].cityName
        });
        k = g;
    }
    i = j;
}
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'Area.csv',
    header: [
        {id: 'provinceName', title: 'provinceName'},
        {id: 'cityName', title: 'cityName'},
        //{id: 'province_confirmedCount', title: 'province_confirmedCount'},
       // {id: 'province_curedCount', title: 'province_curedCount'},
       // {id: 'province_deadCount', title: 'province_deadCount'},
        {id: 'city_confirmedCount', title: 'confirmedCount'},
        {id: 'city_curedCount', title: 'curedCount'},
        {id: 'city_deadCount', title: 'deadCount'},
        {id: 'updateTime', title: 'updateTime'},
        {id: 'id', title: 'id'}
    ]
});
//fs.writeFileSync('Area2.csv','\uFEFF');
csvWriter.writeRecords(ret)       // returns a promise
    .then(() => {
        console.log('...Done');
        var data = fs.readFileSync('Area.csv','utf8');
        fs.writeFileSync('Area2.csv','\uFEFF'+data.toString());
        solveProvince();
    });

function solveProvince(){
    let solvedProvinceRet = [];
    for(let i=0;i<ret.length;i++){
        let j=i;
        while(j+1<ret.length && ret[j+1].provinceName == ret[i].provinceName)j++;
        let tmp=[];
        for(let k=i;k<=j;k++)tmp.push(ret[k]);
        tmp.sort((a,b)=>{
            return a.updateTime.slice(0,10) < b.updateTime.slice(0,10) ? -1 : 1;
        });
        for(let k=0;k<tmp.length;k++){
            let g=k;
            while(g+1<tmp.length&&tmp[g+1].updateTime==tmp[k].updateTime)g++;
            let province_confirmedCount=0,province_curedCount=0,province_deadCount=0;
            for(let f=k;f<=g;f++){
                if(tmp[f].province_confirmedCount > province_confirmedCount)province_confirmedCount = tmp[f].province_confirmedCount ;
                if(tmp[f].province_curedCount > province_curedCount)province_curedCount = tmp[f].province_curedCount ;
                if(tmp[f].province_deadCount > province_deadCount)province_deadCount = tmp[f].province_deadCount ;
            }
            solvedProvinceRet.push({
                provinceName: tmp[k].provinceName,
                province_confirmedCount: province_confirmedCount,
                province_curedCount: province_curedCount,
                province_deadCount: province_deadCount,
                updateTime: tmp[k].updateTime.slice(0,10),
                id: tmp[k].updateTime.slice(0,10)+tmp[k].provinceName
            });
            k=g;
        }
        i=j;
    }
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: 'Province.csv',
        header: [
            {id: 'provinceName', title: 'provinceName'},
            {id: 'province_confirmedCount', title: 'confirmedCount'},
            {id: 'province_curedCount', title: 'curedCount'},
            {id: 'province_deadCount', title: 'deadCount'},
            {id: 'updateTime', title: 'updateTime'},
            {id: 'id',title: 'id'}
        ]
    });
    //fs.writeFileSync('Area2.csv','\uFEFF');
    csvWriter.writeRecords(solvedProvinceRet)       // returns a promise
        .then(() => {
            console.log('...Done');
            var data = fs.readFileSync('Province.csv','utf8');
            fs.writeFileSync('Province2.csv','\uFEFF'+data.toString());
          //  solveProvince();
        });
}