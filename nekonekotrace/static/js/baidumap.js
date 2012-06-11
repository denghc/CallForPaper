ThuMiao.prototype.map = new function(){
	this.Map;
	this.init = function(name){
		this.Map = new BMap.Map(name);          // 创建地图实例
		var point = new BMap.Point(116.333, 40.0155);  // 创建点坐标
		this.Map.centerAndZoom(point, 17);                 // 初始化地图，设置中心点坐标和地图级别
		this.Map.setMinZoom(16);
		this.Map.setMaxZoom(18);
		
		this.Map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_RIGHT, type:BMAP_NAVIGATION_CONTROL_SMALL})); //放大、缩小的控件
		
		var thuSW = new BMap.Point(116.321627, 39.998077);
		var thuNE = new BMap.Point(116.343834, 40.019078);
		var thuBounds = new BMap.Bounds(thuSW, thuNE);
		//BMapLib.AreaRestriction.setBounds(map, thuBounds);//设定显示区域限制
		this.setBounds(this.Map, thuBounds);
		
		this.Map.addEventListener("click", function(e){
			$('#NLname').val('');
			$('#NLx').val(e.point.lng);
			$('#NLy').val(e.point.lat);
		});
	}
	
	this.setBounds = function(map, bounds){
		map.addEventListener("dragend", function(e){  
			//alert("Current lng: " + e.point.lng + ", lat: " + e.point.lat);
		
			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();
			var viewSW = map.getBounds().getSouthWest();
			var viewNE = map.getBounds().getNorthEast();
			var center = map.getCenter();
			if(viewSW.lng < sw.lng)
			{
				center.lng += sw.lng - viewSW.lng;
			}
			if(viewSW.lat < sw.lat)
			{
				center.lat += sw.lat - viewSW.lat;
			}
			if(viewNE.lng > ne.lng)
			{
				center.lng -= viewNE.lng - ne.lng;
			}
			if(viewNE.lat > ne.lat)
			{
				center.lat -= viewNE.lat - ne.lat;
			}
			//map.panTo(center);
			map.centerAndZoom(center, map.getZoom());
			//map.setCenter(center);
		});
	}

	this.newLabel = function(x, y, name, content){
		var myIcon = new BMap.Icon("../../static/image/markers_FromHotel.png", new BMap.Size(23, 25), {
			offset: new BMap.Size(10, 25),	imageOffset: new BMap.Size(0, 0 - 10 * 25)
		});
		var myLabel = new BMap.Label(name, {
			offset: new BMap.Size(20, 0)
		});	
		var marker = new BMap.Marker(new BMap.Point(x, y), {
			icon: myIcon, label: myLabel
		});
		
		var opts = {  
			width: 0,     // 信息窗口宽度，0为自动调整
			height: 0,     // 信息窗口高度  
			title: "<span style='font-size:14px;color:#0A8021'>" + name + "</span>"  // 信息窗口标题  
		} 
		var infoWindow =new BMap.InfoWindow("<div style='line-height:1.0em;font-size:12px;'><b>内容:</b>" + content + "</br>&nbsp;", opts);  // 创建信息窗口对象，引号里可以书写任意的html语句。
		
		marker.addEventListener("dblclick", function(){
			this.openInfoWindow(infoWindow);
			clickMarker(x,y,name,content);
		});
		// marker.addEventListener("click", function(){
			// this.openInfoWindow(infoWindow);
		// });
		return marker;
	}
	function clickMarker(x,y,name,content){
		$('#NLname').val(name);
		$('#NLx').val(x);
		$('#NLy').val(y);
		thumiao.location.locationSelect = content;
	}
	
	this.delLabel = function(map,marker){
		map.removeOverlay(marker);
	}
	
	this.delAllLabels = function(map){
		map.clearOverlays();
	}
	
	this.showLabel = function(map,marker){
		map.addOverlay(marker);    //添加marker到地图上
	}
}