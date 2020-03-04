//用于模式选择调整的函数指针
var ModFunction = null;

var ProvinceMap = new Dictionary();
//当前的省
var curProvince = null;
//选择的模式
var chooseType = 0;
//单选模式中选择的城市列表
var CityMap = new Dictionary();
//国家数据
var NationMap = [];
//市的数据
var Data = null;
//省数据
var ProvinceData = [];
//当前乱七八糟数据
var DataMap = [];

//与服务器通信
const nationURI = 'http://39.106.229.94:8080/nation';
const provinceURI = 'http://39.106.229.94:8080/province&provinceName=';
const cityURI = 'http://39.106.229.94:8080/city&cityName=';
const wholeProvinceURI = 'http://39.106.229.94:8080/city&provinceName=';
//
var tooltip = d3.select('body').append('div').attr('class','tool')
    .style('position','absolute');
// 以上为公共变量
// 得到全国的数据
function getNationData(f) {
    d3.json(nationURI,d=>f(d));
}
//得到省数据
function getProvinceData(provinceName,f) {
    d3.json(provinceURI+provinceName,d=>f(d));
}
//得到城市数据
function getCityData(cityName,f) {
    d3.json(cityURI+cityName,d=>f(d));
}
//得到全省的数据
function getAllDataOfProvince(provinceName,f) {
    d3.json(wholeProvinceURI+provinceName,d=>f(d));
}
//画在指定的div下 一张图
function _drawCountChart(div,arg) {
    div.select('svg').remove();
    let svg = div.append('svg').attr('height','370px').attr('width','900px');
    DataMap.sort((a,b) => {
        return a.updateTime > b.updateTime ? -1 : 1;
    });
    let yExtent = d3.extent(DataMap,d=>d[arg]);
    let keys  = [];

    for(let i in DataMap) {keys.push(DataMap[i].updateTime);}
    let xScale = d3.scaleBand().domain(keys).range([700,0]);

    let yScale = d3.scaleLinear().domain(yExtent).range([280,0]);
    let xAxis = d3.axisBottom().scale(xScale);
    svg.append('g').attr('transform','translate(60,300)').classed('time',true).call(xAxis);
    svg.selectAll('text').attr('dx','40').attr('transform','rotate(60)');
    let yAxis = d3.axisLeft().scale(yScale);
    svg.append('g').attr('transform','translate(60,20)').call(yAxis);
    let _line = d3.line().x(d=>60+xScale(d.updateTime)).y(d=>20+yScale(d[arg]));
    //console.log(DataMap);
    svg.append('g').append('path').attr('d',_line(DataMap)).attr('fill','none').attr('stroke','black');
    let g = svg.append('g');
    svg.selectAll('circle').data(DataMap).enter()
        .append('circle')
        .attr('r','7px')
        .attr('fill','red')
        .attr('cy',d=>20+yScale(d[arg]))
        .attr('cx',d=>60+xScale(d.updateTime))
        .on('mousemove',function (d) {
            d3.select(this).transition().duration(100).attr('r','10px');
            let text = '(' + d.updateTime + ',' + (''+d[arg]).slice(0,6) + ')';
            tooltip.html(text).transition()
                .style('left',d3.event.pageX + 20+'px')
                .style('top',d3.event.pageY +20 +'px')
                .style('opacity',1.0);
        })
        .on('mouseout',function (d) {
            d3.select(this).transition().duration(100).attr('r','7px');
            tooltip.transition().style('opacity',0);
        });
}
function _drawRateChart(div,arg){
    div.select('svg').remove();
    let svg = div.append('svg').attr('height','370px').attr('width','900px');
    DataMap.sort((a,b) => {
        return a.updateTime > b.updateTime ? -1 : 1;
    });
    let yExtent = d3.extent(DataMap,d=>parseFloat(d[arg])/parseFloat(d.confirmedCount));
    let keys  = [];
    for(let i in DataMap) {keys.push(DataMap[i].updateTime);}
    let xScale = d3.scaleBand().domain(keys).range([700,0]);
    let yScale = d3.scaleLinear().domain(yExtent).range([280,0]);
    let xAxis = d3.axisBottom().scale(xScale);
    svg.append('g').attr('transform','translate(60,300)').classed('time',true).call(xAxis);
    svg.selectAll('text').attr('dx','40').attr('transform','rotate(60)');
    let yAxis = d3.axisLeft().scale(yScale);
    svg.append('g').attr('transform','translate(60,20)').call(yAxis);
    let _line = d3.line().x(d=>60+xScale(d.updateTime)).y(d=>20+yScale(parseFloat(d[arg])/parseFloat(d.confirmedCount)));
    svg.append('g').append('path').attr('d',_line(DataMap)).attr('fill','none').attr('stroke','black');
    //console.log(DataMap);
    svg.selectAll('circle')
        .data(DataMap)
        .enter()
        .append('circle')
        .attr('r','7px')
        .attr('fill','red')
        .attr('cy',d=>20+yScale(parseFloat(d[arg])/parseFloat(d.confirmedCount)))
        .attr('cx',d=>60+xScale(d.updateTime))
        .on('mousemove',function (d) {
            d3.select(this).attr('r','10px');
            let text = '(' +  d.updateTime + ',' + (''+parseFloat(d[arg])/parseFloat(d.confirmedCount)).slice(0,6) + ')';
            tooltip.html(text).transition()
                .style('left',d3.event.pageX + 20+'px')
                .style('top',d3.event.pageY +20 +'px')
                .style('opacity',1.0);
        })
        .on('mouseout',function (d) {
            d3.select(this).attr('r','7px');
            tooltip.transition().style('opacity',0);
        });
}
function _drawSpeedChart(div,arg) {
    div.select('svg').remove();
    let svg = div.append('svg').attr('height','370px').attr('width','900px');
    DataMap.sort((a,b) => {
        return a.updateTime > b.updateTime ? -1 : 1;
    });
    let _data = [];
    for(let i in DataMap){
        if(i == 0) continue;
        //console.log(i);
        let cur = parseFloat(DataMap[i].confirmedCount);
        let pre = parseFloat(DataMap[i-1].confirmedCount);
        let tmp = {
            updateTime: DataMap[i].updateTime,
            confirmedCount: cur = 0 ? 0 : pre / cur
        };
/*        console.log(tmp);
        console.log(i);
        console.log(DataMap[i]);*/
        _data.push(tmp);
    }
    let yExtent = d3.extent(_data,d=>d.confirmedCount);
    let keys  = [];
    for(let i in _data) {keys.push(_data[i].updateTime);}
    let xScale = d3.scaleBand().domain(keys).range([700,0]);
    let yScale = d3.scaleLinear().domain(yExtent).range([280,0]);
    let xAxis = d3.axisBottom().scale(xScale);
    svg.append('g').attr('transform','translate(60,300)').classed('time',true).call(xAxis);
    svg.selectAll('text').attr('dx','40').attr('transform','rotate(60)');
    let yAxis = d3.axisLeft().scale(yScale);
    svg.append('g').attr('transform','translate(60,20)').call(yAxis);
    let _line = d3.line().x(d=>60+xScale(d.updateTime)).y(d=>20+yScale(parseFloat(d[arg])));
    //console.log(DataMap);
    svg.append('g').append('path').attr('d',_line(_data)).attr('fill','none').attr('stroke','black');
    svg.selectAll('circle').data(_data).enter()
        .append('circle')
        .attr('r','7px')
        .attr('fill','red')
        .attr('cy',d=>20+yScale(parseFloat(d[arg])))
        .attr('cx',d=>60+xScale(d.updateTime))
        .on('mousemove',function (d) {
            d3.select(this).attr('r','10px');
            let text = '(' +  d.updateTime + ',' + (''+parseFloat(d[arg])).slice(0,6) + ')';
            tooltip.html(text).transition()
                .style('left',d3.event.pageX + 20+'px')
                .style('top',d3.event.pageY +20 +'px')
                .style('opacity',1.0);
        })
        .on('mouseout',function (d) {
            d3.select(this).attr('r','7px');
            tooltip.transition().style('opacity',0);
        });
}
//画图
function drawCharts() {
    _drawCountChart(d3.select('#index_confirmed_div'),'confirmedCount');
    _drawCountChart(d3.select('#index_cured_div'),'curedCount');
    _drawCountChart(d3.select('#index_dead_div'),'deadCount');
    _drawRateChart(d3.select('#index_dead_rate_div'),'deadCount');
    _drawRateChart(d3.select('#index_cured_rate_div'),'curedCount');
    _drawSpeedChart(d3.select('#index_confirmed_rate_div'),'confirmedCount');
}
//得到当前的省节点的省全程
function getCurProvinceName(){
    return curProvince.__data__.properties.name;
}
//找到数据中的省节点
function findProvinceInData(provinceName){
    for(i in Data){
        if(Data[i].key == provinceName)
            return Data[i].values;
    }
}
//找到提供的省节点下的城市节点
function findCityInProvinceNode(cityName,provinceNode){
    //console.log(cityName+' '+provinceNode);
    for(i in provinceNode){
        if(provinceNode[i].key == cityName)
            return provinceNode[i].values;
    }
}
//初始化城市数据
function initCityData(data){//console.log(data);
    data = d3.nest().key(d=>d.provinceName).entries(data);
    for(i in data){
        data[i].values = d3.nest().key(d=>d.cityName).entries(data[i].values);
    }
    Data = data;
}
//初始化国家数据
function initNationData(data) {
    data = d3.nest().key(d=>d.updateTime).entries(data);
    for(let i in data)
        NationMap.push(data[i].values[0]);
    //console.log(NationMap);
}
//初始化省数据
function initProvinceData(data) {
    data = d3.nest().key(d=>d.provinceName).entries(data);
    ProvinceData = data;
    //console.log(data);
}
//合并两个城市的数据
function mergeCityMap(data,mul){
    let _data = [];
    for(let x in data){if(data[x].updateTime != '')_data.push(data[x])};
   // console.log(_data);
    _data.sort((a,b) => {a.updateTime.slice(0,10) < b.updateTime.slice(0,10)});
    let len = _data.length;
    let arr = [];
    for(let i=0; i<len;i++){
        var j = i;
        while(j+1 < len && _data[j+1].updateTime.slice(0,10) === _data[i].updateTime.slice(0,10))j++;
        let cf=0,cu=0,dd=0;
        for(let k=i;k<=j;k++){
            if(parseInt(data[j].confirmedCount) > cf) cf = parseInt(data[j].confirmedCount);
            if(parseInt(data[j].curedCount) > cu) cu = parseInt(data[j].curedCount);
            if(parseInt(data[j].deadCount) > dd) dd = parseInt(data[j].deadCount);
        }
        let tmp = {
            confirmedCount: cf,
            curedCount: cu,
            deadCount: dd,
            updateTime: data[i].updateTime.slice(0,10)
        };
        arr.push(tmp);
        i = j;
    }
    //console.log(arr);
    for(let i in arr){
        let flag = false;
        let pos;
        for(let j in DataMap){
            if(DataMap[j].updateTime === arr[i].updateTime){
                pos = j;
                flag = true;
                break;
            }
        }
        if(flag){
            DataMap[pos].confirmedCount += mul * arr[i].confirmedCount;
            DataMap[pos].curedCount += mul * arr[i].curedCount;
            DataMap[pos].deadCount += mul * arr[i].deadCount;
        }else{
            let tmp = {
                confirmedCount: mul * arr[i].confirmedCount,
                curedCount: mul * arr[i].curedCount,
                deadCount: mul * arr[i].deadCount,
                updateTime: arr[i].updateTime
            };
            DataMap.push(tmp);
        }

    }
    DataMap.sort((a,b)=>a.updateTime < b.updateTime);
    //console.log(DataMap);
}
//添加一个市
function addCity(data){
    //console.log(data);
    getCityData(data,d=>mergeCityMap(d,1));
}
//去掉一个市
function removeCity(data){
    getCityData(data,d=>mergeCityMap(d,-1));
}
//选择市的时候的事件触发器
function cityChooseMod(data,i,_this) {
    let cityName = convertCityName(data.properties.name);
    if(_this.style.fill.colorHex().toUpperCase() !== "#ff0000".toUpperCase()){
        _this.style.fill = "#ff0000";
        CityMap.add(cityName);
        addCity(cityName);
    }else{
        _this.style.fill = color16();
        CityMap.remove(cityName);
        removeCity(cityName);
    }
}
// 选择省份时单选的事件函数
function _singleChooseFunction(data,i,_this){
    if(curProvince != null){
        curProvince.style.fill = color16();
    }
    let flag = (curProvince !== _this);
    curProvince = _this;
    if(_this.style.fill.colorHex().toUpperCase() !== "#ff0000".toUpperCase()){
        _this.style.fill = "#ff0000";
    }else{
        _this.style.fill = color16();
    }
    let loc = './recourses/'+data.properties.name+'.geojson';
    if(flag){
        CityMap.removeAll();
        DataMap = [];
        createProvinceMap('#index_province_chart',loc);
    }

}
//选择省份时单选的事件触发器
function singleChooseMod() {
    chooseType = 1;
    createChinaMap('#index_china_chart','./recourses/china.geoJson');
    DataMap = [];
   d3.select('#province_div').select('svg').remove();
   d3.select('#province_div').append('svg')
        .attr('id','index_province_chart')
        .attr('height','700px')
        .attr('width','800px');
   ModFunction = _singleChooseFunction;
   d3.select('#index_chooser').html('单选模式');
}
//选择省份时多选的事件函数
function _doubleChooseFunction(data,i,_this){
    curProvince = _this;
    let flag = false;
    if(_this.style.fill.colorHex().toUpperCase() !== "#ff0000".toUpperCase()){
        flag = true;
        _this.style.fill = "#ff0000";
    }else{
        _this.style.fill = color16();
    }
    let provinceName = getCurProvinceName();
    let tag = 1;
    if(flag == false) tag = -1;
    getProvinceData(provinceName,d=>mergeCityMap(d,tag));
}
//选择省份时多选的事件触发器
function doubleChooseMod() {
    chooseType = 2;
    createChinaMap('#index_china_chart','./recourses/china.geoJson');
    DataMap = [];
    d3.select('#province_div').selectAll('svg').remove();
    ModFunction = _doubleChooseFunction;
    d3.select('#index_chooser').html('多选模式');
}
//选择省份时反向选择的事件函数
function _inverseChooseFunction(data,i,_this){
    curProvince = _this;
    let flag = false;
    if(_this.style.fill.colorHex().toUpperCase() !== "#ff0000".toUpperCase()){
        flag = true;
        _this.style.fill = "#ff0000";
    }else{
        _this.style.fill = color16();
    }
    let provinceName = getCurProvinceName();
    let tag = -1;
    if(flag == false) tag = 1;
    getProvinceData(provinceName,d=>mergeCityMap(d,tag));
}
//选择省份时反向选择的事件触发器
function inverseChooseMod() {
    chooseType = 3;
    createChinaMap('#index_china_chart','./recourses/china.geoJson');
    d3.select('#province_div').selectAll('svg').remove();
    ModFunction = _inverseChooseFunction;
    getNationData(d=>mergeCityMap(d,1));
    //console.log(NationMap);
    d3.select('#index_chooser').html('反向选择模式');
}
//画中国地图
function createChinaMap(TMD,map){
    d3.json(map,d=>mcreateMap(d));
    function mcreateMap(data) {
        //console.log('23');
        d3.select('#index_china_chart').selectAll('path').remove();
        d3.select('#index_china_chart').selectAll('g').remove();
        var projection = d3.geoMercator().scale(700).translate([-900,800]);
        var geoPath = d3.geoPath().projection(projection);

        let color = d3.scaleOrdinal(d3.schemeCategory20b);
       // console.log(data);
        d3.select(TMD).selectAll('g').data(data.features)
            .enter().append('g').append('path').attr('d',geoPath).style('fill',(d,i)=>color(i)).attr('stroke','white')
            .on('click',function (data,i){ModFunction(data,i,this);})
            .on('mouseover',function (d) {
                let center = geoPath.centroid(d);
                //console.log(-center[0]);
                d3.select(this.parentNode).attr('transform','scale(1.2) translate('+(-center[0]*(1-1/1.2))+', '+(-center[1]*(1-1/1.2))+')');
                d3.select(this.parentNode).raise();
                d3.select('#fd22').raise();
                    //.attr('box-shadow','5px 5px 5px black');
                //console.log('in ' + convertType(d.properties.name));
            })
            .on('mouseout',function (d){
                d3.select(this.parentNode).attr('transform','scale(1.00)');
                //console.log('out ' + convertType(d.properties.name));
            });
        d3.select(TMD).append('g').attr('id','fd22').selectAll('text').data(data.features).enter()
            .append('text').attr('x',d=>geoPath.centroid(d)[0])
            .attr('y',d=>geoPath.centroid(d)[1])
            .attr('text-anchor','middle')
            .style('font-size','10px')
            .text(d=>convertType(d.properties.name));;
    }
}
//画省份地图
function createProvinceMap (TMD,map) {
    height = 700;
    width = 800;
    createChinaMap('#index_china_chart','./recourses/china.geoJson');
    if(ProvinceMap.Exists(map) === false){
        d3.json(map,d=>loadJson(d));
    }else{
        loadJson(ProvinceMap.getItem(map));
    }
    function loadJson(data){
        if(ProvinceMap.Exists(map) === false)
            ProvinceMap.add(map,data);
        let projection = d3.geoMercator().scale(1200).translate([-900,800]);
        let geoPath = d3.geoPath().projection(projection);
        let color = d3.scaleOrdinal(d3.schemeCategory20b);
        d3.select(TMD).selectAll('g').remove();
        let minX = 99999;let minY = 99999;
        let maxX = -99999; let maxY = -99999;
        //console.log(data);
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
            .enter().append('g').append('path').attr('d',geoPath).attr('fill',(d,i)=>color(i)).attr('stroke','white')
            .on('click',function (data,i) {
                cityChooseMod(data,i,this);
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
        minX -= 125;
        minY -= 125;
        d3.select(TMD).selectAll('g').attr('transform','translate('+(-minX)+','+(-minY)+')')
            .selectAll('text').data(data.features)
            .enter()
            .append('text')
            .attr('x',d=>geoPath.centroid(d)[0])
            .attr('y',d=>geoPath.centroid(d)[1])
            .attr('text-anchor','middle')
            .style('font-size','10px')
            .text(d=>d.properties.name);
    }
}
//将省份名称缩写
function convertType(province){
    if(province == '内蒙古自治区' || province == '黑龙江省')
        province = province.slice(0,3);
    else province = province.slice(0,2);
    return province;
}
//将市的名称缩写
function convertCityName(name){
    if(name.slice(name.length-1,name.length) == '市')
        return name.slice(0,name.length-1);
    else
        return name;
}