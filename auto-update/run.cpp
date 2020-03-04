#include<bits/stdc++.h>
#include<windows.h>
using namespace std;

int main(){
	while(1){ 
		
		system("rd /s /q DXY-COVID-19-Data"); 
		system("git clone https://github.com/BlankerL/DXY-COVID-19-Data.git");
		system("echo finish"); 
		puts("start move file");
		CopyFile("DXY-COVID-19-Data\\csv\\DXYArea.csv","DXYArea.csv",false);
		CopyFile("DXY-COVID-19-Data\\csv\\DXYOverall.csv","DXYOverall.csv",false);
		puts("move file finished");
		puts("start covert file");
		system("node AreaSolver.js");
		system("node NationData.js");
		puts("finish covert file");
		puts("begin solve city");
		system("node area.js");
		puts("city solved");
		puts("begin solve province");
		system("node province.js");
		puts("province solved");
		puts("begin solve nation");
		system("node nation.js");
		puts("nation solved");
		Sleep(10800000);
	}
	return 0;
} 
