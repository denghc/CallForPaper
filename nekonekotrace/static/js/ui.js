var uitest = function(){
ThuMiao.prototype.RRAppUIBasic = new function(){
	this.Map1;//new news
	this.Map2;//show news
	this.Map3;//show cat
	this.mapList = new Array();
	//init functions
	this.init = function(){
		//websocket init
		thumiao.websocket.msgRoomCall = msgRoomCall;
		thumiao.websocket.askCall = askCall;
		//map init
		this.Map1 = thumiao.map.init('NewsLocationMap',map1click);
		this.Map2 = thumiao.map.init('MapNewsList',map2click);	
		this.Map3 = thumiao.map.init('CICatMapList',map3click);		
		//news init
		this.buttonNews();
		thumiao.news.appendNews = appendNews;
		thumiao.news.prependNews = prependNews;
		thumiao.news.noBigger = noBigger;
		thumiao.news.noSmaller = noSmaller;
		thumiao.news.all1();
		noBigger();
		//status init
		thumiao.status.newFUIcall = newFUIcall;
		thumiao.status.replyUIcall = replyUIcall;
		thumiao.status.replysAdd = replysAdd;
		thumiao.status.replysAll = replysAll;
		//photo init
		thumiao.photo.newFUIcall = newFUIcall;
		thumiao.photo.replyUIcall = replyUIcall_P;
		thumiao.photo.replysAdd = replysAdd_P;
		thumiao.photo.replysAll = replysAll_P;
		thumiao.photo.uploadFail = uploadFail;
		thumiao.photo.uploadCall = uploadCall;
		//ask init
		thumiao.ask.newFUIcall = newFUIcall;
		thumiao.ask.replyUIcall = replyUIcall_A;
		thumiao.ask.replysAdd = replysAdd_A;
		thumiao.ask.replysAll = replysAll_A;
		thumiao.ask.uploadFail = uploadFail_A;
		thumiao.ask.uploadCall = uploadCall_A;
		thumiao.ask.setScoreCall = setAsk_rs;
		//data init
		thumiao.data.newFUIcall = newFUIcall;
		thumiao.data.replyUIcall = replyUIcall_D;
		thumiao.data.replysAdd = replysAdd_D;
		thumiao.data.replysAll = replysAll_D;
		//cat init
		thumiao.cat.catNcall = catNcall;
		thumiao.cat.appendNews = catAppendcall;
		thumiao.cat.appendDone = catAppenddone;
		thumiao.cat.uploadFail = uploadFail_C;
		thumiao.cat.uploadCall = uploadCall_C;
		thumiao.data.catCall = catDataCall;
		//canvas init
		initCanvas();
		//all done
		$('#UI').show();
		$('#UIwait').hide();
	}
	//map functions
	{
	function map1click(e){
		$('#NLname').val('');
		thumiao.RRAppUIBasic.NLx = e.point.lng;
		thumiao.RRAppUIBasic.NLy = e.point.lat;
		thumiao.map.delLabel(thumiao.RRAppUIBasic.Map1,thumiao.RRAppUIBasic.mapPmarker);
		thumiao.RRAppUIBasic.mapPmarker=thumiao.map.newLabel(e.point.lng,e.point.lat,"新位置",null,null);
		thumiao.map.addLabel(thumiao.RRAppUIBasic.Map1,thumiao.RRAppUIBasic.mapPmarker);
		//$('#NLx').val(e.point.lng);
		//$('#NLy').val(e.point.lat);
	}
	function map2click(e){
		
	}
	function map3click(e){
		
	}
	}
	//news functions
	{
	function noSmaller(){
		$('#NewsN1').hide();
		//$('#NewsPanel').hide();
		//$('#NewsList').show();
	}
	function noBigger(){
		$('#NewsN0').hide();
		//$('#NewsPanel').hide();
		//$('#NewsList').show();
	}
	function appendNews(news){
		$('#NewsList').prepend(news);
		$('#NewsList').children().show();
	}
	function prependNews(news){
		$('#NewsList').append(news);
		$('#NewsList').children().show();
	}
	}
	//status functions
	//take care of namesapce next time!!!
	{
	function newFUIcall(success,result){
		resetMiao();
		$('#NewsContent').val('');
		$('#NewTitle').val('');
		$('#NLname').val('');
		$('#StatusReplyFSL').html("完成选择");
		$('#NewDataW').val('');
		$('#NewDataL').val('');
		$('#NewDataH').val('');
		$('#NewsCommit').html('确定');
		$('#NewPreviewPhoto').attr('src','');
		var test = $('#NNFile');
		test.replaceWith($('#NNFile').clone());
		$('#NewNews').hide();
		$('#Hold5').hide();
		$('#Hold25').hide();
		this.commitType = -1;
		//
		var data = eval('['+result+']');
		data = data[0];
		if(typeof(data) == "undefined") return;
		var wsdata={
			'id':data['id'],
			'json':data
		};
		thumiao.webSocket.ask(wsdata);
	}
	function replyUIcall(id,success){
		$('#Hold25').hide();
		if(success){
			if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
			$('#status_'+id).hide();
			$('#status_r'+id).hide();
			$('#status_r'+id).empty();
			$('#status_c'+id).val('');
			//if(id==-1) id=thumiao.RRAppUIBasic.smallDivTemp;
			thumiao.RRAppUIBasic.replys('s',id);
		}	
	}
	function replysAdd(id,data){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		$('#status_r'+id).append(data);
	}
	function replysAll(id,result){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		var temp = "回复(";
		temp += result.length + ')';
		$('#status_rn'+id).html(temp);
	}
	}
	//reuseable ones
	{
	function sTypeObject(type){
		switch(type){
			case 's':return thumiao.status;
			case 'p':return thumiao.photo;
			case 'd':return thumiao.data;
			case 'a':return thumiao.ask;
		}
	}
	function sTypeString(type){
		switch(type){
			case 's':return '#status_';
			case 'p':return '#photo_';
			case 'd':return '#data_';
			case 'a':return '#ask_';
		}
	}
	this.setRto = function(type,id){
		var o = sTypeObject(type);
		var s = sTypeString(type);
		
		o.replyToId = id;
	}
	this.replys = function(type,id){
		var o = sTypeObject(type);
		var s = sTypeString(type);
		
		var temp = $(s+id).css('display');
		if(temp!='none'){
			$(s+id).hide();
			$(s+'r'+id).hide();
			//$(s+'r'+id).empty();
			$('#CanvasControl').hide();
			return;
		}
		if(type != 'a'){
			$(s+'r'+id).empty();
		}
			
		if(id==-1) id=this.smallDivTemp;
		//only improve ask now
		if(type == 'a'){
			var replyid = parseInt($(s+'rn'+id).attr('replyid'));
			o.replys(id,replyid,0);
			thumiao.webSocket.joinRoom({'roomIdx':id});
		}
		else
			o.replys(id);
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		
		$(s+id).show();
		$(s+'r'+id).show();
		if(type=='a'){
			$('#CanvasControl').show();
			this.canvas(id);
			if(typeof(this.tempCanvases[this.canvasAskID]) == 'undefined')
				this.tempCanvases[this.canvasAskID] = new Array();
		}
	}
	this.reply = function(type,id){
		var o = sTypeObject(type);
		var s = sTypeString(type);
		
		o.val = $(s+'c'+id).val();
		
		if(o.val == "") return;
		$('#Hold25').show();
		
		if(id==-1) id=this.smallDivTemp;
		o.replyId = id;
		o.reply();
	}
	}
	//photo
	{
	function replyUIcall_P(id,success){
		$('#Hold25').hide();
		if(success){
			if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
			$('#photo_'+id).hide();
			$('#photo_r'+id).hide();
			$('#photo_r'+id).empty();
			$('#photo_c'+id).val('');
			//if(id==-1) id=thumiao.RRAppUIBasic.smallDivTemp;
			thumiao.RRAppUIBasic.replys('p',id);
		}	
	}
	function replysAdd_P(id,data){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		$('#photo_r'+id).append(data);
	}
	function replysAll_P(id,result){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		var temp = "回复(";
		temp += result.length + ')';
		$('#photo_rn'+id).html(temp);
	}
	function uploadFail(xhr,error){
		$('#Hold25').hide();
	}
	function uploadCall(myXhr){
		$('#Hold25').show();
		if(myXhr.upload){
        	myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
        }
	}
	function progressHandlingFunction(e){
	    if(e.lengthComputable){
	        $('#Hold25p').attr({value:e.loaded,max:e.total});
	    }
	}
	this.adjustP = function(id,url){
		if(url==" "){
			$(id).attr('src',url);
			return;
		}
		var img = new Image();
		img.onload = function(){
			var x = $(id);
			x.attr('src',url);
			var w = img.width;
			var h = img.height;
			if(w>508)
			{
			    x.width(508);
			}
		}
		img.src = url;
	}	
	}
	//ask
	{
	function msgRoomCall(data){
		data = data.json;
		var dress = thumiao.dress.dress('askreply',data);
		var id=data.askid;
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		$('#ask_r'+id).prepend(dress);
		var o = $('#ask_rn'+id);
		var t = parseInt(o.attr('replys'));
		t += result.length;
		o.attr('replys',t);
		var temp = "回复(" + t + ')';
		o.html(temp);
		o.attr('replyid',data['id']);
	}
	function askCall(data){
		thumiao.news.all0();
	}
	function replyUIcall_A(id,success){
		$('#Hold25').hide();
		if(success){
			if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
			$('#ask_c'+id).val('');
			if(false){
				$('#ask_'+id).hide();
				$('#ask_r'+id).hide();
				//$('#ask_r'+id).empty();	
				//if(id==-1) id=thumiao.RRAppUIBasic.smallDivTemp;
				thumiao.RRAppUIBasic.replys('a',id);
			}
			else{
				result = eval(success);
				var data = result[0];
				var wsdata={
					'roomIdx':data['askid'],
					'id':data['id'],
					'json':data
				};
				thumiao.webSocket.reply(wsdata);
			}	
		}	
	}
	function replysAdd_A(id,data,type){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		if(type == 0)
			$('#ask_r'+id).prepend(data);
		else
			$('#ask_r'+id).append(data);
	}
	function replysAll_A(id,result,type){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		var o = $('#ask_rn'+id);
		var t = parseInt(o.attr('replys'));
		t += result.length;
		o.attr('replys',t);
		var temp = "回复(" + t + ')';
		o.html(temp);
		if(result.length>0){
			if(type==0){
				t = result[result.length-1]['id'];
				o.attr('replyid',t);
			}
			else{
				t = result[0]['id'];
				o.attr('replyid',t);
			}
		}
	}
	function uploadFail_A(xhr,error){
		$('#Hold25').hide();
	}
	function uploadCall_A(myXhr){
		$('#Hold25').show();
		if(myXhr.upload){
        	myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
        }
	}
	this.tempCanvases = new Array();
	this.initARS = function(id,score,editable){
		editable = (editable == thumiao.userID);
		var o = $('#ask_rs'+id);
		for(var i=0;i<6;i++){
			o.append(dressARS(id,i,editable));
		}
		setAsk_rs(id,score);
		//
		var canvas = o.attr('canvas');
		canvas = eval(canvas);
		thumiao.canvas.draw(canvas);
		this.tempCanvases[this.canvasAskID].push(canvas);
	}
	function dressARS(id,score,editable){
		var tempid='id="ask_rs'+id+'_'+score+'" ';
		var temp="<span class='AskRS' "+tempid;
		if(editable == 1){
			temp+="onclick='thumiao.RRAppUIBasic.setARS(";
			temp += id+","+score+")'";
		}
		temp += ">"+score+"</span>";
		return temp;
	}
	function setAsk_rs(id,score){
		$('#ask_rs'+id+' > .AskRS').css('border-width',0);
		var o=$('#ask_rs'+id+'_'+score);
		o.css('border-width',1);
		return;
		var temp = o.css('border-width');
		if(temp == '0px'){
			o.css('border-width',1);
		}
		else{
			o.css('border-width',0);
		}
	}
	this.setARS = function(id,score){
		thumiao.ask.setScore(id,score);
	}
	}
	//data
	{
	function replyUIcall_D(id,success){
		$('#Hold25').hide();
		if(success){
			if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
			$('#data_'+id).hide();
			$('#data_r'+id).hide();
			$('#data_r'+id).empty();
			$('#data_c'+id).val('');
			//if(id==-1) id=thumiao.RRAppUIBasic.smallDivTemp;
			thumiao.RRAppUIBasic.replys('d',id);
		}	
	}
	function replysAdd_D(id,data){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		$('#data_r'+id).append(data);
	}
	function replysAll_D(id,result){
		if(thumiao.RRAppUIBasic.smallDivTemp!=-1) id=-1;
		var temp = "回复(";
		temp += result.length + ')';
		$('#data_rn'+id).html(temp);
	}
	}
	//others
	{
	function panelsHide(){
		$('#NewNews').hide();
		$('#MapPanel').hide();
		$('#CatInfoPanel').hide();
		$('#SmallSPanel').hide();
		$('#Hold5').hide();
		$('#Hold15').hide();
	}
	this.showLocalImage = function(type) {
		var fileS,imgS;
		switch(type){
			case 'c':fileS='CICatNFile';imgS='#CICatViewPimg';break;
			case 'n':fileS='NNFile';imgS='#NewPreviewPhoto';break;
		}
		var fileInput = document.getElementById(fileS);
		var file = fileInput.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			$(imgS).attr('src',e.target.result);
		}
		reader.readAsDataURL(file);
	}
	this.adjustImg = function(id,width,height)
	{
		var image = $(id);
		//image.height('auto');
		//image.width('auto');
		var w = image.width();
		var h = image.height();
		if(image.width()>width)
		{
		    image.width(width);
		    image.height('auto');
		}
		if(image.height()>height)
		{
		    image.height(height);
		    image.width('auto');
		}
	}
	}
	//up bar functions
	this.buttonNews = function(){
		panelsHide();
	}
	//cat info panels
	{
		//new cat and view cat
		{
	this.buttonCat = function(){
		resetCat();
		$('#CICatList').empty();
		$('#Hold25').show();
		thumiao.cat.all(ciCatDress);
		$('#CICatPanel').hide();
	}
	function ciCatDress(data){
		$('#CICatPanel').show();
		$('#Hold25').hide();
		$.each(data,function(id,Data){
			Data['onclick']='thumiao.RRAppUIBasic.ciSetCat('+Data.id+')';
			$('#CICatList').append(thumiao.dress.dress('cat',Data));
		});		
	}
	this.ciSetCat = function(id){
		thumiao.cat.get(id,ciSetCatcall);
		$('#CICatPanel').hide();
		//
		$('#CICatNFile').hide();
		$('#CICatNName').hide();
		$('#CICatNSex').hide();
		$('#CICatNIntro').hide();
		$('#CICatN').hide();
		$('#CICatName').show();
		$('#CICatSex').show();
		$('#CICatIntro').show();
		$('#CICatM').show();
		$('#CInfoMap').show();
		$('#CInfoData').show();
		//
		$('#CICatViewPanel').show();
	}
	this.CatInfo = null;
	function ciSetCatcall(data){
		thumiao.RRAppUIBasic.CatInfo = data;
		$('#CICatName').html(data.name);
		$('#CICatSexF').hide();
		var temp = "性别：";
		switch(data.sex){
			case 2:temp+='未知';break;
			case 1:temp+='雄性';break;
			case 0:temp+='雌性';break;
		}
		$('#CICatSex').html(temp);
		$('#CICatIntro').html(data.intro);
		$('#CICatViewPimg').attr('src',data.headurl);
	}
	this.ciclose = function(){
		panelsHide();
		$('#CICatList').empty();
		thumiao.cat.reset();
	}
	this.newCat = function(){
		$('#CICatPanel').hide();
		//
		$('#CICatNFile').show();
		$('#CICatNName').show();
		$('#CICatNSex').show();
		$('#CICatNIntro').show();
		$('#CICatN').show();
		$('#CICatName').hide();
		$('#CICatSex').html('性别：');
		$('#CICatSexF').show();
		$('#CICatIntro').hide();
		$('#CICatM').hide();
		$('#CInfoMap').hide();
		$('#CInfoData').hide();
		$('#CICatViewPimg').attr('src',"");
		//
		$('#CICatViewPanel').show();
	}
	this.newCatF = function(){
		thumiao.cat.catName = $('#CICatNName').val();
		thumiao.cat.catIntro = $('#CICatNIntro').val();
		thumiao.cat.catSex = 2;
		if($('#radioM').attr('checked')){
			thumiao.cat.catSex = 1;
		}
		if($('#radioF').attr('checked')){
			thumiao.cat.catSex = 0;
		}
		//
		if(thumiao.cat.catName == "") return;
		thumiao.cat.newF('CICatNFile');
	}
	function uploadFail_C(xhr,error){
		$('#Hold25').hide();
	}
	function uploadCall_C(myXhr){
		$('#Hold25').show();
		if(myXhr.upload){
        	myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
        }
	}
	function catNcall(result){
		if(result!='Error!'){
			var test = $('#CICatNFile');
			test.replaceWith($('#CICatNFile').clone());
			$('#CICatNName').val('');
			$('#CICatNIntro').val('');
			$('#radioU').attr('checked',true);
			thumiao.RRAppUIBasic.buttonCat();
		}
	}
	function resetCat(){
		panelsHide();
		$('#CICatPanel').hide();
		$('#CICatViewPanel').hide();
		$('#CICatMapPanel').hide();
		$('#CICatDataPanel').hide();
		$('#CatInfoPanel').show();
		$('#Hold5').show();
	}
	this.backSelect = function(){
		$('#CICatPanel').show();
		$('#CICatViewPanel').hide();
	}
	this.backCatInfo = function(){
		$('#CICatMapPanel').hide();
		$('#CICatDataPanel').hide();
		$('#CICatViewPanel').show();
	}
		}
	this.modifyCat = function(){
		alert("Not supoort!");
	}
		//cat in map
		{
	this.CICatMap = function(){
		$('#CICatMapPanel').show();
		$('#CICatViewPanel').hide();
		thumiao.map.delAllLabels(this.Map3);
		thumiao.cat.catList[this.CatInfo.id].mapList = new Array();
		thumiao.cat.news2(this.CatInfo.id)
	}
	function catAppenddone(id){
		$.each(thumiao.cat.catList[id].mapList,function(id,data){
			if(data != null){
				thumiao.map.addLabel(thumiao.RRAppUIBasic.Map3,data);
			}
		});
	}
	function catAppendcall(id,data){
		if(data.location == undefined){
			return;
		}
		var loca = parseInt(data.location)-1;
		if(thumiao.cat.catList[id].mapList[loca] == null){
			var x = thumiao.location.locationList[loca].x;
			var y = thumiao.location.locationList[loca].y;
			var name = thumiao.location.locationList[loca].name +'(1)';
			var temp = thumiao.map.newLabel(x,y,name,data,mapTestCat);
			thumiao.cat.catList[id].mapList[loca] = temp;
		}
		else
		{
			thumiao.cat.catList[id].mapList[loca].thumiao.push(data);
			var name = thumiao.location.locationList[loca].name;
			var count = thumiao.cat.catList[id].mapList[loca].thumiao.length;
			var temp = name+'('+count+')';
			thumiao.cat.catList[id].mapList[loca]._config.label.content = temp;
		}
	}
	function mapTestCat(x,y,name,marker){
		if(marker.infoWindow == null){
			var temp = "";
			$.each(marker.thumiao,function(id,data){
				temp += smallDiv(data);
			})
			name = marker._config.label.content;
			temp = thumiao.map.infoWindow(name,temp);
			marker.infoWindow = temp;
		}
		marker.openInfoWindow(marker.infoWindow);
	}
		}
		//cat in data
		{
	this.catDs = [null,null];
	this.catDDs = new Array();
	this.catDstr = ['Length','Weight']
	this.CICatData = function(){
		$('#CICatViewPanel').hide();
		$('#CICatDataPanel').show();
		$('.CICatDataStr').hide();
		thumiao.data.cat(this.CatInfo.id);
	}
	function catDataCall(s,result){
		if(s){
			for(var i=0;i<2;i++){
				if(thumiao.RRAppUIBasic.catDs[i]!=null){
					thumiao.RRAppUIBasic.catDs[i].destroy();
					thumiao.RRAppUIBasic.catDs[i]=null;
				}
				thumiao.RRAppUIBasic.catDDs[i] = [];
			}
			if(result.length<2){
				$('.CICatDataStr').show();
				return;
			}
			//L,W
			$.each(result,function(id,data){
				thumiao.RRAppUIBasic.catDDs[0].push([data['time'],data['length']]);
				thumiao.RRAppUIBasic.catDDs[1].push([data['time'],data['weight']]);
			});		
			for(var i=0;i<2;i++){
				thumiao.RRAppUIBasic.catDs[i] = $.jqplot(
					'CICatData'+i, 
					[thumiao.RRAppUIBasic.catDDs[i]], 
					{
					    title:thumiao.RRAppUIBasic.catDstr[i],
					    axes:{
					        xaxis:{
					            renderer:$.jqplot.DateAxisRenderer,
					            tickOptions:{
					            	angle: -30
					            },//formatString:'%Y-%m-%d %H:%M:%S'
					        }
					    },
					    series:[{lineWidth:4, markerOptions:{style:'square'}}],
					    highlighter:{
					      show: true,
					      showMarker:false,
					      tooltipAxes: 'xy',
					      yvalues: 4,
					      formatString:'<table class="jqplot-highlighter"> \
					      <tr><td>date:</td><td>%s</td></tr> \
					      <tr><td>value:</td><td>%s</td></tr> </table>'
					    }
					}
				);
			}
		}
	}
		}
	}
	//user info panels
	this.buttonUser = function(){
		//alert('Not support!');
	}
	//map panel functions
	{
	this.buttonMap = function(){
		panelsHide();
		thumiao.map.delAllLabels(this.Map2);
		$('#MapPanel').show();
		$('#Hold5').show();
		this.mapPtest();
	}
	this.mapPclose = function(){
		panelsHide();
	}
	this.mapPmarker;
	this.mapPtest = function(){
		thumiao.RRAppUIBasic.mapList = new Array();
		thumiao.news.allFunc(mapPtestf);
		$.each(thumiao.RRAppUIBasic.mapList,function(id,data){
			if(data != null){
				thumiao.map.addLabel(thumiao.RRAppUIBasic.Map2,data);
			}
		});
	}
	function mapPtestf(data){
		if(data.location == undefined){
			return;
		}
		var loca = parseInt(data.location)-1;
		if(loca < 0) return;
		if(thumiao.RRAppUIBasic.mapList[loca] == null){
			var x = thumiao.location.locationList[loca].x;
			var y = thumiao.location.locationList[loca].y;
			var name = thumiao.location.locationList[loca].name +'(1)';
			var temp = thumiao.map.newLabel(x,y,name,data,mapPtestd);
			thumiao.RRAppUIBasic.mapList[loca] = temp;
		}
		else
		{
			thumiao.RRAppUIBasic.mapList[loca].thumiao.push(data);
			var name = thumiao.location.locationList[loca].name;
			var count = thumiao.RRAppUIBasic.mapList[loca].thumiao.length;
			var temp = name+'('+count+')';
			thumiao.RRAppUIBasic.mapList[loca]._config.label.content = temp;
		}
	}
	function mapPtestd(x,y,name,marker){
		if(marker.infoWindow == null){
			var temp = "";
			$.each(marker.thumiao,function(id,data){
				temp += smallDiv(data);
			})
			name = marker._config.label.content;
			temp = thumiao.map.infoWindow(name,temp);
			marker.infoWindow = temp;
		}
		marker.openInfoWindow(marker.infoWindow);
	}
	}
	//small div functions
	{
	this.smallDivTemp=-1;
	function smallDiv(data){
		var newstype = parseInt(data.newstype);
		var newsid = parseInt(data.newsid);
		
		if(newstype==0) data['action']='发布了照片';
		else if(newstype==1) data['action']='发布了状态';
		else if(newstype==4) data['action']='发布了数据';
		
		data['onclick']='thumiao.RRAppUIBasic.smallDivOpen('+newsid+')';
		var dressed = thumiao.dress.dress('smalldiv',data);
		return dressed;
	}
	this.smallDivOpen = function(newsid){
		thumiao.news.get(newsid,function(result){
			thumiao.RRAppUIBasic.smallDivTemp=result['id'];
			result['id']=-1;
			$('#SmallScontent').empty();
			$('#SmallScontent').html(thumiao.dress.dressNews(result));
			$('#SmallSPanel').show();
			$('#Hold15').show();
		});
	}
	this.smallSclose = function(){
		$('#SmallSPanel').hide();
		$('#Hold15').hide();
		this.smallDivTemp=-1;
	}
	}
	//down bar functions
	{
	this.commitType = -1;
	function resetMiao(){
		panelsHide();
		$('#NewNewsTdiv').hide();
		$('#NewsCatPanel').hide();
		$('#NewsContentPanel').hide();
		$('#NewsLocationPanel').hide();
		$('#NewNews').show();
		$('#Hold5').show();
		
	}
	this.nnclose = function(){
		panelsHide();
		$('#NewsCatList').empty();
		thumiao.status.reset();
		thumiao.photo.reset();
		newFUIcall(true);
	}
	this.buttonMiao = function(){
		resetMiao();
		$('#NewsCatList').empty();
		$('#Hold25').show();
		thumiao.cat.all(nnCatDress);
		$('#NewsCatPanel').hide();
		//
		$('#NewNewsPdiv').hide();
		$('#NewNewsSdiv').show();
		$('#NewNewsRendiv').show();
		$('#NewsPD').hide();
		this.commitType = 1;
	}
	function nnCatDress(data){
		$('#Hold25').hide();
		$('#NewsCatPanel').show();
		$.each(data,function(id,Data){
			Data['onclick']='thumiao.RRAppUIBasic.setCat('+Data.id+')';
			$('#NewsCatList').append(thumiao.dress.dress('cat',Data));
		});
	}
	this.setCat = function(id){
		thumiao.cat.catSelect= id;
		$('#NewsCatPanel').hide();
		$('#NewsContentPanel').show();
		if(id!=-1){
			var temp = "请输入猫（";
			temp += thumiao.cat.catList[id].data.name;
			temp += "）的数据：";
		}		
		$('#NewsPDTitle').html(temp);
	}
	this.setLocation = function(){
		$('#NewsContentPanel').hide();
		thumiao.map.delAllLabels(this.Map1);
		thumiao.location.all(false);
		thumiao.location.allF(addLfunc);
		$('#NewsLocationPanel').show();
	}
	this.NLx;
	this.NLy;
	this.nnNewL = function(){
		var name=$('#NLname').val();
		var x=this.NLx;//$('#NLx').val();
		var y=this.NLy;//$('#NLy').val();
		thumiao.location.locationUIcall=addLfunc2;
		thumiao.location.newF(x,y,name);
	}
	function addLfunc(data){
		var temp = thumiao.map.newLabel(data['x'],data['y'],data['name'],data['id'],Lfunc);
		thumiao.map.addLabel(thumiao.RRAppUIBasic.Map1,temp);
	}
	function addLfunc2(data){
		var temp = thumiao.map.newLabel(data['x'],data['y'],data['name'],data['id'],Lfunc);
		thumiao.map.addLabel(thumiao.RRAppUIBasic.Map1,temp);
		Lfunc(data['x'],data['y'],data['name'],temp);
	}
	function Lfunc(x,y,name,marker){
		$('#StatusReplyFSL').html("完成选择（"+name+"）");
		//$('#NLname').val(name);
		//$('#NLx').val(x);
		//$('#NLy').val(y);
		thumiao.location.locationSelect = parseInt(marker.thumiao[0]);
		thumiao.map.delLabel(thumiao.RRAppUIBasic.Map1,thumiao.RRAppUIBasic.mapPmarker);
	}
	//tag functions
	{
	this.nnNewT = function(){
		var name=$('#NewTag').val();
		thumiao.tag.tagUIcall=addLfunc2_T;
		thumiao.tag.newF(name);
		$('#NewTag').val('');
	}
	function addLfunc_T(data){
		$('#NNTagList').append(getT(data));
	}
	function addLfunc2_T(data){
		$('#NNTagList').append(getT(data));
	}
	this.dressTags = function(id,tags){
		$.each(tags,function(ide,datae){
			var temp = parseInt(datae);
			if(temp > thumiao.tag.tagList.length){
				thumiao.tag.all(false);
			}
			temp = thumiao.tag.tagList[temp-1]['name'];
			temp = '<label class="NNTagLabel">'+temp+'</label>';
			$('#ask_t'+id).append(temp);
		});
		//$('#ask_s'+id).remove();
	}
	function getT(data){
		var temp = '<label class="NNTagLabel" id="nntag';
		temp+=data['id']+'" onclick="thumiao.RRAppUIBasic.setT(';
		temp+=data['id']+')">'+data['name']+'</label>';
		return temp;
	}
	this.setT = function(id){
		var t = $('#nntag'+id);
		var temp = t.css('background-color');
		if(temp=='rgb(255, 248, 215)'){
			t.css('border-color','#FFF8D7');
			t.css('background-color','#FFA54F');
		}
		else{
			t.css('border-color','#FFA54F');
			t.css('background-color','#FFF8D7');
		}
		thumiao.tag.addTag(id);
	}
	}
	this.backContent = function(){
		$('#NewsLocationPanel').hide();
		$('#NewsContentPanel').show();
	}
	this.buttonPhoto = function(){
		resetMiao();
		$('#NewsCatList').empty();
		$('#Hold25').show();
		thumiao.cat.all(nnCatDress);
		$('#NewsCatPanel').hide();
		//
		$('#NewNewsPdiv').show();
		$('#NewNewsSdiv').show();
		$('#NewNewsRendiv').show();
		$('#NewsPD').hide();
		this.commitType = 0;
	}
	this.buttonAsk = function(){
		resetMiao();
		$('#NewNewsTdiv').show();
		$('#NewsCatPanel').hide();
		$('#NewsContentPanel').show();
		$('#NewNewsPdiv').show();
		$('#NewNewsSdiv').show();
		$('#NewsPD').hide();
		this.commitType = 5;
		//
		$('#NNTagList').empty();
		thumiao.tag.reset();
		thumiao.tag.all(false);
		thumiao.tag.allF(addLfunc_T);
	}
	this.buttonData = function(){
		resetMiao();
		$('#NewsCatList').empty();
		$('#Hold25').show();
		thumiao.cat.all(nnCatDress);
		$('#NewsCatPanel').hide();
		//
		$('#NewNewsPdiv').hide();
		$('#NewNewsSdiv').hide();
		$('#NewNewsRendiv').hide();
		$('#NewsPD').show();
		this.commitType = 4;
	}
	this.commitStatus = function(){
		thumiao.status.val = $('#NewsContent').val();
		if(thumiao.status.val == null || thumiao.status.val == "") return;
		if(thumiao.location.locationSelect == -1) return;
		$('#Hold25').show();
		thumiao.status.newF();
	}
	this.commitPhoto = function(){
		var fileInput = document.getElementById('NNFile');
		var file = fileInput.files[0];
		thumiao.photo.val = $('#NewsContent').val();
		if(thumiao.photo.val==null || file==null) return;
		thumiao.photo.title = $('#NewTitle').val();
		thumiao.photo.newF('NNFile');
	}
	this.commitAsk = function(){
		var fileInput = document.getElementById('NNFile');
		var file = fileInput.files[0];
		thumiao.ask.val = $('#NewsContent').val();
		if(thumiao.ask.val=="" && typeof(file)=="undefined") return;
		thumiao.ask.title = $('#NewTitle').val();
		thumiao.ask.newF('NNFile');
	}
	//new data
		{
	this.commitData = function(){
		thumiao.data.val = $('#NewDataH').val();
		thumiao.data.weight = $('#NewDataW').val();
		thumiao.data.length = $('#NewDataL').val();
		if(thumiao.location.locationSelect == -1) return;
		if(thumiao.data.val == "" || thumiao.data.weight == "" || thumiao.data.length == ""){
			$('#NewsCommit').html('确定（请填全数据）');
			return;
		}
		$('#Hold25').show();
		thumiao.data.newF();
	}
		}
	this.commit = function(){
		switch(this.commitType){
			case 0:this.commitPhoto();break;
			case 1:this.commitStatus();break;
			case 4:this.commitData();break;
			case 5:this.commitAsk();break;
		}
	}
	}//down bar
	//canvas
	this.canvasAskID;
	this.canvas = function(id){
		thumiao.canvas.initCanvas("ask_can"+id);
		this.canvasAskID = id;
	}
	function initCanvas(){
		var colors=['#000000','#FFFFFF',
		'#555555','#AAAAAA',
		'#FF0000','#00FF00','#0000FF',
		'#00FFFF','#FF00FF','#FFFF00'];
		var o = $('#CanvasColors');
		for(var i=0;i<10;i++){
			var x = (i%5)*20;
			var y = (i>=5?1:0)*20;
			o.append(initColor(colors[i],x,y))
		}
		thumiao.RRAppUIBasic.setColor('#000000');
		//
		var widths=[1,2,4,8,16];
		o = $('#CanvasWidths');
		for(var i=0;i<5;i++){
			var x = i*20;
			o.append(initWidth(widths[i],x,0))
		}
		thumiao.RRAppUIBasic.setWidth(1);
	}
	function initColor(color,x,y){
		var style="style='background-color:"+color;
		style+=";top:"+y+"px;left:"+x+"px;' ";
		color = "'"+color+"'";
		var onclick="onclick=thumiao.RRAppUIBasic.setColor("+color+") ";
		var temp="<div class='CanvasColor' "+style+onclick;
		temp+="></div>";
		return temp;
	}
	this.setColor = function(color){
		$('#CanvasColorS').val(color);
		this.colorOnChange();
	}
	this.colorOnChange = function(){
		var temp = $('#CanvasColorS').val();
		thumiao.canvas.color = temp;
		$('#CanvasColorShow').css('background-color',temp);
	}
	function initWidth(width,x,y){
		var style="style='top:"+y+"px;left:"+x+"px;' ";
		var onclick="onclick=thumiao.RRAppUIBasic.setWidth("+width+") ";
		var temp="<div class='CanvasColor' "+style+onclick;
		temp+=">"+width+"</div>";
		return temp;
	}
	this.setWidth = function(color){
		$('#CanvasWidthS').val(color);
		this.widthOnChange();
	}
	this.widthOnChange = function(){
		var temp = parseInt($('#CanvasWidthS').val());
		thumiao.canvas.width = temp;
		$('#CanvasWidthShow').css('border-bottom-width',temp);
	}
	this.clearCanvas = function(){
		thumiao.canvas.clear();
		thumiao.canvas.array = new Array();
	}
	this.undoCanvas = function(){
		thumiao.canvas.clear();
		if(thumiao.canvas.array!=null) thumiao.canvas.array.pop();
		thumiao.canvas.draw(thumiao.canvas.array);
	}
	this.reCanvas = function(){
		$.each(this.tempCanvases[this.canvasAskID],function(id,data){
			thumiao.canvas.draw(data);
		});
	}
}
thumiao.RRAppUIBasic.init();
}
