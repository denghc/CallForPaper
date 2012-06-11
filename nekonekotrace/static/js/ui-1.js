ThuMiao.prototype.PhoneSencha = new function(){
	this.Map1;//new news
	this.initBool = false;
	this.store;
	this.list;
	this.array;
	//
	this.view;
	this.chooseaddress;
	this.addvote;
	this.init = function(){
		thumiao.status.replysAll = replysAll;
		thumiao.photo.replysAll = replysAll;
		thumiao.data.replysAll = replysAll;
		//
		thumiao.status.replyUIcall = replyUIcall;
		thumiao.photo.replyUIcall = replyUIcall;
		thumiao.data.replyUIcall = replyUIcall;
		//
        thumiao.status.newFUIcall = newFUIcall;
		thumiao.cat.catNcall = catNcall;
		thumiao.location.locationNewsAll = locationNewsAll;
		thumiao.data.catCall = catDataCall;
		//
		thumiao.vote.newFUIcall = voteNewFUIcall;
		thumiao.vote.addFcall = voteAddFcall;
		thumiao.vote.getFcall = voteGetFcall;
		thumiao.vote.voteFcall = voteVoteCall;
	}
	//------------------------------------------
	//cat list & info
	//------------------------------------------
		{
	//
	//cat news
	//
	this.catNews = function(record){
		thumiao.cat.appendNews = catAppendcall2;
		thumiao.cat.appendDone = catAppenddone2;
		if(record!=null) thumiao.cat.catSelect = record.data.id;
		thumiao.PhoneSencha.array = new Array();
		thumiao.cat.news2(thumiao.cat.catSelect);
	}
	function catAppendcall2(id,data){
		thumiao.PhoneSencha.array.push(getData2(data));
	}
	function catAppenddone2(id){
		var list = Ext.getCmp('thu_catNewsList');
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: thumiao.PhoneSencha.array
		});
		//var temps = list.getStore();
		//if(temps!=null) temps.removeAll();
		list.setStore(store);
		list.refresh();
		thumiao.PhoneSencha.array = null;
	}
	//
	//cat list
	//
	this.catListName;
	this.buttonCatList = function(listname){
		//thumiao.cat.catSelect = -1;
		this.catListName = listname;
		thumiao.cat.all(buttonCatListCall);
	}
	this.buttonCatFocusList = function(id,listname){
		//thumiao.cat.catSelect = -1;
		this.catListName = listname;
		thumiao.cat.focuses(id,buttonCatListCall);
	}
	function buttonCatListCall(result){
		thumiao.PhoneSencha.array = new Array();
		$.each(result,function(id,data){
			thumiao.PhoneSencha.array.push({id:data['id'],name:data['name'], words:data['content'],userimage:data['headurl']});
		});
		var tempn = thumiao.PhoneSencha.catListName;
		if(tempn == 'thu_catListNews'){
			thumiao.PhoneSencha.array.push({id:-1,name:thumiao.userName, words:'我以地球人的身份发布',userimage:thumiao.userImg});
		}
		var list = Ext.getCmp(tempn);
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    //sorters: 'name',
		    getGroupString : function(record) {
		        //return record.get('firstName')[0];
		    },
		    data: thumiao.PhoneSencha.array
		});
		var temps = list.getStore();
		if(temps!=null) temps.removeAll();
		list.setStore(store);
		list.refresh();
		thumiao.PhoneSencha.array = null;
	}
	//
	//view cat & focus
	//
	this.viewCatID;
	this.viewCatInit = false;
	this.viewCat = function(id){
		if(this.viewCatInit == false){
			this.viewCatInit = true;
			//Ext.getCmp('thu_cat_focus').addListener('change',catFocusChange);
		}
		thumiao.cat.catSelect = id;
		this.viewCatID = id;
		thumiao.cat.get(id,viewCatCall);
		thumiao.cat.imps(id,catImpsCall);
	}
	this.canChange = false;
	function catFocusChange(data1){
		if(thumiao.PhoneSencha.canChange)
			thumiao.PhoneSencha.focusCat();
	}
	this.focusCat = function(){
		thumiao.cat.focus(this.viewCatID,focusCatCall);
	}
	function focusCatCall(result){

	}
	function viewCatCall(data){
        thumiao.PhoneSencha.catInfo = data;
//		var items = Ext.getCmp('thu_catInfo').getItems().items[1].items.items;
//		var sex = "未知";
//		if(data['sex'] == 0) sex="可爱的母猫";
//		else if(data['sex'] == 1) sex="威风的公猫";
//		items[0].setValue(sex);
//		items[1].setValue(data['birthday']);
//		items[2].setValue(data['intro']);
//		if(data['focus'] == 1){
//			Ext.getCmp('thu_cat_focus').setValue(1);
//		}
//		else{
//			Ext.getCmp('thu_cat_focus').setValue(0);
//		}
		thumiao.PhoneSencha.canChange = true; 
		//
//		$('#thumiao_catinfo_name').html(data['name']);
//		$('#thumiao_catinfo_img').attr('src',data['headurl']);
	}
	function catImpsCall(result){
        return;
		var list = Ext.getCmp('thu_catimplist');
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: result,
		});
		var temps = list.getStore();
		if(temps!=null) temps.removeAll();
		list.setStore(store);
		list.refresh();
	}
	this.catImp = function(){
		var o = Ext.getCmp('thu_catimptext');
		var temp = o.getValue();
		if(temp == "") return;
		thumiao.cat.imp(this.viewCatID,temp,this.catImpCall);
		o.setValue('');
	}
	this.catImpCall = function(result){
		thumiao.cat.imps(thumiao.PhoneSencha.viewCatID,catImpsCall);
	}
	//
	//new cat
	//
	this.cImageInit = false;
	this.catImageInit = function(){
		this.allClear(true,true);
		//return;//-return
		if(this.cImageInit == false){
			this.cImageInit = true;
			var temp = $('#thu_catNewImage');
			temp.css('position','relative');
			var file = '<input class="NFile" id="CatNNFile" name="file" type="file" accept="image/*"/>';
			temp.append(file);
			$('#CatNNFile').change(function(){
				var fileInput = document.getElementById('CatNNFile');
				var file = fileInput.files[0];
				Ext.getCmp('thu_catImage').setValue(file.name);
			});
		}
	}
	this.cNewImage = function(){
		if(this.cImageInit == true) return;
		var options ={quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI,sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY};
		navigator.camera.getPicture(
			cNewImageCall,
			function(message){ 
				alert('get picture failed'); 
			},
			options
		);
	}
	function cNewImageCall(uri){
		thumiao.PhoneSencha.imageURI = uri;
		window.resolveLocalFileSystemURI(uri, onCResolveSuccess, onCResolveFail);
	}
	function onCResolveSuccess(fileEntry){
        thumiao.PhoneSencha.imageName = fileEntry.name;
		Ext.getCmp('thu_catImage').setValue(fileEntry.name);
  	}
	function onCResolveFail(evt){
        alert(evt.target.error.code);
    }	
	this.newCat = function(){
		thumiao.cat.catName = Ext.getCmp('thu_catnewname').getValue();
		thumiao.cat.catIntro = Ext.getCmp('thu_catnewintro').getValue();
		var sex = Ext.getCmp('thu_catnewsex').getValue();
		switch(sex){
			case '公':sex = 0;break;
			case '母':sex = 1;break;
			default:sex = 2;
		}
		thumiao.cat.catSex = sex;
		//
		if(thumiao.cat.catName == "") return;
		//
		if(this.cImageInit == true){
			thumiao.cat.newF('CatNNFile');
		}
		else{
			thumiao.cat.newF([this.imageURI,this.imageName]);
		}
	}
	function catNcall(result){
		thumiao.cat.all(buttonCatListCall);
	}
		}
	//
	//cat in map
	//
		{
	this.catInfo = null;
	this.buttonCatMap = function(){
		this.mapInitFunc();
		Ext.getCmp('thu_locationSelect').setTitle('查看活动路线');
		Ext.getCmp('thu_newLocationName').setHidden(true);
		Ext.getCmp('thu_newLocationOK').setHidden(true);
		this.justView = true;
		//
		thumiao.cat.appendNews = catAppendcall;
		thumiao.cat.appendDone = catAppenddone;
		thumiao.map.delAllLabels(this.Map1);
		thumiao.cat.catList[this.catInfo.id].mapList = new Array();
		thumiao.cat.news2(this.catInfo.id);
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
	function catAppenddone(id){
		$.each(thumiao.cat.catList[id].mapList,function(id,data){
			if(data != null){
				thumiao.map.addLabel(thumiao.PhoneSencha.Map1,data);
			}
		});
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
	function smallDiv(data){
		var newstype = parseInt(data.newstype);
		var newsid = parseInt(data.newsid);
		
		if(newstype==0) data['action']='发布了照片';
		else if(newstype==1) data['action']='发布了状态';
		else if(newstype==4) data['action']='发布了数据';

		data['onclick']='thumiao.PhoneSencha.smallClick('+newsid+')';
		var dressed = thumiao.dress.dress('smalldiv',data);
		return dressed;
	}
	this.smallClick = function(newsid){
		this.view.push(9);
		this.seecataddress.hide();
		thumiao.news.get(newsid,function(result){
			var temp = getData2(result);
			var record = {'data':temp}; 
			thumiao.PhoneSencha.oneNews(record);
			Ext.getCmp('thu_oneNewsInfo').hide();
			
		});
	}
	//
	//cat data
	//
	this.catDs = [null,null];
	this.catDDs = new Array();
	this.catDstr = ['Length','Weight']
	this.CICatData = function(){
		//thumiao.data.cat(this.viewCatID);
	}
	function catDataCall(s,result){
		if(s){
			for(var i=0;i<2;i++){
				if(thumiao.PhoneSencha.catDs[i]!=null){
					thumiao.PhoneSencha.catDs[i].destroy();
					thumiao.PhoneSencha.catDs[i]=null;
				}
				thumiao.PhoneSencha.catDDs[i] = [];
			}
			if(result.length<2){
				$('.CICatDataStr').show();
				return;
			}
			//L,W
			$.each(result,function(id,data){
				thumiao.PhoneSencha.catDDs[0].push([data['time'],data['length']]);
				thumiao.PhoneSencha.catDDs[1].push([data['time'],data['weight']]);
			});		
			for(var i=0;i<2;i++){
				thumiao.PhoneSencha.catDs[i] = $.jqplot(
					'CICatData'+i, 
					[thumiao.PhoneSencha.catDDs[i]], 
					{
					    title:thumiao.PhoneSencha.catDstr[i],
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
	//-------------------------------------
	//location list
	//-------------------------------------
		{
	this.inLLadd = false;
	this.addLocation = function(){
		this.setLocation();
		this.inLLadd = true;
	}
	this.buttonLocationList = function(){
		this.list = Ext.getCmp('thu_locationList');
		this.array = new Array();
		//
		thumiao.location.all(false);
		thumiao.location.allF(locationAllF);
		this.store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    sorters: 'name',
		    data: thumiao.PhoneSencha.array
		});
		this.list.setStore(this.store);
		this.list.refresh();
		this.array = null;
	}
	function locationAllF(data){
		thumiao.PhoneSencha.array.push({
			name:data['name'],
			id:data['id'],
			x:data['x'],
			y:data['y']
		});
	}
	this.locationNews = function(record){
		thumiao.PhoneSenchaWS.locaId = record;
		thumiao.location.locationSelect = record.data.id;
		thumiao.location.news2(record.data.id);
	}
	function locationNewsAll(id,result){
		var array = new Array();
		$.each(result,function(id,data){
			array.push(getData2(data));
		});
		var list = Ext.getCmp('thu_locationNewsList');
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: array
		});
		var temps = list.getStore();
		if(temps!=null) temps.removeAll();
		list.setStore(store);
		list.refresh();
	}
		}
	//--------------------------------
	//new news
	//--------------------------------
		{
	this.buttonCatListNews = function(){
		//thumiao.cat.catSelect = -1;
		this.catListName = 'thu_catListNews';
		thumiao.cat.all(buttonCatListCall);

	}
	this.selectCatNews = function(){
		var o = Ext.getCmp('thu_catListNews').getSelected();
		o = o.items[0].data;
		//Ext.getCmp('thu_catListNewsName').setValue(o.name);
		thumiao.cat.catSelect = o.id;
	}
	this.newNews = function(){
		var result;
		if(thumiao.location.locationSelect == -1) return;
		var val = Ext.getCmp('thu_newNewsContent').getValue();
		if(val == "") return;
		//thumiao.location.locationSelect = 1;
		//val = "123";
		if(this.imageInit == true){
			var fileInput = document.getElementById('NNFile');
			result = fileInput.files.length == 0;
		}
		else{
			result = this.imageURI == null;
		}
		if(result){
			thumiao.status.val = val;
			thumiao.status.newF();
		}
		else{
			thumiao.photo.val = val;
			if(this.imageInit == false)
				thumiao.photo.newF([this.imageURI,this.imageName]);
			else
				thumiao.photo.newF('NNFile');
		}
	}
    this.newFstate = -1
    function newFUIcall(state){
        if(state){
            if(thumiao.PhoneSencha.newFstate == 1){
                thumiao.PhoneSencha.catNews(null);
            }
        }
    }
	this.imageInit = false;
	this.imageURI = null;
	this.imageName = null;
	this.newImageInit = function(location,cat){
		this.allClear(location,cat);
		return;//-return
		if(this.imageInit == false){
			this.imageInit = true;
			var temp = $('#thu_newImage');
			temp.css('position','relative');
			var file = '<input class="NFile" id="NNFile" name="file" type="file" accept="image/*"/>';
			temp.append(file);
			$('#NNFile').change(function(){
				var fileInput = document.getElementById('NNFile');
				var file = fileInput.files[0];
				Ext.getCmp('thu_newsImage').setValue(file.name);
			});
		}
	}
	this.newImage = function(){
		if(this.imageInit == true) return;
		var options ={quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI,sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY};
		navigator.camera.getPicture(
			newImageCall,
			function(message){ 
				alert('get picture failed'); 
			},
			options
		);
	}
	function newImageCall(uri){
		thumiao.PhoneSencha.imageURI = uri;
		window.resolveLocalFileSystemURI(uri, onResolveSuccess, onResolveFail);
	}
	function onResolveSuccess(fileEntry){
		thumiao.PhoneSencha.imageName = fileEntry.name;
		Ext.getCmp('thu_newsImage').setValue(fileEntry.name);
	}
	function onResolveFail(evt){
		alert(evt.target.error.code);
	}
		}
	//
	//map for new news
	//
		{
	this.NLx;
	this.NLy;
	this.mapPmarker;
	this.mapInit = false;
	this.justChoose = false;
	this.justView = false;
	function map1click(e){
		if(thumiao.PhoneSencha.justView) return;
		if(thumiao.PhoneSencha.justChoose){
			thumiao.PhoneSencha.justChoose = false;
			return;
		}
		Ext.getCmp('thu_newLocationName').setValue('');
		thumiao.PhoneSencha.NLx = e.point.lng;
		thumiao.PhoneSencha.NLy = e.point.lat;
		thumiao.map.delLabel(thumiao.PhoneSencha.Map1,thumiao.PhoneSencha.mapPmarker);
		thumiao.PhoneSencha.mapPmarker=thumiao.map.newLabel(e.point.lng,e.point.lat,"新位置",null,null);
		thumiao.map.addLabel(thumiao.PhoneSencha.Map1,thumiao.PhoneSencha.mapPmarker);
	}
	this.setLocation = function(){
		this.inLLadd = false;
		this.mapInitFunc();
		Ext.getCmp('thu_locationSelect').setTitle('查看地图');
		Ext.getCmp('thu_newLocationName').setHidden(false);
		Ext.getCmp('thu_newLocationOK').setHidden(false);
		//
		thumiao.map.delAllLabels(this.Map1);
		thumiao.location.all(false);
		thumiao.location.allF(addLfunc);
	}
	this.mapInitFunc = function (){
		if(thumiao.PhoneSencha.mapInit == false){
			var o = $('#thu_map1').parent();
			o.append('<div id="NewsLocationMap" style = "width : 100%; height: 100%;"></div>');
			$('#NewsLocationMap').height(o.height());
			thumiao.PhoneSencha.Map1 = thumiao.map.init('NewsLocationMap',map1click);
			thumiao.PhoneSencha.mapInit = true;
		}
	}
	this.nnNewL = function(){
		var name=Ext.getCmp('thu_newLocationName').getValue();
		if(name == "") return;
		var x=this.NLx;
		var y=this.NLy;
		thumiao.location.locationUIcall=addLfunc2;
		thumiao.location.newF(x,y,name);
		Ext.getCmp('thu_newLocationName').setValue('');
	}
	function addLfunc(data){
		var temp = thumiao.map.newLabel(data['x'],data['y'],data['name'],data['id'],Lfunc);
		thumiao.map.addLabel(thumiao.PhoneSencha.Map1,temp);
	}
	function addLfunc2(data){
		var temp = thumiao.map.newLabel(data['x'],data['y'],data['name'],data['id'],Lfunc);
		thumiao.map.addLabel(thumiao.PhoneSencha.Map1,temp);
		Lfunc(data['x'],data['y'],data['name'],temp);
	}
	function Lfunc(x,y,name,marker){
		if(thumiao.PhoneSencha.inLLadd){
			var id = parseInt(marker.thumiao[0]);
			var data = [];
			data['id'] = id;
			id = [];
			id['data'] = data;
			thumiao.PhoneSencha.chooseaddress.hide();
			thumiao.PhoneSencha.view.push(11);
			thumiao.PhoneSencha.locationNews(id);
			return;
		}
		Ext.getCmp('thu_locationSelect').setTitle("已选择（"+name+"）");
		thumiao.location.locationSelect = parseInt(marker.thumiao[0]);
		thumiao.map.delLabel(thumiao.PhoneSencha.Map1,thumiao.PhoneSencha.mapPmarker);
		thumiao.PhoneSencha.justChoose = true;
	}
		}
	//------------------------------------------------
	//user
	//------------------------------------------------
		{
	this.userInfo = function(){
		thumiao.user.info(thumiao.userID,userInfoCall);
	}
	function userInfoCall(data){
		var items = Ext.getCmp('thu_userInfo').getItems().items[1].items.items;
		items[0].setValue(data['RRID']);
		items[1].setValue(data['RegTime']);
		items[2].setValue(data['lasttime']);
		items[3].setValue(data['Intro']);
		$('#thumiao_userinfo_name').html(data['name']);
		$('#thumiao_userinfo_img').attr('src',data['URL']);
	}
	this.userSet = function(){
		var items = Ext.getCmp('thu_userInfo').getItems().items[1].items.items;
		var data=[];
		data['intro'] = items[3].getValue();
		thumiao.user.set(thumiao.userID,data,userInfoCall);
	}
	//
	//other user
	//
	this.curNewsUserID;
	this.viewUserInit = false;
	this.oneNewsUser = function(){
		if(this.viewUserInit == false){
			this.viewUserInit = true;
			Ext.getCmp('thu_user_focus').addListener('change',userFocusChange);
		}

		thumiao.user.info(this.curNewsUserID,function(data){
			var items = Ext.getCmp('thu_otheruserinfo').getItems().items[1].items.items;
			items[0].setValue(data['RRID']);
			items[1].setValue(data['RegTime']);
			items[2].setValue(data['lasttime']);
			items[3].setValue(data['Intro']);
			var o = Ext.getCmp('thu_user_focus');
			if(data['focus'] == 1){
				o.setValue(1);
			}
			else{
				o.setValue(0);
			}
			thumiao.PhoneSencha.canChangeU = true; 
			//
			$('#thumiao_ouserinfo_name').html(data['name']);
			$('#thumiao_ouserinfo_img').attr('src',data['URL']);
		});
		this.catListName = 'thu_otheruserfocuses';
		thumiao.cat.focuses(this.curNewsUserID,buttonCatListCall);
	}
	this.canChangeU = false;
	function userFocusChange(data1){
		if(thumiao.PhoneSencha.canChangeU)
			thumiao.user.focus(thumiao.PhoneSencha.curNewsUserID,-1,null);
	}

		}
	//-------------------------
	//news list
	//-------------------------
		{
	this.initNews = false;
	this.newsStore = null;
	this.all1 = function(){
		if(this.initNews == false){
			thumiao.news.prependNews = prependNews;
			thumiao.news.appendNews = appendNews;
			this.initNews = true;
		}
		thumiao.news.all1();
	}
	this.all0 = function(){
		thumiao.news.all0();
	}
	function getData2(data){
		var newsimage = '';
		var newsimageshow = 'none';
		var words = data['content'];
		if(data['imageurl']!=null && data['imageurl']!=" " && data['imageurl']!=""){
			newsimage = data['imageurl'];
			newsimageshow = 'block';
		}
		if(data['content']==null){
			words = data['remark'];
		}
		if(data['newstype'] == 4){
			words = '<br>体长：'+data['length']+'mm<br>体重：'+data['weight']+'g<br>健康状况：'+data['health'];
		}
		if(data['newstype'] == 5){
			words = '提问：' + data['title'];
		}
		if(data['newstype'] == 3){
			words = '投票：' + data['title'];
		}
		if(data['newstype'] == 2){
			words = '公告：' + data['title'];
		}
		data['words'] = words;
		data['newsimage'] = newsimage;
		data['newsimageshow'] = newsimageshow; 
		return data;
	}
	function appendNews(data){
		var data2 = getData2(data);
		thumiao.PhoneSencha.newsStore.add(data2);
		thumiao.PhoneSencha.newsStore.sort('newsid', 'DESC');
		var list = Ext.getCmp('thu_newsList');
		list.refresh();
	}
	function prependNews(data){
		var list = Ext.getCmp('thu_newsList');
		if(thumiao.PhoneSencha.newsStore == null && thumiao.PhoneSencha.array == null){
			thumiao.PhoneSencha.array = new Array();
		}
		if(thumiao.PhoneSencha.array!=null && thumiao.PhoneSencha.array.length == 0){
			thumiao.PhoneSencha.newsStore = Ext.create('Ext.data.Store', {
		    	model: 'null',
		    	getGroupString : function(record) {
		        //return record.get('firstName')[0];
		    	},
		    	data: thumiao.PhoneSencha.array
			});
			list.setStore(thumiao.PhoneSencha.newsStore);
			list.refresh();
			thumiao.PhoneSencha.array = null;
		}
		var data2 = getData2(data);
		if(thumiao.PhoneSencha.array != null){
			thumiao.PhoneSencha.array.push(data2);
		}
		else{
			thumiao.PhoneSencha.newsStore.add(data2);
			list.refresh();
		}
	}
		}
	//--------------------------------------
	//single news
	//--------------------------------------
		{
	this.curReplyID = -1;
	this.curNewsType;
	this.curNewsID;
	this.curRecord;
	this.setReplyID = function(record){
		if(record.data.newsimageshow != null){
			this.curReplyID = -1;
		}
		else{
			this.curReplyID = record.data.id;
		}
	}
	this.reply = function(){
		var o = sTypeObject(this.curNewsType);	
		o.val = Ext.getCmp('thu_comment').getValue();
		
		if(o.val == "") return;
	
		o.replyId = this.curNewsID;
		o.replyToId = this.curReplyID;
		o.reply();
	}
	function replyUIcall(id,success){
		if(success){
			thumiao.PhoneSencha.replys(thumiao.PhoneSencha.curNewsType,id);
		}
	}
	this.oneNews = function(record){
		Ext.getCmp('thu_oneNewsInfo').show();
		this.curRecord = record;
		//
		var data2 = record.data;
		this.curNewsUserID = data2.userid;
		var curUserName = data2.name;
		var curUserUserimageLink = data2.headurl;
		var curUserUserimage = '<img src="' + curUserUserimageLink + '" width="36" height="36" />';
		var curUserTplForOneNewsToolbar = '<div class="newsitem"><table width="260" border="0">  <tr>    <td width="66" rowspan="2"><div class="item-userimage-style1" align="center">' + curUserUserimage + '</div></td>    <td class="item-style1" width="318" height="34"><font face="微软雅黑">&nbsp;&nbsp;<strong>' + curUserName + '</strong></font></td>  </tr> </table></div>';
		Ext.getCmp('thu_oneNewsUser').setHtml(curUserTplForOneNewsToolbar);
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: [data2]
		});
		var o = Ext.getCmp('thu_oneNews');
		var temps = o.getStore();
		if(temps!=null) temps.removeAll();
		o.setStore(store);
		o.refresh();
		this.curNewsType = data2.newstype;
		this.curNewsID = data2.id;
		this.replys(data2.newstype,data2.id);
	}
	function sTypeObject(type){
		switch(type){
			case 1:return thumiao.status;
			case 0:return thumiao.photo;
			case 4:return thumiao.data;
			//case 5:return thumiao.ask;
		}
	}
	this.replys = function(type,id){
		var o = sTypeObject(type);
		o.replys(id);
	}
	function replysAll(id,result){
		var array = [];
		$.each(result,function(id,data){
			array.push(getData3(data));
		});
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: array
		});
		var o = Ext.getCmp('thu_oneNewsReplys');
		var temps = o.getStore();
		if(temps!=null) temps.removeAll();
		o.setStore(store);
		o.refresh();
		//
		thumiao.PhoneSencha.curRecord.data['cnum'] = result.length;
		var list = Ext.getCmp('thu_newsList');
		list.refresh();
	}
	//
	//replys
	//
	function getData3(data){
		var data={
			id: data.comment,
			time: data.time,
			name: data.name,
			words: data.content,
			userimage: '<img src="' + data.headurl + '" width="40" height="40" />'
		};
		return data;
	}
		}
	this.allClear = function(location,cat){
		Ext.getCmp('thu_locationSelect').setTitle("选择地点");
		//Ext.getCmp('thu_newsImage').setValue('');	
		Ext.getCmp('thu_newNewsContent').setValue('');
		Ext.getCmp('thu_newLocationName').setValue('');
		if(location) thumiao.location.locationSelect=-1;
		//
		Ext.getCmp('thu_catnewname').setValue('');
		Ext.getCmp('thu_catnewintro').setValue('');
		Ext.getCmp('thu_catnewsex').setValue('');
		Ext.getCmp('thu_catImage').setValue('');
		this.imageURI = null;
		//
		this.curReplyID = -1;
		if(cat) thumiao.cat.catSelect = -1;
		//Ext.getCmp('thu_catListNewsName').setValue('');
		//
		Ext.getCmp('thu_newAskTopic').setValue('');
		Ext.getCmp('thu_newAskContent').setValue('');
	}
	//-----------------------------------------
	//notice
	//-----------------------------------------
	this.noticeAll = function(){
		thumiao.notice.all(noticeAllCall);
	}
	function noticeAllCall(result){
		var array = [];
		$.each(result,function(id,data){
			array.push(data);
		});
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: array,
		});
		var o = Ext.getCmp('thu_notice');
		var temps = o.getStore();
		if(temps!=null) temps.removeAll();
		o.setStore(store);
		o.refresh();
	}
	this.noticeOne = function(record){
		var data = record.data;
		$('#thumiao_notice_title').html(data['title']);
		$('#thumiao_notice_time').html(data['time']);
		$('#thumiao_notice_content').html(data['content']);
	}
	//------------------------------------------
	//vote functions
	//------------------------------------------
	//
	//new functions
	//
	this.votesArray;
	this.voteReset = function(){
		var o = Ext.getCmp('thu_vote_title').items.items[0].items.items;
		o[0].setValue('');
		o[1].setValue('');
		this.votesArray = [];
		dressVoteChoices();
	}
	this.voteCommit = function(){
		var o = Ext.getCmp('thu_vote_title').items.items[0].items.items;
		thumiao.vote.title = o[0].getValue();
		thumiao.vote.val = o[1].getValue();
		if(thumiao.vote.title == "" || this.votesArray.length <2) return;
		thumiao.vote.newF();
		//
		this.addvote.hide();
	}
	function voteNewFUIcall(state,result){
		var id = parseInt(result);
		var data = thumiao.PhoneSencha.votesArray.pop();
		thumiao.vote.val = data.value;
		thumiao.vote.add(id);
	}
	function voteAddFcall(state,result){
		var id = parseInt(result);
		var data = thumiao.PhoneSencha.votesArray.pop();
		if(typeof(data) == "undefined"){
			thumiao.PhoneSencha.voteList();
			return;
		}
		thumiao.vote.val = data.value;
		thumiao.vote.add(id);
	}
	this.choiceToDel;
	this.addChoice = function(){
		var temp = Ext.getCmp('thu_vote_add').getValue();
		if(temp=="") return false;
		this.votesArray.push({value:temp,id:this.votesArray.length});
		dressVoteChoices();
		return true;
	}
	this.deleteChoice = function(){
		this.votesArray[this.choiceToDel] = null;
		dressVoteChoices();
		return true;
	}
	function dressVoteChoices(){
		var o = Ext.getCmp('thu_vote_choice_list');
		var temp = o.getStore();
		if(temp != null) temp.removeAll();
		temp = [];
		$.each(thumiao.PhoneSencha.votesArray,function(id,data){
			if(data!=null) temp.push(data);
		});
		thumiao.PhoneSencha.votesArray = temp;
		temp = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: temp,
		});
		o.setStore(temp);
		o.refresh();
	}
	//
	//vote list functions
	//
	this.voteList = function(){
		thumiao.vote.all(voteAllCall);
	}
	function voteAllCall(result){
		var o = Ext.getCmp('thu_vote_list');
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: result,
		});
		var temps = o.getStore();
		if(temps!=null) temps.removeAll();
		o.setStore(store);
		o.refresh();
	}
	//
	//single vote functions
	//
	this.curVoteID;
	this.voteSingle = function(record){
		record = record.data;
		var o = Ext.getCmp('thu_vote_details');
		o.setHtml('<div class="vote-style1"><font face="微软雅黑">' + (record['content']==""?record['title']:record['content']) + '</font></div>');
		this.curVoteID = record.id;
		thumiao.vote.get(record.id);
	}
	function voteGetFcall(state,result){
		var o = Ext.getCmp('thu_vote_votes');
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: result,
		});
		var temps = o.getStore();
		if(temps!=null) temps.removeAll();
		o.setStore(store);
		o.refresh();
	}
	this.voteChoiceID;
	this.voteChoiceF = function(){
		thumiao.vote.vote(this.voteChoiceID);
	}
	function voteVoteCall(result){
		if(result == "Error") thumiao.PhoneSenchaWS.bubble("对不起，您已投过！");
		else thumiao.PhoneSencha.voteList();
	}
}