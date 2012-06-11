//all that related to web socket are moved here
ThuMiao.prototype.PhoneSenchaWS = new function(){
	this.bubblePanel;
	this.bubble = function(str){
		this.bubblePanel.setHtml(str);
		this.bubblePanel.show();
		setTimeout(bubbleHide,3000);
	}
	function bubbleHide(){
		thumiao.PhoneSenchaWS.bubblePanel.hide();
	}
	//---------------------------------
	//location functions
	//---------------------------------
	this.usersLocation = [];
	function loginCall(data){
		if(data.ret!=1){
			thumiao.PhoneSenchaWS.bubble("登录失败。。。");
			return;
		}	
		$.each(data.list,function(id,data){
			thumiao.PhoneSenchaWS.usersLocation[data.userid] = data;
		})
	}
	this.showUsersLocation = function(){
		thumiao.PhoneSencha.mapInitFunc();
		Ext.getCmp('thu_locationSelect').setTitle('查看在线用户');
		Ext.getCmp('thu_newLocationName').setHidden(true);
		Ext.getCmp('thu_newLocationOK').setHidden(true);
		thumiao.PhoneSencha.justView = true;
		//
		thumiao.map.delAllLabels(thumiao.PhoneSencha.Map1);
		$.each(thumiao.PhoneSenchaWS.usersLocation,function(id,data){
			if(data['location'] != -1 && data['userid'] != thumiao.userID){
				var label = thumiao.map.newLabel(data.x,data.y,data.name,data.userid,label1click);
				thumiao.map.addLabel(thumiao.PhoneSencha.Map1,label);
			}
		});
	}
	function label1click(x,y,name,marker){
		thumiao.PhoneSencha.chooseaddress.hide();
		thumiao.PhoneSencha.view.push(16);
		thumiao.PhoneSencha.curNewsUserID = marker.thumiao[0];
		thumiao.PhoneSencha.oneNewsUser();
	}
	this.locaId;
	this.locButton = function(){
		var data = this.locaId.data;
		var wsdata={
			'id':data['id'],
			'x':data['x'],
			'y':data['y'],
			'locname':data['name'],
		};
		thumiao.webSocket.location(wsdata);
	}
	function locationCall(data){
		if(data['userid']==thumiao.userID) return;
		var locid = data['location'];
		if(locid != -1){
			if(locid > thumiao.location.locationList.length){
				thumiao.location.all(false);
			}
			data['locname'] = thumiao.location.locationList[locid-1].name;
		}
		var o = Ext.getCmp('thu_toggles').items.items[1].getValue()[0];
		if(o==1){ 
			var str = "用户："+data['name']+" 在 "+data['locname']+" 签到了！";
			thumiao.PhoneSenchaWS.bubble(str);
		}
		thumiao.PhoneSenchaWS.usersLocation[data.userid] = data;
	}
	//------------------------------------------
	//ask reply functions
	//------------------------------------------
	this.clearCanvas = function(){
		thumiao.canvas.clear();
		thumiao.canvas.array = new Array();
		this.canvasDrawBG();
	}
	this.undoCanvas = function(){
		thumiao.canvas.clear();
		if(thumiao.canvas.array!=null) thumiao.canvas.array.pop();
		this.canvasDrawBG();
		thumiao.canvas.draw(thumiao.canvas.array);
	}
	this.isShowBG = true;
	this.showBG = function(){
		if(this.isShowBG){
			this.isShowBG = false;
			Ext.getCmp('thu_showBG').setText('显示背景');
		}
		else{
			this.isShowBG = true;
			Ext.getCmp('thu_showBG').setText('隐藏背景');
		}
		thumiao.canvas.clear();
		this.canvasDrawBG();
		thumiao.canvas.draw(thumiao.canvas.array);
	}
	this.canvasReplyTo = -1;
	this.CanvasReplyTo = null;
	this.canvasDrawBG = function(){
		if(this.isShowBG == false) return;
 		if(this.canvasReplyTo == -2){
 			$.each(this.askArrays[this.curAsk],function(id,data){
 				if(data.replytoid == -1){
 					thumiao.canvas.draw(data.canvas);
 				}
 			});
		}
		else if(this.canvasReplyTo == -1){
			thumiao.canvas.draw(this.CanvasReplyTo);
		}
		else{
			var temp = thumiao.ask.getCanvasList(this.askArrays[this.curAsk],this.canvasReplyTo,0);
			var i = temp.length-1;
			for(;i>=0;i--)
				thumiao.canvas.draw(temp[i]);
			thumiao.canvas.draw(this.CanvasReplyTo);
		}
	}
	//-------------------------------
	//draw tools functions
	//-------------------------------
	this.canvasInit = false;
	this.canvasToolsInit = false;
	this.canvasReply = function(id,canvas,toid){
		if(this.canvasInit == false){
			this.canvasInit = true;
			thumiao.thisEnv = 0;//-return
			thumiao.canvas.initCanvas('thu_canvas');
			//thumiao.thisEnv = 1;
		}
		this.canvasReplyTo = toid;
		this.CanvasReplyTo = canvas;
		this.curReplyId = id;
		thumiao.canvas.clear();
		this.canvasDrawBG();
	}
	this.canvasTools = function(){
		if(this.canvasToolsInit == false){
			$('#thu_drawtcolors').append(getInnerDiv('CanvasColors',300,200));
			$('#thu_drawtwidths').append(getInnerDiv('CanvasWidths',300,50));
			initCanvasTools();
			this.canvasToolsInit = true;
		}
	}
	function getInnerDiv(name,w,h){
		var temp = '<div style="margin:0 auto;position:relative;width:'+w+'px;height:'+h+'px;" id='+name+'></div>';
		temp = '<div style="width:100%;height:100%;">'+temp+'</div>';
		return temp;
	}
	function initCanvasTools(){
		var colors=[
		'#FF0000','#00FF00','#0000FF',
		'#00FFFF','#FF00FF','#FFFF00',
		'#AA5555','#55AA55','#5555AA',
		'#55AAAA','#AA55AA','#AAAA55',
		'#550000','#005500','#000055',
		'#005555','#550055','#555500',
		'#000000','#555555',
		'#AAAAAA','#FFFFFF',
		];
		var o = $('#CanvasColors');
		for(var i=0;i<22;i++){
			var x = (i%6)*50;
			var y = parseInt(i/6)*50;
			o.append(initColor(colors[i],x,y))
		}
		var style="style='top:150px;left:250px;' ";
		var temp="<div id='CanvasColorShow' class='thu_CanvasColor' "+style+"></div>";
		o.append(temp);
		thumiao.PhoneSenchaWS.setColor('#000000');
		//
		var widths=[1,2,4,8,16];
		o = $('#CanvasWidths');
		for(var i=0;i<5;i++){
			var x = i*50;
			o.append(initWidth(widths[i],x,0))
		}
		thumiao.PhoneSenchaWS.setWidth(1);
		style="style='top:-25px;left:250px;' ";
		temp="<div id='CanvasWidthShow' class='thu_CanvasColor' "+style+"></div>";
		o.append(temp);
	}
	function initColor(color,x,y){
		var style="style='background-color:"+color;
		style+=";top:"+y+"px;left:"+x+"px;' ";
		color = "'"+color+"'";
		var onclick="ontouchstart=thumiao.PhoneSenchaWS.setColor("+color+") ";
		var temp="<div class='thu_CanvasColor' "+style+onclick;
		temp+="></div>";
		return temp;
	}
	this.setColor = function(color){
		Ext.getCmp('thu_drawtcolor').setValue(color);
		this.colorOnChange();
	}
	this.colorOnChange = function(){
		var temp = Ext.getCmp('thu_drawtcolor').getValue();
		thumiao.canvas.color = temp;
		$('#CanvasColorShow').css('background-color',temp);
	}
	function initWidth(width,x,y){
		var style="style='top:"+y+"px;left:"+x+"px;' ";
		var onclick="ontouchstart=thumiao.PhoneSenchaWS.setWidth("+width+") ";
		var temp="<div class='thu_CanvasColor' "+style+onclick;
		temp+=">"+width+"</div>";
		return temp;
	}
	this.setWidth = function(color){
		Ext.getCmp('thu_drawtwidth').setValue(color);
		this.widthOnChange();
	}
	this.widthOnChange = function(){
		var temp = Ext.getCmp('thu_drawtwidth').getValue();
		thumiao.canvas.width = temp;
		$('#CanvasWidthShow').css('border-bottom-width',temp);
	}
	//-------------------------------
	//ask tag functions
	//-------------------------------
	this.isFocusTags;
	this.nnNewTag = function(){
		var o = Ext.getCmp('thu_newTagName');
		var name = o.getValue();
		if(name == "") return;
		thumiao.tag.tagUIcall = addLfunc_T;
		thumiao.tag.newF(name);
		o.setValue('');
	}
	this.dressTags = function(tags){
		var ret = "";
		$.each(tags,function(ide,datae){
			var temp = parseInt(datae);
			if(temp > thumiao.tag.tagList.length){
				thumiao.tag.all(false);
			}
			temp = thumiao.tag.tagList[temp-1]['name'];
			temp = '<label class="thu_NNTagLabel">'+temp+'</label>';
			ret+=temp;
		});
		return ret;
	}
	this.setTags = function(){
		thumiao.tag.reset();
		thumiao.tag.all(false);
		$('#thu_tags').empty();
		thumiao.tag.allF(addLfunc_T);
		if(this.isFocusTags){
			thumiao.tag.focuses(focusesCall);
		}
	}
	function focusesCall(result){
		$.each(result,function(id,data){
			thumiao.PhoneSenchaWS.setT(data);
		});
	}
	function addLfunc_T(data){
		$('#thu_tags').append(getT(data));
	}
	function getT(data){
		var temp = '<label class="thu_NNTagLabel" id="nntag';
		temp+=data['id']+'"';
		if(thumiao.PhoneSenchaWS.isFocusTags == false){
			temp+=' ontouchstart="thumiao.PhoneSenchaWS.setT(';
			temp+=data['id']+')"';
		}
		else{
			temp+=' ontouchstart="thumiao.PhoneSenchaWS.setFocusT(';
			temp+=data['id']+')"';
		}
		temp+='>'+data['name']+'</label>';
		return temp;
	}
	this.setT = function(id){
		var t = $('#nntag'+id);
		var temp = t.css('background-color');
		if(temp=='rgb(255, 255, 255)'){
			t.css('background-color','#C2C2C2');
		}
		else{
			t.css('background-color','#FFFFFF');
		}
		thumiao.tag.addTag(id);
	}
	this.setFocusT = function(id){
		var t = $('#nntag'+id);
		var temp = t.css('background-color');
		if(temp=='rgb(255, 255, 255)'){
			t.css('background-color','#C2C2C2');
		}
		else{
			t.css('background-color','#FFFFFF');
		}
		thumiao.tag.focus(id);
	}
	//------------------------------
	//ask functions
	//------------------------------
	this.noBigger = false;
	this.curAsk = -1;
	this.curReplyId = -1;
	this.askArrays = new Array;
	this.askList = function(){
		if(this.noBigger) return;
		this.noBigger = true;
		thumiao.ask.asks(0,0,0);
	}
	function asksCall(data){
		var list = Ext.getCmp('thu_askList');
		var store = list.getStore();
		var array = [];
		for(var i=data.length-1;i>=0;i--){
			array.push(getAskData(data[i]));
		};
		store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    //sorters: 'id',
		    data: array
		});
		store.sort('id', 'DESC');
		list.setStore(store);
		list.refresh();
	}
	function getAskData(data){
		data['tags'] = eval(data['tags']);
		return {
			id: data['id'],
			time: data['time'],
			launcher: data['name'],
			launcherimage:data['headurl'],
			comments: data['cnum'],
			topic:data['title'],
			detail: data['remark'],
			tags:thumiao.PhoneSenchaWS.dressTags(data['tags']),
			rawtags:data['tags'],
			userid:data['userid'],
			value:0,
		};
	}
	this.focusArray=null;
	this.focusSort = function(){
		thumiao.tag.focuses(function(result){
			thumiao.PhoneSenchaWS.focusArray = new Array();
			$.each(result,function(id,data){
				thumiao.PhoneSenchaWS.focusArray[data] = true;
			});
			thumiao.PhoneSenchaWS.sort();
		});
	}
	this.sortType=0;
	this.sort = function(){
		var store = Ext.getCmp('thu_askList').getStore();
		store.each(function(record){
			var type = thumiao.PhoneSenchaWS.sortType;
			if(type == 0){
				record.data.value = record.data.id;
			}
			else if(type == 1){
				record.data.value = (record.data.userid==thumiao.userID?1:0);
			}
			else if(type == 2){
				var o = thumiao.PhoneSenchaWS.focusArray;
				record.data.value = 0;
				$.each(record.data.rawtags,function(id,data){
					if(o[data] == true){
						record.data.value+=1;
					}
				});
			}
		});
		store.sort('value','DESC');
		Ext.getCmp('thu_askList').refresh();
	}
	//--------------------------------
	//ask replys functions
	//--------------------------------
	this.setAskCur = function(record){
		this.curAsk = record.data['id'];
		//
		var o = Ext.getCmp('thu_askOne');
		var temps = o.getStore();
		if(temps!=null) temps.removeAll();
		temps = Ext.create('Ext.data.Store', {
		    model: 'null',
		    //sorters: 'id',
		    data: [record.data]
		});
		o.setStore(temps);
		o.refresh();
		o = Ext.getCmp('thu_askTop');
		temps = '<div class="newsitem"><table width="480" border="0">  <tr>    <td width="66" rowspan="2"><div class="item-userimage-style1" align="center"><img src="' + record.data.launcherimage + '" width="36" height="36" /></div></td>    <td class="topic-style1" width="318" height="34"><font face="微软雅黑"><strong>' + record.data.topic + '</strong></font><font face="微软雅黑" size="2">&nbsp;&nbsp;——' + record.data.launcher + '</font></td>  </tr> </table></div>';
		o.setHtml(temps);
		//
		thumiao.webSocket.joinRoom({'roomIdx':this.curAsk});
		if(this.askArrays[this.curAsk]==null){
			thumiao.ask.replys(this.curAsk,-1,0);
		}
		else{
			var temp=new Array();
			$.each(this.askArrays[this.curAsk],function(id,data){
				temp.push(getData3(data));
			});
			var o = Ext.getCmp('thu_askReplys');
			var temps = o.getStore();
			if(temps!=null) temps.removeAll();
			temps = Ext.create('Ext.data.Store', {
			    model: 'null',
			    //sorters: 'id',
			    data: temp
			});
			temps.sort('id', 'DESC');
			o.setStore(temps);
			o.refresh();
		}
	}
	function replysAll(id,result,type){
		thumiao.PhoneSenchaWS.askArrays[id] = result;
		$.each(result,function(id,data){
			data.canvas = eval(data.canvas);
		});
		var temp=new Array();
		$.each(result,function(id,data){
			temp.push(getData3(data));
		});
		var o = Ext.getCmp('thu_askReplys');
		var temps = o.getStore();
		if(temps!=null) temps.removeAll();
		temps = Ext.create('Ext.data.Store', {
		    model: 'null',
		    //sorters: 'id',
		    data: temp
		});
		temps.sort('id', 'DESC');
		o.setStore(temps);
		o.refresh();
	}
	function getData3(data){
		var data={
			id: data.id,
			time: data.time,
			name: data.name,
			words: data.content,
			userimage: data.headurl,
			replytoid:data.replytoid,
			canvas:data.canvas,
		};
		return data;
	}
	this.getCanvasList = function(record){
		var result = thumiao.ask.getCanvasList(this.askArrays[this.curAsk],22,0);	
	}
	this.askReply = function(){
		thumiao.ask.replyId = this.curAsk;
		thumiao.ask.replyToId = this.curReplyId;
		thumiao.ask.val = Ext.getCmp('thu_askreply').getValue();
		if(thumiao.ask.val == "") return;
		thumiao.PhoneSencha.view.pop();
		thumiao.ask.reply();
		this.askClear();
	}
	this.askClear= function(){
		thumiao.canvas.clear();
		Ext.getCmp('thu_askreply').setValue('');
	}
	function replyUIcall(id,result){
		result = eval(result);
		var data = result[0];
		var wsdata={
			'roomIdx':thumiao.PhoneSenchaWS.curAsk,
			'id':data['id'],
			'json':data
		};
		thumiao.webSocket.reply(wsdata);
	}
	function msgRoomCall(data){
		data = data.json;
		data.canvas = eval(data.canvas);
		if(data['askid'] == thumiao.PhoneSenchaWS.curAsk){
			var t = Ext.getCmp('thu_askReplys');
			s = t.getStore();
			s.add(getData3(data));
			s.sort('id', 'DESC');
			t.refresh();
		}
		var o = Ext.getCmp('thu_toggles').items.items[4].getValue()[0];
		if(o==1)
			thumiao.PhoneSenchaWS.bubble(data.name+' 回复到：'+data.content);
	}
	//-------------------------------------
	//new ask functions
	//-------------------------------------
	function askCall(data){
		var list = Ext.getCmp('thu_askList');
		var store = list.getStore();
		if(store == null){
			return;
			store = Ext.create('Ext.data.Store', {
			    model: 'null',
			});
			list.setStore(store);
		}
		store.add(getAskData(data.json));
		thumiao.PhoneSenchaWS.sort();
		list.refresh();
		var o = Ext.getCmp('thu_toggles').items.items[3].getValue()[0];
		if(o==1)
			thumiao.PhoneSenchaWS.bubble(data.json.name + " 提了新问题：" + data.json.title);
	}
	this.newAsk = function(){
		var topic = Ext.getCmp('thu_newAskTopic').getValue();
		var content = Ext.getCmp('thu_newAskContent').getValue();
		if(content == "" || topic == "") return false;
		thumiao.ask.val = content;
		thumiao.ask.title = topic;
		thumiao.ask.newF("notexist");
		return true;
	}
	
	function newFUIcall(success,result){
		thumiao.PhoneSencha.allClear();
		var data = eval('['+result+']');
		data = data[0];
		var wsdata={
			'id':data['id'],
			'json':data
		};
		thumiao.webSocket.ask(wsdata);
	}
	//------------------------------
	//message functions
	//------------------------------
	this.moreMsg = function(){
		thumiao.user.messages(this.curFocus,this.focusStores[this.curFocus]['min']);
	}
	this.curFocus = -1;
	this.setCurFocus = function(record){
		var temp = record.data['id'];
		thumiao.PhoneSenchaWS.curFocus = temp;
		var store = thumiao.PhoneSenchaWS.focusStores[temp];
		if(typeof(store) != "undefined"){
			var list = Ext.getCmp('thu_focusMsgList');
			list.setStore(store['store']);
			list.refresh();
		}
	}
	this.focusStores = new Array();
	this.initF = function(){
		thumiao.websocket.msgToCall = msgToCall;
		thumiao.websocket.msgRoomCall = msgRoomCall;
		thumiao.websocket.askCall = askCall;
		thumiao.websocket.locationCall = locationCall;
		thumiao.websocket.loginCall = loginCall;
		thumiao.websocket.closeCall = closeCall;
		thumiao.websocket.joinCall = joinCall;
		thumiao.websocket.leaveCall = leaveCall;
		thumiao.user.messageCall = messageCall;
		thumiao.user.messagesCall = messagesCall;
		thumiao.ask.asksCall = asksCall;
		thumiao.ask.replyUIcall = replyUIcall;
		thumiao.ask.newFUIcall = newFUIcall;
		thumiao.ask.replysAll = replysAll;
	}
	function closeCall(data){
		thumiao.PhoneSenchaWS.bubble("你已从其他地方上线！请注意只能从一处登录！");
	}
	function leaveCall(data){
		var o = Ext.getCmp('thu_toggles').items.items[0].getValue()[0];
		if(o==1) 
			thumiao.PhoneSenchaWS.bubble("用户："+data.name+" 下线");
	}
	function joinCall(data){
		if(data.userid == thumiao.userID) return;
		var o = Ext.getCmp('thu_toggles').items.items[0].getValue()[0];
		if(o==1) 
			thumiao.PhoneSenchaWS.bubble("用户："+data.name+" 上线");
	}
	function messagesCall(id,data){
		$.each(data,function(id,data){
			msgCall(data);
		});
	}
	function messageCall(id,data){
		var wsdata={
			'to':id,
			'id':data['id'],
			'json':data,
		};
		thumiao.webSocket.message(wsdata);
		msgCall(data);
	}
	function msgToCall(data){
		var o = Ext.getCmp('thu_toggles').items.items[2].getValue()[0];
		if(o==1)
			thumiao.PhoneSenchaWS.bubble(data.json.name + " 对你说：" + data.json.content);
		msgCall(data.json);
	}
	function msgCall(data){
		var store;
		var toid = parseInt(data['toid']);
		if(toid == thumiao.userID)
			toid = parseInt(data['fromid']);
		store = thumiao.PhoneSenchaWS.focusStores[toid];
		if(typeof(store) == "undefined"){
			//
			//important here
			//
			thumiao.user.focus(toid,-1,thumiao.PhoneSenchaWS.getFocusList);

			thumiao.PhoneSenchaWS.focusStores[toid] = [];
			thumiao.PhoneSenchaWS.focusStores[toid]['store'] = Ext.create('Ext.data.Store', {
			    model: 'null',
			    //data: array
			});
			thumiao.PhoneSenchaWS.focusStores[toid]['min'] = 99999;
		}
		if(thumiao.PhoneSenchaWS.focusStores[toid]['min'] > data['id'])
			thumiao.PhoneSenchaWS.focusStores[toid]['min'] = data['id'];
		store = thumiao.PhoneSenchaWS.focusStores[toid]['store'];
		store.add(getMsgData(data));
		store.sort('id','DESC');
		var cur = thumiao.PhoneSenchaWS.curFocus;
		if(cur==toid){
			var list = Ext.getCmp('thu_focusMsgList');
			list.setStore(store);
			list.refresh();
		}	
	}
	function getMsgData(data){
		var mine = "left";
		if(data['fromid'] == thumiao.userID) mine = "right";
		var ret = {
			id: data['id'],
			time: data['time'],
			read: '1',
			mineornot: mine,
			words: data['content']
		};
		return ret;
	}
	this.send = function(){
		var val = Ext.getCmp('thu_msgText').getValue();
		if(val == "") return;
		thumiao.user.message(this.curFocus,val);
		Ext.getCmp('thu_msgText').setValue('');
	}
	//----------------------------------
	//focus & list functions
	//----------------------------------
	this.rridfocus = function(){
		var o = Ext.getCmp('thu_addfocustext');
		var rrid = parseInt(o.getValue());
		thumiao.user.focus(-1,rrid,this.getFocusList);
		o.setValue('');
	}
	this.getFocusList = function(){
		thumiao.user.focuses(getFocusListCall);
	}
	this.focusListName;
	function getFocusListCall(result){
		var array = new Array();
		$.each(result,function(id,data){
			if(data['id'] == thumiao.userID) return;
			array.push(getFocusListData(data));
		})
		var store = Ext.create('Ext.data.Store', {
		    model: 'null',
		    data: array
		});
		var list = Ext.getCmp(thumiao.PhoneSenchaWS.focusListName).setStore(store);
		list.refresh();
	}
	function getFocusListData(data){
		var temp = thumiao.PhoneSenchaWS.focusStores[data['id']];
		if(temp == null){
			thumiao.PhoneSenchaWS.focusStores[data['id']] = data;
			var array = [];
    		//
			data['store'] = Ext.create('Ext.data.Store', {
			    model: 'null',
			    data: array
			});
			data['min'] = 99999;
		}
		else{
			temp = thumiao.PhoneSenchaWS.focusStores[data['id']];
			data['store'] = temp['store'];
			data['min'] = temp['min'];
			thumiao.PhoneSenchaWS.focusStores[data['id']] = data;
		}
		var ret = {
			id:data['id'],
			count:0,
			unreadCount:0,
			name:data['name'],
			time:data['lasttime'],
			userimage:data['URL']
		};
		return ret;
	}
}