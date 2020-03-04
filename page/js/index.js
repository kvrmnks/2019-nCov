const proCN = ["浙江省", "山东省", "四川省", "河南省", "湖南省", "广西壮族自治区",
    "福建省", "陕西省", "河北省", "海南省", "广东省", "江苏省", "吉林省",
    "新疆维吾尔自治区", "内蒙古自治区", "山西省", "云南省", "上海市", "重庆市",
    "黑龙江省", "安徽省", "甘肃省", "北京市", "江西省", "湖北省", "天津市", "辽宁省",
    "宁夏回族自治区", "贵州省", "青海省", "西藏自治区", "澳门"];
const nationURI = 'http://39.106.229.94:8080/nation';
const provinceURI = 'http://39.106.229.94:8080/province&provinceName=';
const wholeProvinceURI = 'http://39.106.229.94:8080/city&provinceName=';
const colorSet = ['#e0dcb8','#ad8664','#d3927b','#cd6254','#bb3937','#772526','#681213'];
const range = [[0,0],[1,9],[10,99],[100,499],[500,999],[1000,10000],[10000,2147483647]];
const colorAsix = "<g><rect width='15' height='15' fill='#e0dcb8' stroke='#999498'></rect><text transform='translate(30,15)'>0</text></g>"
+"<g transform='translate(0,20)'><rect width='15' height='15' fill='#ad8664' stroke='#999498'></rect><text transform='translate(30,15)'>1~9</text></g>"+
"<g transform='translate(0,40)'><rect width='15' height='15' fill='#d3927b' stroke='#999498'></rect><text transform='translate(30,15)'>10~99</text></g>"+
"<g transform='translate(0,60)'><rect width='15' height='15' fill='#cd6254' stroke='#999498'></rect><text transform='translate(30,15)'>100~499</text></g>"+
"<g transform='translate(0,80)'><rect width='15' height='15' fill='#bb3937' stroke='#999498'></rect><text transform='translate(30,15)'>500~999</text></g>"+
"<g transform='translate(0,100)'><rect width='15' height='15' fill='#772526' stroke='#999498'></rect><text transform='translate(30,15)'>1000~10000</text></g>"+
"<g transform='translate(0,120)'><rect width='15' height='15' fill='#681213' stroke='#999498'></rect><text transform='translate(30,15)'>\>10000</text></g>";
//"#681213"
let GProvinceData = null;
let CHOOSER = 1;
function rewrite() {
    d3.select('#final_headline').html("");
    d3.select('#province_body').selectAll('svg').remove();
    createChinaMap('#svg','./recourses/china.geoJson');
}
function confirmlize() {
    if(CHOOSER === 1)return;
    CHOOSER = 1;
    rewrite();
    d3.select('#index_choose').html("确诊病例");
}
function remainlize() {
    if(CHOOSER === 2)return;
    CHOOSER = 2;
    rewrite();
    d3.select('#index_choose').html("现存病例");
}
function countProvince(provinceName) {
    let countCon = 0,countRe = 0;
    for(let i in provinceData){
        if(proCN[i] == provinceName){
            countCon = (parseInt(provinceData[i][0].confirmedCount));
            countRe = parseInt(provinceData[i][0].confirmedCount) - parseInt(provinceData[i][0].curedCount) - parseInt(provinceData[i][0].deadCount);
        }
    }
    if(CHOOSER === 1)return countCon;
    else return countRe;
}
function countCity(cityName) {
    let countCon = 0,countRe = 0;
    for(let i in GProvinceData){
        if(cityName.indexOf(GProvinceData[i].key)!=-1){
            countCon = (parseInt(GProvinceData[i].values[0].confirmedCount));
            countRe = (parseInt(GProvinceData[i].values[0].confirmedCount))-(parseInt(GProvinceData[i].values[0].curedCount))-(parseInt(GProvinceData[i].values[0].deadCount));
        }
    }
    if(CHOOSER===1)return countCon;
    else return countRe;
}
function getColor(x) {
    for(let i in range){
        if(x>=range[i][0] && x<=range[i][1])
            return colorSet[i];
    }

}
function getDataOfProvince(provinceName,func) {
    d3.json(wholeProvinceURI+provinceName,d=>{
        d = d3.nest().key(d=>d.cityName).entries(d);
        for(let i in d){
            d[i].values.sort((a,b) => (a.updateTime < b.updateTime ? 1 : -1));
        }
        GProvinceData = d;
        console.log(d);
        func();

    });
}

var tooltip = d3.select('body').append('div').attr('class','tool_index')
    .style('position','absolute');
console.log(proCN);

let provinceData = [];
let nationData = [];
d3.json(nationURI,d=>{
    d.sort((a,b)=>a.updateTime < b.updateTime ? 1 : -1);
    nationData = d;
    console.log(nationData);
    let table1 = d3.select('#cur');
    let curC = parseInt(d[0].confirmedCount),curCured=parseInt(d[0].curedCount),curD=parseInt(d[0].deadCount);
    table1.append('td').classed('text-center',true).html(curC);
    table1.append('td').classed('text-center',true).html(curC-curCured-curD);
    table1.append('td').classed('text-center',true).html(curD);
    table1.append('td').classed('text-center',true).html(curCured);
    let preC = parseInt(d[1].confirmedCount),preCured=parseInt(d[1].curedCount),preD=parseInt(d[1].deadCount);
    let table2=d3.select('#before');
    table2.append('td').classed('text-center',true).html(curC-preC);
    table2.append('td').classed('text-center',true).html(curC-curCured-curD-(preC-preCured-preD));
    table2.append('td').classed('text-center',true).html(curD-preD);
    table2.append('td').classed('text-center',true).html(curCured-preCured);
    d3.select('#headline').html('截至'+d[0].updateTime+'的数据');
});
let needToGet = proCN.length;
for(let i in proCN){
    provinceData.push(null);
}
for(let i in proCN){
    d3.json(provinceURI+proCN[i],d=>{
        d.sort((a,b) => a.updateTime < b.updateTime ? 1 : -1);
        provinceData[i] = d;
        needToGet--;
        if(needToGet === 0){
            createMap();
        }
    });
}
function createMap() {
    createChinaMap('#svg','./recourses/china.geoJson');

}
function createChinaMap(TMD,map){
    d3.json(map,d=>mcreateMap(d));
    function mcreateMap(data) {
        d3.select(TMD).selectAll('path').remove();
        d3.select(TMD).selectAll('g').remove();
        var projection = d3.geoMercator().scale(700).translate([-900,800]);
        var geoPath = d3.geoPath().projection(projection);
        d3.select(TMD).selectAll('g').data(data.features)
            .enter().append('g').append('path').attr('d',geoPath)
            .style('fill',(d,i)=>{
                let name = d.properties.name;
                let count = countProvince(name);
                return getColor(count);
            })
            .attr('stroke','white')
            .on('click',function (d) {
                let loc = './recourses/'+d.properties.name+'.geojson';
                getDataOfProvince(d.properties.name,function () {
                    d3.select('#final_headline').html(d.properties.name);
                    d3.select('#province_body').append('svg').attr('id','province_svg')
                        .attr('width','800').attr('height','700');
                    createProvinceMap('#province_svg',loc);
                })

            })
            .on('mouseover',function (d) {
                //toolfds
                let name = d.properties.name;
                let curData = 0;
                let curDeath = 0;
                let curCured = 0;
                for(let i in provinceData){
                    if(proCN[i] == name){
                            curData = parseInt(provinceData[i][0].confirmedCount);
                            curDeath = parseInt(provinceData[i][0].deadCount);
                            curCured = parseInt(provinceData[i][0].curedCount);
                    }
                }
                let curRemain = curData-curDeath-curCured;
                let text = d.properties.name+ "<br \\>"+'确诊病例:'+curData +'<br \\>' +'现存病例:'+curRemain+'<br \\>' + '治愈病例:'+curCured
                    +"<br \\>" + '死亡病例:' + curDeath;
                tooltip.html(text).transition()
                    .style('left',d3.event.pageX + 20+'px')
                    .style('top',d3.event.pageY +20 +'px')
                    .style('opacity',1.0);
                let center = geoPath.centroid(d);
                d3.select(this.parentNode).attr('transform','scale(1.2) translate('+(-center[0]*(1-1/1.2))+', '+(-center[1]*(1-1/1.2))+')');
                d3.select(this.parentNode).raise();
                d3.select('#df23232').raise();
            })
            .on('mouseout',function (d){
                d3.select(this.parentNode).attr('transform','scale(1.00)');
                tooltip.transition().style('opacity',0);
            });
        d3.select(TMD).append('g').attr('id','df23232').selectAll('text').data(data.features).enter().append('text').attr('x',d=>geoPath.centroid(d)[0])
            .attr('y',d=>geoPath.centroid(d)[1])
            .attr('text-anchor','middle')
            .style('font-size','10px')
            .text(d=>convertType(d.properties.name));
        d3.select(TMD).append('g').attr('transform','translate(700,500)').html(colorAsix);
    }
}
function createProvinceMap (TMD,map) {
    height = 700;
    width = 800;
    d3.json(map,d=>loadJson(d));
    function loadJson(data){
        let projection = d3.geoMercator().scale(1200).translate([-900,800]);
        let geoPath = d3.geoPath().projection(projection);
        let color = d3.scaleOrdinal(d3.schemeCategory20b);
        d3.select(TMD).selectAll('g').remove();
        let minX = 99999;let minY = 99999;
        let maxX = -99999; let maxY = -99999;
        for(let _cur in data.features){
            let cornor = geoPath.bounds(data.features[_cur]);
            let x = cornor[0][0]; let y = cornor[0][1];
            let x1 = cornor[1][0]; let y1 = cornor[1][1];
            if(x < minX) minX = x; if(y < minY) minY = y;
            if(x1 > maxX) maxX = x1; if(y1 > maxY) maxY = y1;
        }
        let frac = width*2 / (maxX - minX);
        let frac2 = height*2 / (maxY - minY);
        if(frac > frac2) frac = frac2;
        frac *= 500;

        projection = d3.geoMercator().scale(frac).translate([-900,800]);
        geoPath = d3.geoPath().projection(projection);
        d3.select(TMD).selectAll('g').data(data.features)
            .enter().append('g').append('path').attr('d',geoPath)
            .attr('fill',(d,i)=>{
                let name = d.properties.name;
                let count = countCity(name);
                console.log(name);
                console.log(count);
                //console.log();
                return getColor(count);
            })
            .attr('stroke','#007bff')
            .on('mouseover',function (d) {
                let name = d.properties.name;
                let curData = 0;
                let curDeath = 0;
                let curCured = 0;
                for(let i in GProvinceData){
                    if(name.indexOf(GProvinceData[i].key)!=-1){
                        curData = parseInt(GProvinceData[i].values[0].confirmedCount);
                        curDeath = parseInt(GProvinceData[i].values[0].deadCount);
                        curCured = parseInt(GProvinceData[i].values[0].curedCount);
                    }
                }
                let curRemain = curData-curDeath-curCured;
                let text = d.properties.name+ "<br \\>"+'确诊病例:'+curData +'<br \\>' +'现存病例:'+curRemain+'<br \\>' + '治愈病例:'+curCured
                    +"<br \\>" + '死亡病例:' + curDeath;
                tooltip.html(text).transition()
                    .style('left',d3.event.pageX + 20+'px')
                    .style('top',d3.event.pageY +20 +'px')
                    .style('opacity',1.0);
            });
        minX = 99999;minY = 99999;
        maxX = -99999; maxY = -99999;
        d3.select(TMD).selectAll('path').each(function (d) {
            let cornor = geoPath.bounds(d);
            let x = cornor[0][0]; let y = cornor[0][1];
            let x1 = cornor[1][0]; let y1 = cornor[1][1];
            if(x < minX) minX = x; if(y < minY) minY = y;
            if(x1 > maxX) maxX = x1; if(y1 > maxY) maxY = y1;
        });
        minX -= 50;
        minY -= 50;
        d3.select(TMD).selectAll('g').attr('transform','translate('+(-minX)+','+(-minY)+')')
            .selectAll('text').data(data.features)
            .enter()
            .append('text')
            .attr('x',d=>geoPath.centroid(d)[0])
            .attr('y',d=>geoPath.centroid(d)[1])
            .attr('text-anchor','middle')
            .style('font-size','10px')
            .text(d=>d.properties.name);
        d3.select(TMD).append('g').attr('transform','translate(700,500)').html(colorAsix);
    }
}
function convertType(province){
    if(province == '内蒙古自治区' || province == '黑龙江省')
        province = province.slice(0,3);
    else province = province.slice(0,2);
    return province;
}