var map = new AMap.Map('map', {
    resizeEnable: true,
    zoom:11,
    center: [120.299689,31.576045]
 });
AMap.plugin(['AMap.ToolBar','AMap.MapType'],
    function(){
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.MapType());
});
var markers = [];
var infowindow;
var myViewModel = function () {
	var self = this;
	this.userInput = ko.observable("");
	this.mapList = ko.observableArray();
	this.shouldShowMessage = ko.observable(true);
	
	//初始化列表项数组和markers
	this.init = function () {
		console.log();
		initialList.forEach(function (item) {
			self.mapList.push(item);
			var marker = new AMap.Marker({
				position: item.location,
				title: item.name,
				map: map
    		});	
    		marker.on('click', markerClick);
    		markers.push(marker);
		});
		
		
		
	}
	this.init();
	
	//改变当前列表项,点标记跟着联动	
	self.currentMapList = ko.computed(function () {
		return ko.utils.arrayFilter(self.mapList(), function (el, index) {
			var result = el.name.indexOf(self.userInput()) > -1;
			if (result) {markers[index].show();} else {markers[index].hide();}
			return result;
		});
	});		
	
	self.openInfo = function(e) {
   //构建信息窗体中显示的内容   
    	info = [] 	
		info.push(e.name);
		info.push('经纬度：' + e.location);
    	creatInfo();
    	//console.log(e);
    	infowindow.open(map, e.location);
    	//弹跳
    	console.log(e.id);
    	bounce(markers[e.id]);
	}
}
var info;
function markerClick(e){  
	info = []
	bounce(e.target);
	info.push(e.target.getTitle());
	info.push('经纬度：' + e.target.getPosition());
	creatInfo();
    infowindow.open(map, e.target.getPosition());
}
function creatInfo() {	
	infowindow = new AMap.InfoWindow({
       content: info.join("<br>")  
   });
}	
function bounce(marker) {
	marker.setAnimation('AMAP_ANIMATION_BOUNCE');
	setTimeout(function() {
		marker.setAnimation('AMAP_ANIMATION_NONE');
	},2400);	
}
ko.applyBindings(myViewModel);


//切换样式
$('#menu img').click(function(event) {
	$('aside').toggleClass('hide-aside');
	$('section').toggleClass('extend-map');
});

