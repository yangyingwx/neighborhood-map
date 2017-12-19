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
				extData: item.id,
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
			result ? markers[index].show() : markers[index].hide();
			return result;
		});
	});		
	//点击侧边栏li，弹出infowindow
	self.openInfo = function(e) {
    //构建信息窗体中显示的内容
    	info = [];
		info.push(e.name);	
		info.push('经纬度：' + e.location);
    		
    	creatInfo(e.en_name);
    	//console.log(e);
    	infowindow.open(map, e.location);
    	//弹跳    
    	bounce(markers[e.id]);
	}
}
var info;
//点击marker，弹出infowindow
function markerClick(e){  
	info = []
	bounce(e.target);
	var index = e.target.getExtData();
	info.push(e.target.getTitle());
	info.push('经纬度：' + e.target.getPosition());
	creatInfo(initialList[index].en_name);
    infowindow.open(map, e.target.getPosition());
}
//创建infowindow
function creatInfo(str) {	
	var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" 
                + str + "&format=json&callback=wikiCallback";    
        console.log(wikiUrl);	
        //info里面加上维基百科的链接
        $.ajax({
    		url: wikiUrl,
    		dataType: "jsonp",
    		success: function(response) {
        		var articlelist = response[3];
            	for (var i = 0; i < articlelist.length; i++) {  
                	info.push('维基相关链接' + articlelist[i]);
                	console.log(info);
            	}
    		},
    		error: function(error) {
      			console.log("wikipedia has failed to loaded");
    		}
  		});    
	infowindow = new AMap.InfoWindow({
       content: info.join("<br>")  
   });
}	
//marke设置动画
function bounce(marker) {
	marker.setAnimation('AMAP_ANIMATION_BOUNCE');
	setTimeout(function() {
		marker.setAnimation('AMAP_ANIMATION_NONE');
	},2400);	
}
//绑定VM
ko.applyBindings(myViewModel);


//切换样式,展示或隐藏侧边栏
$('#menu img').click(function(event) {
	$('aside').toggleClass('hide-aside');
	$('section').toggleClass('extend-map');
});

