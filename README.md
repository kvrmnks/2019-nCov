# 2019-nCov
### 环境
采用html+js+d3.js+bootstrap+nodejs-express+mysql
### 项目详情
##### 数据来源
https://github.com/BlankerL/DXY-COVID-19-Data
##### 数据处理方式
数据部署在服务器上,存储在MySQL里.

使用nodejs的d3库和fs库将数据分省分市和分时间和剔除一天内的多组数据.

保存在.csv文件中,并且使用nodejs的mysql库存放在mysql中.

使用nodejs的express库在服务器的端口上开放的请求数据的链接,设定了请求的参数.

通过访问可以获得json格式的数据


```
/province&provinceName= 可以获得省份的数据
/city&cityName= 可以通过城市的数据
/city&provinceName= 可以通过省份的名称获得更加详细的数据
/nation 可以获得全国的粗略信息
```

json的基本格式
```
[{
    id:
    cityName:
    provinceName:
    confirmedCount:
    deadCount:
    curedCount:
    updateTime:
}]
```

通过简单程序定时git pull,执行nodejs的相关程序更新数据.

#### 网页设计

使用了bootstrap做了简单的页面布局.

使用d3.js做了可视化的工作.

##### 表格类
表格的样式采用了bootstrap,里面的数据通过d3.js从服务端动态获取并加载

可以在下拉框中选择要显示的省份数据

##### 图类
通过d3.js从服务端加载数据,自己定义了坐标轴,设计了一些事件

图结构中包含地图, 省份级别的地图通过国家级的地图得到

可以选的多个市或者多个省动态生成折线图

实现包括治愈率,死亡率等数据信息

在主页中实现了确诊地图和现存确诊地图

##### project中采用的一些小技巧

在实现主页的图表的坐标轴是采用了手写svg的方法.

在鼠标放到各个省份上时采用了svg的scale和translate放大并且矫正位置

使用了click,mouseover和mouseout做了一系列事件

小的提示框采用了CSS+js的方法实现

在各个模式切换的时候采用了函数指针

按钮通过CSS变好看了

画地图的时候通过svg的变化而不是d3的映射计算坐标

#### 总结
通过这个项目学习了html,js,d3.js,mysql,nodejs,实现了前后端的分离和数据的自动更新,学习了数据可视化的基本技术.



