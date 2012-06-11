function ThuMiao(){
	this.thisEnv;
    this.userID;
    this.userName;
    this.userImg;
    this.userType;
    this.userTime;
	this.webBase = "http://127.0.0.1:8000/";//"../../";//
	this.webSocket;
	this.init = function(){
		//init parameters
		var maxNewsID = parseInt($('#Init').attr('maxNewsID'));
		this.news.maxID = maxNewsID+1;
		this.news.minID = maxNewsID;
		this.userID = parseInt($('#Init').attr('userID'));
		this.userName = $('#Init').attr('userName');
		this.userImg = $('#Init').attr('userImg');
		this.userType = $('#Init').attr('userType');
		this.userTime = $('#Init').attr('userTime');
		this.thisEnv = parseInt($('#Init').attr('thisEnv'));
		$('#Init').remove();
		//data init
		thumiao.location.all(false);
		thumiao.tag.all(false);
		//websocket init
		this.webSocket = new WSclient(this.webBase);
		thumiao.websocket.init(this.webSocket);
		this.webSocket.connect();
		//modify BMap
		if(typeof(BMap) != 'undefined')
			BMap.Marker.prototype.thumiao = new Array();
		//csrf???
		$(document).ajaxSend(function(event, xhr, settings) {
		    function getCookie(name) {
		        var cookieValue = null;
		        if (document.cookie && document.cookie != '') {
		            var cookies = document.cookie.split(';');
		            for (var i = 0; i < cookies.length; i++) {
		                var cookie = jQuery.trim(cookies[i]);
		                // Does this cookie string begin with the name we want?
		                if (cookie.substring(0, name.length + 1) == (name + '=')) {
		                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                    break;
		                }
		            }
		        }
		        return cookieValue;
		    }
		    function sameOrigin(url) {
		        // url could be relative or scheme relative or absolute
		        var host = document.location.host; // host + port
		        var protocol = document.location.protocol;
		        var sr_origin = '//' + host;
		        var origin = protocol + sr_origin;
		        // Allow absolute or scheme relative URLs to same origin
		        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		            // or any other URL that isn't scheme relative or absolute i.e relative.
		            !(/^(\/\/|http:|https:).*/.test(url));
		    }
		    function safeMethod(method) {
		        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
		    }
		
		    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
		        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		    }
		});
		//dress init
		this.dress.init();
	}
	this.setGetStr = function(sub){
		var ret = this.webBase+sub;
		ret+='/?';
		//add renren here
		return ret;
	}
	function WSclient(host)
	{
		var m_Host = host.lastIndexOf(':');
		m_Host = host.substring(0,m_Host)+':8080';
		var m_Events = [];
		var m_Error = "";
		var socket;
		var self = this;	
		var bindEvent = function(){
			for(var e in m_Events){
				socket.on(e, m_Events[e]);
			}
		}
		var setError = function(err){
			m_Error = err;
		}		
		this.getError = function(){
			return m_Error;
		}
		this.connect = function(){
			if(!("io" in window)){
				setError("io not defined");
				return false;
			}
			socket = io.connect(m_Host);
			bindEvent();
			this.emit("login",{
				'id':thumiao.userID,
				'time':thumiao.userTime,
			});
			thumiao.userTime = null;
			return true;
		}
		this.emit = function(type,data){
			socket.emit(type,data);
		}
		this.on = function(event, callback){
			m_Events[event] = callback;
			return self;
		}
		//emit functions below
		this.message = function(data){
			socket.emit('message',data);
		}
		this.reply = function(data){
			socket.emit('reply',data);
		}
		this.ask = function(data){
			socket.emit('ask',data);
		}
		this.joinRoom = function(data){
			socket.emit('joinRoom',data);
		}
		this.location = function(data){
			socket.emit('location',data);
		}
	}
}
ThuMiao.prototype.websocket = new function(){
	this.msgToCall = null;//single message
	this.msgRoomCall = null;//ask reply
	this.askCall = null;//new ask
	//
	this.loginCall = null;//login 
	this.closeCall = null;//double login and forced log out
	this.joinCall = null;//some one enters
	this.leaveCall = null;//some one leaves
	//
	this.joinRoomCall = null;
	this.leaveRoomCall = null;
	this.locationCall = null;
	this.init = function(client){
		client.on("login", function(data){
			if(thumiao.websocket.loginCall!=null)
				thumiao.websocket.loginCall(data);
		}).on("disconnect", function(data){
			if(thumiao.websocket.closeCall!=null)
				thumiao.websocket.closeCall(data);
		}).on("close", function(data){
			if(thumiao.websocket.leaveCall!=null)
				thumiao.websocket.leaveCall(data);
		}).on("join", function(data){
			if(thumiao.websocket.joinCall!=null)
				thumiao.websocket.joinCall(data);
		}).on("joinRoom", function(data){
			if(thumiao.websocket.joinRoomCall!=null)
				thumiao.websocket.joinRoomCall(data);
		}).on("leaveRoom", function(data){
			if(thumiao.websocket.leaveRoomCall!=null)
				thumiao.websocket.leaveRoomCall(data);
		}).on("message", function(data){
			if(thumiao.websocket.msgToCall!=null)
				thumiao.websocket.msgToCall(data);
		}).on("reply", function(data){
			if(thumiao.websocket.msgRoomCall!=null)
				thumiao.websocket.msgRoomCall(data);
		}).on("ask", function(data){
			if(thumiao.websocket.askCall!=null)
				thumiao.websocket.askCall(data);
		}).on("location", function(data){
			if(thumiao.websocket.locationCall!=null)
				thumiao.websocket.locationCall(data);
		});
	}
}
ThuMiao.prototype.news = new function(){
	this.maxID=-1;//to be fetched
	this.minID=999999;
	this.newsList = new Array();
	//
	this.appendNews=null;//html as input
	this.prependNews=null;//same as above
	this.noBigger=null;//no input
	this.noSmaller=null;//no input
	this.all = function(id,type,num){
		var getStr = thumiao.setGetStr("news/all");
		getStr+="id="+id+"&type="+type+"&num="+num;
		if(type == 0){
			$.getJSON(getStr,function(result){
				allCall(result,0,id,num);
			});
		}
		else{
			$.getJSON(getStr,function(result){
				allCall(result,1,id,num);
			});
		}
	}
	this.all0 = function(){
		this.all(this.maxID,0,5);
	}
	this.all1 = function(){
		this.all(this.minID,1,5);
	}
	function allCall(result,type,id,num){
		if(result == 'Error'){
					
		}
		else{
			num = parseInt(num);
			id = parseInt(id);
			type = parseInt(type);
			if(type == 0){
				//in +id order
				//also include deleted ones? Or the server will return ten not deleted ones?
				$.each(result,function(id,data){
					if(parseInt(data.newsid) >= thumiao.news.maxID){
						var dressed = thumiao.dress.dressNews(data);
						if(dressed == null) dressed = data;
						if(thumiao.news.appendNews!=null){
							thumiao.news.appendNews(dressed);
						}
						thumiao.news.newsList.unshift(data);//at the beginning
					}				
				});	
				if(result.length>0){
					var newMax = parseInt(result[result.length-1].newsid) + 1;
					thumiao.news.maxID = newMax;
				}
				if(thumiao.news.noBigger!=null)
					thumiao.news.noBigger();		
			} 
			else{
				//in -id order
				$.each(result,function(id,data){
					if(parseInt(data.newsid) <= thumiao.news.minID){
						var dressed = thumiao.dress.dressNews(data);
						if(dressed == null) dressed = data;
						if(thumiao.news.prependNews!=null){
							thumiao.news.prependNews(dressed);
						}
						thumiao.news.newsList.push(data);//at the end
					}				
				});
				if(result.length>0){
					var newMin = result[result.length-1].newsid - 1;
					thumiao.news.minID = newMin;
				}			
				if(thumiao.news.minID < 1){
					if(thumiao.news.noSmaller != null)
						thumiao.news.noSmaller();
				}
			}
		}
	}

	this.allFunc = function(func){
		$.each(this.newsList,function(id,data){
			func(data);
		});
	}
	this.get = function(id,func){
		var getStr = thumiao.setGetStr('news/get');
		getStr+='id='+id;
		$.getJSON(getStr,function(result){
			func(result[0]);
		});
	}
}
ThuMiao.prototype.status = new function(){
	this.newFUIcall = null;//bool for success or not
	this.replyUIcall = null;//id & bool for success or not
	this.replysAdd = null;//id & html as input
	this.replysAll = null;//id & json as input
	//need to be set before xxx
	this.val = null;
	this.replyId = -1;
	this.replyToId = -1;
	this.newF = function(){
		if(thumiao.location.locationSelect == -1){
			return;
		}
		if(this.val == null || this.val == ""){
			return;
		}
		var getStr = thumiao.setGetStr('status/new');
		var x = this.val;//$('#NewsContent').val();
		getStr+='content='+x;
		getStr+='&location='+thumiao.location.locationSelect;
		x = thumiao.cat.catSelect;
		if(x<0){
			getStr+='&cat=-1&type=1';
		}
		else{
			getStr+='&type=0&cat='+x;
		}
		$.get(getStr,function(result){
			newFCall(result);
		});
	}
	function newFCall(result){
		if(result!='Error'){
			if(thumiao.status.newFUIcall != null){
				thumiao.status.newFUIcall(true);
			}
			thumiao.status.reset();
			//all right?
			thumiao.news.all0();
		}
		else{
			thumiao.status.newFUIcall(false);
		}
		
	}
	this.reply = function(){
		if(this.val == null || this.val == "" ||this.replyId == -1){
			return;
		}
		var getStr = thumiao.setGetStr('status/reply');
		getStr+="status="+this.replyId+"&content="+this.val;
		getStr+="&targetid="+this.replyToId;
		var tempid = this.replyId;
		$.get(getStr,function(result){
			replyCall(result,tempid);
		});
	}
	function replyCall(result,id){
		if(result != "Error"){
			thumiao.status.reset();
			if(thumiao.status.replyUIcall != null){
				thumiao.status.replyUIcall(id,true);
			}
		}
		else{
			thumiao.status.replyUIcall(false);
		}
	}	
	this.replys = function(id){
		var getStr = thumiao.setGetStr('status/replys');
		getStr+="num=0"+"&type=0"+"&status="+id;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		var type = 0;
		if(type == 0){
			$.getJSON(getStr,function(result){
				replysCall(result,0,id);
			});
		}
		else{
			$.getJSON(getStr,function(result){
				replysCall(result,1,id);
			});
		}
	}
	function replysCall(result,type,id){
		if(result == 'Error'){			
		}
		else{
			if(type == 0){
				$.each(result,function(i,data){
					if(thumiao.status.replysAdd != null){
						thumiao.status.replysAdd(id,thumiao.dress.dress('statusreply',data));
					}
				});
				if(thumiao.status.replysAll != null){
					thumiao.status.replysAll(id,result);
				}
			}
		}
	}
	this.reset = function(){
		thumiao.status.val = null;
		thumiao.status.replyId = -1;
		thumiao.status.replyToId = -1;
		thumiao.cat.catSelect = -1;
	}
}
ThuMiao.prototype.location = new function(){
	this.locationUIcall = null;//input json
	this.locationList = new Array();
	this.locationMax=0;
	this.locationSelect = -1;
	this.locationNewsAll = null;
	this.newF = function(x,y,name){
		var getStr = thumiao.setGetStr('location/new');
		getStr+='x='+x;
		getStr+='&y='+y;
		getStr+='&name='+name;
		$.get(getStr,function(result){
			newFCall(result);
		});
	}
	function newFCall(result){
		if(result!="Error"){
			thumiao.location.all(true);
		}
	}
	this.all = function(updateMap){
		var getStr = thumiao.setGetStr('location/all');
		getStr+= 'id='+this.locationMax;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		if(updateMap){
			$.getJSON(getStr,function(result){
				allCall(result,updateMap);
			});
		}
		else{
			$.ajax({
			  url: getStr,
			  async: false,
			  success: function(result){
				allCall(result,updateMap);
			  },
			  dataType: 'json'
			});
		}
	}
	function allCall(data,updateMap){
		var count = data.length;
		for(var i=0;i<count;i++)
		{
			//increasing order
			thumiao.location.locationList.push(data[i]);
			if(updateMap){
				if(thumiao.location.locationUIcall != null){
					thumiao.location.locationUIcall(data[i]);
				}
			}
		}
		//reset after using
		thumiao.location.locationUIcall = null;
		thumiao.location.locationMax += count;
	}
	this.allF = function(func){
		$.each(this.locationList,function(id,data){
			func(data);
		});
	}
	//lazy ...
	this.news2 = function(id){
		thumiao.location.news(id,0,2,10);
	}
	this.news = function(cat,id,type,num){
		var getStr = thumiao.setGetStr('news/location');
		getStr+='location='+cat;
		getStr+='&id='+id;
		getStr+='&type='+type;
		getStr+='&num=10';
		$.getJSON(getStr,function(result){		
			if(thumiao.location.locationNewsAll!=null){
				thumiao.location.locationNewsAll(cat,result);
			}
		});
	}
}
ThuMiao.prototype.cat = new function(){
	this.catSelect = -1;
	this.catName = null;
	this.catSex = null;
	this.catIntro = null;
	this.catNcall = null;//result as input
	this.uploadCall = null;//myXhr as input
	this.uploadFail = null;//http://www.w3school.com.cn/jquery/ajax_ajax.asp
	//outside callback for multi usage
	//it gets a json
	this.all = function(callback){
		var getStr = thumiao.setGetStr('cat/all');
		getStr+="_t=" + new Date().getTime();//in case of cache
		$.getJSON(getStr,function(result){
			if(result != "Error"){
				$.each(result,function(id,data){
					//all must before others
					if(thumiao.cat.catList[data.id] == null){
						thumiao.cat.catList[data.id] = new catInfo(data.id);
					}
					thumiao.cat.catList[data.id].data = data;
				})
				callback(result);
			}
		});
	}
	this.imp = function(id,content,callback){
		var getStr = thumiao.setGetStr('cat/imp');
		getStr+="id="+id+"&content="+content;
		$.get(getStr,function(result){
			if(callback!=null){
				callback(result);
			}
		});
	}
	this.imps = function(id,callback){
		var getStr = thumiao.setGetStr('cat/imps');
		getStr+="id="+id;
		$.getJSON(getStr,function(result){
			if(callback!=null){
				callback(result);
			}
		});
	}
	this.focus = function(id,callback){
		var getStr = thumiao.setGetStr('cat/focus');
		getStr+="id="+id;//in case of cache
		$.get(getStr,function(result){
			if(result != "Error"){
				callback(result);
			}
		});
	}
	this.focuses = function(id,callback){
		var getStr = thumiao.setGetStr('cat/focuses');
		getStr+="id="+id;//in case of cache
		$.getJSON(getStr,function(result){
			if(result != "Error"){
				$.each(result,function(id,data){
					//all must before others
					if(thumiao.cat.catList[data.id] == null){
						thumiao.cat.catList[data.id] = new catInfo(data.id);
					}
					thumiao.cat.catList[data.id].data = data;
				})
				callback(result);
			}
		});
	}
	this.reset = function(){
		this.catName = null;
		this.catSex = null;
	}
	this.get = function(id,callback){
		var getStr = thumiao.setGetStr('cat/get');
		getStr+='id='+id;
		$.getJSON(getStr,function(result){
			if(result != "Error"){
				callback(result);
			}
		});
	}
	this.newF = function(fileId){
		var result;
		if(fileId.constructor != Array){
			var fileInput = document.getElementById(fileId);
			var file = fileInput.files[0];
			result = file == null;
		}
		else {
			result = fileId[0] == null;
		}
		if(result){
			return;
		}
		if(thumiao.cat.catName=="" || thumiao.cat.catName==null){
			return;
		}
		var getStr = thumiao.setGetStr('cat/new');
		getStr+='name='+this.catName;
		getStr+='&intro='+this.catIntro;
		getStr+='&sex='+this.catSex;
		//
		if(fileId.constructor == Array){

			var type = fileId[1].substr(fileId[1].lastIndexOf('.')+1);
			type='image/'+type;
			getStr+='&type='+type;
			
			var options = new FileUploadOptions();
			options.mimeType=type;
			options.chunkedMode = false;
			
			var params = new Object();
            params.name = this.catName;
            params.intro = this.catIntro;
			options.params = params;
			var ft = new FileTransfer();
			ft.upload(fileId[0], getStr, win, fail, options);
			return;
		}
		//
		getStr+='&type='+file.type;
	    $.ajax({
	        url: getStr, 
	        type: 'POST',
	        xhr: function(){
	        	var myXhr = $.ajaxSettings.xhr();
	        	if(thumiao.cat.uploadCall!=null)
	            	thumiao.cat.uploadCall(myXhr);
	            return myXhr;
	        },
	        //Ajax events
	        //beforeSend: beforeSendHandler,
	        success: function(result){
	        	newFcall(result);
	        },
	        error: thumiao.cat.uploadFail,
	        // Form data
	        data: file,//formData,
	        //Options to tell JQuery not to process data or worry about content-type
	        cache: false,
	        contentType: false,
	        processData: false
	    });
	}
	function win(r){
		alert(r);
		newFCall(r);
	}
	function fail(error){
		if(thumiao.cat.uploadFail!=null)
			thumiao.cat.uploadFail();
		//alert(error.code);
		//alert(error.source);
		//alert(error.target);
	}
	function newFcall(result){
		if(thumiao.cat.catNcall!=null){
			thumiao.cat.catNcall(result);
		}
	}
	//news part
	{
		this.appendNews=null;//id,data as input
		this.prependNews=null;//same as above
		this.appendDone=null;//id input
		this.noBigger=null;//id input
		this.noSmaller=null;//id input
		this.catList = new Array();
		this.news0 = function(id){
			
		}
		this.news1 = function(id){
			
		}
		//lazy ...
		this.news2 = function(id){
			thumiao.cat.news(id,0,2,10);
		}
		this.news = function(cat,id,type,num){
			var getStr = thumiao.setGetStr('news/cat');
			getStr+='cat='+cat;
			getStr+='&id='+id;
			getStr+='&type='+type;
			getStr+='&num=10';
			$.getJSON(getStr,function(result){
				//lazy...
				$.each(result,function(id,data){
					if(thumiao.cat.appendNews!=null){
						thumiao.cat.appendNews(cat,data);
					}
				});
				//
				if(thumiao.cat.appendDone!=null){
					thumiao.cat.appendDone(cat);
				}
			});
		}
	}
	function catInfo(id){
		this.id = id;
		this.data = null;
		this.max = -1;
		this.min = -1;
		this.news = new Array();
		this.mapList = new Array();	
	}
}
ThuMiao.prototype.dress = new function(){
	this.style = 'basic';
	this.tagCall = null;
	var templates = {};
	this.init = function(){
		//handle android here
		if(thumiao.thisEnv == 1){
			var getStr = thumiao.setGetStr('dress/get');
			getStr += 'env=' + thumiao.thisEnv + '&style=' + this.style + '&type=';
			getStyleType(getStr,this.style,'smalldiv');
			thumiao.PhoneSencha.init();
			thumiao.PhoneSenchaWS.initF();
			return;
		} 
		$('#UI').hide();
		getStyle(this.style);
	}
	function getStyle(style){
		var getStr = thumiao.setGetStr('dress/get');
		getStr += 'env=' + thumiao.thisEnv + '&style=' + style + '&type=';
		//
		getStyleType(getStr,style,'cat');
		getStyleType(getStr,style,'smalldiv');
		getStyleType(getStr,style,'status');
		getStyleType(getStr,style,'photo');
		getStyleType(getStr,style,'data');
		getStyleType(getStr,style,'ask');
		getStyleType(getStr,style,'statusreply');
		getStyleType(getStr,style,'photoreply');
		getStyleType(getStr,style,'datareply');
		getStyleType(getStr,style,'askreply');
		getStyleType(getStr,style,'main');
	}
	//sync here?
	function getStyleType(getStr,style,type){
		// $.ajax({
		// 	url: getStr+type,
		// 	type: 'GET',
		// 	success: function(result){
		// 		getCall(result,style,type);
		// 	},
		// 	async: false,
  		// 		});
		$.get(getStr+type,function(result){
			getCall(result,style,type,getStr);
		});
	}
	function getCall(result,style,type,getStr){
		if(templates[style] == null){
			templates[style] = {};
		}
		templates[style][type] = new EJS({text: result});
		//
		if(type == 'main'){
			var a = {};
			a['name'] = thumiao.userName;
			a['headurl'] = thumiao.userImg;
			$('#UI').html(thumiao.dress.dress('main',a));
			getStyleType(getStr,style,'js');
		}
		if(type == 'js'){
			var temp = thumiao.dress.dress('js',{});
			if(typeof(uitest) == 'undefined'){
				eval('('+temp+')')();
			}
			else{
				uitest();
			}
		}
	}
	this.dress = function(type,data){		
		//so I put it here...
		if(typeof(data.location) != 'undefined'){
			var locid = parseInt(data['location']);
			if(locid != -1){
				if(locid > thumiao.location.locationList.length){
					thumiao.location.all(false);
				}
				data['locationname'] = thumiao.location.locationList[locid-1].name;
			}
			else
			{
				data['locationname']="未知地点";
			}	
		}
		//
		if(templates[this.style] == null){
			
		}
		else if(templates[this.style][type] == null){
			if(thumiao.thisEnv == 1){		
				return null;
			}
		}
		if(false && typeof(data.tags) != 'undefined'){
			$.each(data.tags,function(ide,datae){
				var temp = parseInt(datae);
				if(temp > thumiao.tag.tagList.length){
					thumiao.tag.all(false);
				}
				temp = thumiao.tag.tagList[temp-1]['name'];
				if(thumiao.dress.tagCall!=null){
					thumiao.dress.tagCall(data.id,data.newstype,temp);
				}
			})
		}
		return templates[this.style][type].render(data);
	}
	this.dressNews = function(data){
		var newstype = parseInt(data.newstype);
		var dressed;
		if(newstype == 1) dressed = thumiao.dress.dress('status',data);
		else if(newstype == 0) dressed = thumiao.dress.dress('photo',data);
		else if(newstype == 4) dressed = thumiao.dress.dress('data',data);
		else if(newstype == 5) dressed = thumiao.dress.dress('ask',data);
		return dressed;
	}
}
ThuMiao.prototype.map = new function(){
	this.init = function(name,func){
		if(typeof(BMap) == "undefined"){
			return;
		}
		var map = new BMap.Map(name);          // 创建地图实例
		var point = new BMap.Point(116.333, 40.0155);  // 创建点坐标
		map.centerAndZoom(point, 17);                 // 初始化地图，设置中心点坐标和地图级别
		map.setMinZoom(16);
		map.setMaxZoom(18);
		
		map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_RIGHT, type:BMAP_NAVIGATION_CONTROL_SMALL})); //放大、缩小的控件
		
		var thuSW = new BMap.Point(116.321627, 39.998077);
		var thuNE = new BMap.Point(116.343834, 40.019078);
		var thuBounds = new BMap.Bounds(thuSW, thuNE);
		//设定显示区域限制
		this.setBounds(map, thuBounds);
		//wait to be modified
		map.addEventListener("click", function(e){
			func(e);
		});
		return map;
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
	//wait to discuss
	this.newLabel = function(x, y, name, content, func){
		var myIcon = new BMap.Icon("../../static/image/markers_FromHotel.png", new BMap.Size(23, 25), {
			offset: new BMap.Size(10, 25),	imageOffset: new BMap.Size(0, 0 - 10 * 25)
		});
		var myLabel = new BMap.Label(name, {
			offset: new BMap.Size(20, 0)
		});	
		var marker = new BMap.Marker(new BMap.Point(x, y), {
			icon: myIcon, label: myLabel
		});
		marker.thumiao = new Array();
		marker.thumiao[0] = content;
		marker.addEventListener("click", function(){			
			if(func!=null) func(x,y,name,marker);
		});
		//marker.addEventListener("dblclick", function(){			
			//if(func!=null) func(x,y,name,marker);
		//});
		return marker;
	}
	
	this.delLabel = function(map,marker){
		map.removeOverlay(marker);
	}
	
	this.delAllLabels = function(map){
		map.clearOverlays();
	}
	
	this.addLabel = function(map,marker){
		map.addOverlay(marker);
	}
	
	this.infoWindow = function(title,content){
		var opts = {  
			width: 0,     // 信息窗口宽度，0为自动调整
			height: 0,     // 信息窗口高度  
			title: "<span style='font-size:14px;color:#0A8021'>" + title + "</span>"  // 信息窗口标题  
		} 
		var infoWindow =new BMap.InfoWindow("<div style='line-height:1.0em;font-size:12px;'><b>内容:</b>" + content + "</br>&nbsp;", opts);  // 创建信息窗口对象，引号里可以书写任意的html语句。
		return infoWindow;
	}
}
ThuMiao.prototype.photo = new function(){
    this.newFUIcall = null;//bool for success or not
	this.replyUIcall = null;//id & bool for success or not
	this.replysAdd = null;//id & html as input
	this.uploadCall = null;//myXhr as input
	this.uploadFail = null;//http://www.w3school.com.cn/jquery/ajax_ajax.asp
	//need to be set before xxx
	this.val = null;
	this.title = "";
	this.replyId = -1;
	this.replyToId = -1;
    this.reply = function(){
		if(this.val == null || this.val == "" ||this.replyId == -1){
			return;
		}
		var getStr = thumiao.setGetStr('photo/reply');
		getStr+="photo="+this.replyId+"&content="+this.val;
		getStr+="&targetid="+this.replyToId;
		var tempid = this.replyId;
		$.get(getStr,function(result){
			replyCall(result,tempid);
		});
	}
	function replyCall(result,id){
		if(result != "Error"){
			thumiao.photo.reset();
			if(thumiao.photo.replyUIcall != null){
				thumiao.photo.replyUIcall(id,true);
			}
		}
		else{
			thumiao.photo.replyUIcall(false);
		}
	}	
	this.replys = function(id){
		var getStr = thumiao.setGetStr('photo/replys');
		getStr+="num=0"+"&type=0"+"&photo="+id;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		var type = 0;
		if(type == 0){
			$.getJSON(getStr,function(result){
				replysCall(result,0,id);
			});
		}
		else{
			$.getJSON(getStr,function(result){
				replysCall(result,1,id);
			});
		}
	}
	function replysCall(result,type,id){
		if(result == 'Error'){			
		}
		else{
			if(type == 0){
				$.each(result,function(i,data){
					if(thumiao.photo.replysAdd != null){
						thumiao.photo.replysAdd(id,thumiao.dress.dress('photoreply',data));
					}
				});
				if(thumiao.photo.replysAll != null){
					thumiao.photo.replysAll(id,result);
				}
			}
		}
	}
	this.reset = function(){
		thumiao.photo.val = null;
		thumiao.photo.title = "";
		thumiao.photo.replyId = -1;
		thumiao.photo.replyToId = -1;
		thumiao.cat.catSelect = -1;
	}
	this.newF = function(fileId){
		var result;
		if(fileId.constructor != Array){
			var fileInput = document.getElementById(fileId);
			var file = fileInput.files[0];
			result = file == null;
		}
		else {//if(thumiao.thisEnv == 1)
			result = fileId[0] == null;
		}
		if(thumiao.location.locationSelect == -1){
			return;
		}
		if(this.val == null || result){
			return;
		}
		var getStr = thumiao.setGetStr('photo/single');
		var x = this.val;
		getStr+='content='+x;
		getStr+='&title='+this.title;
		getStr+='&location='+thumiao.location.locationSelect;
		x = thumiao.cat.catSelect;
		if(x<0){
			getStr+='&cat=-1&type=1';
		}
		else{
			getStr+='&type=0&cat='+x;
		}
		if(fileId.constructor == Array){
			var type = fileId[1].substr(fileId[1].lastIndexOf('.')+1);
			type='image/'+type;
			getStr+='&typeimg='+type;
			
			var options = new FileUploadOptions();
			options.mimeType=type;
			options.chunkedMode = false;
			
			var params = new Object();
            params.content = this.val;
			options.params = params;
			
			var ft = new FileTransfer();
			ft.upload(fileId[0], getStr, win, fail, options);
			return;
		}
		getStr+='&typeimg='+file.type;
	    $.ajax({
	        url: getStr, 
	        type: 'POST',
	        xhr: function(){
	        	var myXhr = $.ajaxSettings.xhr();
	        	if(thumiao.photo.uploadCall!=null){
	        		thumiao.photo.uploadCall(myXhr);
	        	}            
	            return myXhr;
	        },
	        //Ajax events
	        //beforeSend: beforeSendHandler,
	        success: function(result){
	        	newFCall(result);
	        },
	        error: thumiao.photo.uploadFail,
	        // Form data
	        data: file,//formData,
	        //Options to tell JQuery not to process data or worry about content-type
	        cache: false,
	        contentType: false,
	        processData: false
	    });
	}
	function win(r){
		newFCall(r);
	}
	function fail(error){
		if(thumiao.photo.uploadFail!=null)
			thumiao.photo.uploadFail();
		//alert(error.code);
		//alert(error.source);
		//alert(error.target);
	}
	//
	function newFCall(result){
		if(result!='Error'){
			if(thumiao.photo.newFUIcall != null){
				thumiao.photo.newFUIcall(true);
			}
			thumiao.photo.reset();
			//all right?
			thumiao.news.all0();
		}
		else{
			thumiao.photo.newFUIcall(false);
		}	
	}
}
ThuMiao.prototype.data = new function(){
	this.newFUIcall = null;//bool for success or not
	this.replyUIcall = null;//id & bool for success or not
	this.replysAdd = null;//id & html as input
	this.catCall = null;//bool & result as input
	//need to be set before xxx
	this.val = null;
	this.weight = null;
	this.length = null;
	this.replyId = -1;
	this.replyToId = -1;
	this.newF = function(){
		if(thumiao.location.locationSelect == -1 || thumiao.cat.catSelect == -1){
			return;
		}
		if(this.val == null ||this.length == null || this.weight == null){
			return;
		}
		if(this.val == "" ||this.length == "" || this.weight == ""){
			return;
		}
		var getStr = thumiao.setGetStr('data/new');
		var x = this.val;//$('#NewsContent').val();
		getStr+='health='+x;
		getStr+='&weight='+this.weight;
		getStr+='&length='+this.length;
		getStr+='&location='+thumiao.location.locationSelect;
		x = thumiao.cat.catSelect;
		getStr+='&cat='+x;
		$.get(getStr,function(result){
			newFCall(result);
		});
	}
	function newFCall(result){
		if(result!='Error'){
			if(thumiao.data.newFUIcall != null){
				thumiao.data.newFUIcall(true);
			}
			thumiao.data.reset();
			//all right?
			thumiao.news.all0();
		}
		else{
			thumiao.data.newFUIcall(false);
		}
		
	}
	this.reply = function(){
		if(this.val == null || this.replyId == -1){
			return;
		}
		var getStr = thumiao.setGetStr('data/reply');
		getStr+="catdata="+this.replyId+"&content="+this.val;
		getStr+="&targetid="+this.replyToId;
		var tempid = this.replyId;
		$.get(getStr,function(result){
			replyCall(result,tempid);
		});
	}
	function replyCall(result,id){
		if(result != "Error"){
			thumiao.data.reset();
			if(thumiao.data.replyUIcall != null){
				thumiao.data.replyUIcall(id,true);
			}
		}
		else{
			thumiao.data.replyUIcall(false);
		}
	}	
	this.replys = function(id){
		var getStr = thumiao.setGetStr('data/replys');
		getStr+="num=0"+"&type=0"+"&catdata="+id;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		var type = 0;
		if(type == 0){
			$.getJSON(getStr,function(result){
				replysCall(result,0,id);
			});
		}
		else{
			$.getJSON(getStr,function(result){
				replysCall(result,1,id);
			});
		}
	}
	function replysCall(result,type,id){
		if(result == 'Error'){			
		}
		else{
			if(type == 0){
				$.each(result,function(i,data){
					if(thumiao.data.replysAdd != null){
						thumiao.data.replysAdd(id,thumiao.dress.dress('datareply',data));
					}
				});
				if(thumiao.data.replysAll != null){
					thumiao.data.replysAll(id,result);
				}
			}
		}
	}
	this.reset = function(){
		thumiao.data.val = null;
		thumiao.data.weight = null;
		thumiao.data.length = null;
		thumiao.data.replyId = -1;
		thumiao.data.replyToId = -1;
		thumiao.cat.catSelect = -1;
	}
	
	this.cat = function(id){
		var getStr = thumiao.setGetStr('data/cat');
		getStr+='cat='+id;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		$.getJSON(getStr,function(result){
			if(result!='Error!'){
				if(thumiao.data.catCall!=null){
					thumiao.data.catCall(true,result);
				}
			}
			else{
				if(thumiao.data.catCall!=null){
					thumiao.data.catCall(false,result);
				}
			}
		});
	}
}
ThuMiao.prototype.ask = new function(){
    this.newFUIcall = null;//bool for success or not
	this.replyUIcall = null;//id & bool for success or not
	this.replysAdd = null;//id & html as input
	this.uploadCall = null;//myXhr as input
	this.uploadFail = null;//http://www.w3school.com.cn/jquery/ajax_ajax.asp
	this.setScoreCall = null;
	this.delCall = null;
	this.asksCall = null;
	//need to be set before xxx
	this.val = null;
	this.title = null;
	this.replyId = -1;
	this.replyToId = -1;
    this.reply = function(){
		if(this.val == null || this.val == "" ||this.replyId == -1){
			return;
		}
		var getStr = thumiao.setGetStr('ask/reply');
		getStr+="ask="+this.replyId+"&content="+this.val;
		getStr+="&targetid="+this.replyToId;
		var canvas = thumiao.canvas.arrayToStr(thumiao.canvas.array);
		var tempid = this.replyId;
		$.post(getStr,canvas,function(result){
			alert("Post Succeed!");
			replyCall(result,tempid);
		});
	}
	function replyCall(result,id){
		if(result != "Error"){
			thumiao.ask.reset();
			if(thumiao.ask.replyUIcall != null){
				thumiao.ask.replyUIcall(id,result);
			}
		}
		else{
			thumiao.ask.replyUIcall(id,false);
		}
	}
	this.replys = function(id,replyid,type){
		var getStr = thumiao.setGetStr('ask/replys');
		getStr+="num=0"+"&type="+type+"&ask="+id+"&replyid="+replyid;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		if(type == 0){
			$.getJSON(getStr,function(result){
				replysCall(result,0,id);
			});
		}
		else{
			$.getJSON(getStr,function(result){
				replysCall(result,1,id);
			});
		}
	}
	function replysCall(result,type,id){
		if(result == 'Error'){			
		}
		else{
			$.each(result,function(i,data){
				if(thumiao.ask.replysAdd != null){
					thumiao.ask.replysAdd(id,thumiao.dress.dress('askreply',data),type);
				}
			});
			if(thumiao.ask.replysAll != null){
				thumiao.ask.replysAll(id,result,type);
			}
		}
	}
	this.reset = function(){
		thumiao.ask.val = null;
		thumiao.ask.title = null;
		thumiao.ask.replyId = -1;
		thumiao.ask.replyToId = -1;
	}
	this.newF = function(fileId){
		var fileInput = document.getElementById(fileId);
		var file = fileInput?fileInput.files[0]:null;
		if(typeof(file) == "undefined") file = null;
		if((this.val == null || this.val == "") && file == null){
			return;
		}
		var getStr = thumiao.setGetStr('ask/new');
		var x = this.val;
		getStr+='content='+x;
		getStr+='&title='+this.title;
		getStr+='&location='+thumiao.location.locationSelect;
		getStr+='&typeimg='+(file==null?"":file.type);
		getStr+='&canvas='+(typeof(this.canvas)=="undefined"?"":this.canvas);
		getStr+='&tags='+thumiao.tag.getTags();
	    $.ajax({
	        url: getStr, 
	        type: 'POST',
	        xhr: function(){
	        	var myXhr = $.ajaxSettings.xhr();
	        	if(thumiao.ask.uploadCall)
	            	thumiao.ask.uploadCall(myXhr);
	            return myXhr;
	        },
	        //Ajax events
	        //beforeSend: beforeSendHandler,
	        success: function(result){
	        	newFCall(result);
	        },
	        error: thumiao.ask.uploadFail,
	        // Form data
	        data: file,//formData,
	        //Options to tell JQuery not to process data or worry about content-type
	        cache: false,
	        contentType: false,
	        processData: false
	    });
	}
	function newFCall(result){
		thumiao.tag.reset();
		if(result!='Error'){
			if(thumiao.ask.newFUIcall != null){
				thumiao.ask.newFUIcall(true,result);
			}
			thumiao.ask.reset();
			//all right?
			thumiao.news.all0();
		}
		else{
			thumiao.ask.newFUIcall(false,result);
		}	
	}
	this.setScore = function(id,score){
		var getStr = thumiao.setGetStr('ask/score');
		getStr+='comment='+id;
		getStr+='&score='+score;
		$.get(getStr,function(result){
			if(result!="Error")
				if(thumiao.ask.setScoreCall!=null)
					thumiao.ask.setScoreCall(id,score);
		});
	}
	this.del = function(id,score){
		var getStr = thumiao.setGetStr('ask/delete');
		getStr+='ask='+id;
		getStr+='&type='+score;
		$.get(getStr,function(result){
			if(result!="Error")
				if(thumiao.ask.delCall!=null)
					thumiao.ask.delCall(id,score);
		});
	}
	this.asks = function(id,type,num){
		var getStr = thumiao.setGetStr('ask/asks');
		getStr+='id='+100+'&num='+100;
		getStr+='&type='+1;
		$.getJSON(getStr,function(result){
			if(result!="Error")
				if(thumiao.ask.asksCall!=null)
					thumiao.ask.asksCall(result);
		});
	}
	//type:1 for id-- 0 for id++
	//only for 0 now
	//return in id-- order
	this.getCanvasList = function(array,id,type){
		var ret = [];
		var temp = id;
		if(type == 0){
			for(var i=array.length-1;i>=0;i--){
				if(array[i]['id'] == temp){
					ret.push(array[i]['canvas']);
					temp = array[i]['replytoid'];
					if(temp == -1)
					{
						
						break;
					}
				}
			}
			return ret;
		}
		else{
			return ret;
		}
	}
}
ThuMiao.prototype.tag = new function(){
	this.tagUIcall = null;//input json
	this.tagList = new Array();
	this.tagMax=0;
	this.tagSelect = new Array();
	this.focus = function(id,call){
		var getStr = thumiao.setGetStr('tag/focus');
		getStr+='id='+id;
		$.get(getStr,function(result){
			if(call!=null) call(result);
		});
	}
	this.focuses = function(call){
		var getStr = thumiao.setGetStr('tag/focuses');
		$.getJSON(getStr,function(result){
			if(call!=null) call(result);
		});
	}
	this.newF = function(name){
		var getStr = thumiao.setGetStr('tag/new');
		getStr+='name='+name;
		$.get(getStr,function(result){
			newFCall(result);
		});
	}
	function newFCall(result){
		if(result!="Error"){
			thumiao.tag.all(true);
		}
	}
	this.all = function(updateMap){
		var getStr = thumiao.setGetStr('tag/all');
		getStr+= 'id='+this.tagMax;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		if(updateMap){
			$.getJSON(getStr,function(result){
				allCall(result,updateMap);
			});
		}
		else{
			$.ajax({
			  url: getStr,
			  async: false,
			  success: function(result){
				allCall(result,updateMap);
			  },
			  dataType: 'json'
			});
		}
	}
	function allCall(data,updateMap){
		var count = data.length;
		for(var i=0;i<count;i++)
		{
			//increasing order
			thumiao.tag.tagList.push(data[i]);
			if(updateMap){
				if(thumiao.tag.tagUIcall != null){
					thumiao.tag.tagUIcall(data[i]);
				}
			}
		}
		//reset after using
		thumiao.tag.tagUIcall = null;
		thumiao.tag.tagMax += count;
	}
	this.allF = function(func){
		$.each(this.tagList,function(id,data){
			func(data);
		});
	}
	this.reset = function(){
		this.tagSelect = new Array();
	}
	this.addTag = function(id){
		if(this.tagSelect[id] == null){
			this.tagSelect[id] = true;
		}
		else{
			this.tagSelect[id] = null;
		}
	}
	this.getTags = function(){
		var temp = "";
		$.each(this.tagSelect,function(id,data){
			if(data == true){
				temp += id + " ";
			}
		});
		return temp;
	}
}
ThuMiao.prototype.canvas = new function(){
	//draw
	this.color="#000000";
	this.width=1;
	this.array=null;
	this.tempArray;
	//canvas
	this.canvas=null;
	this.cwidth;
	this.cheight;
	this.cname;
	//mouse
	this.mouseX;
	this.mouseY;
	this.isDown = false;
	this.initCanvas = function(name){
		this.array = new Array();
		//
		this.cname = name;
		this.canvas=document.getElementById(name);
		var context=this.canvas.getContext("2d");
		context.canvas.width = $('#'+name).width();
		context.canvas.height = $('#'+name).height();
		this.cwidth = context.canvas.width;
		this.cheight = context.canvas.height;	
		context.fillStyle = '#AAAAAA';
		context.fillRect(0, 0, this.cwidth, this.cheight);
		//events
		if(thumiao.thisEnv == 0){
			this.canvas.addEventListener('mousemove', function(evt){
		    	mouseMove(evt);
			}, false);
			this.canvas.addEventListener('mousedown', function(evt){
				mouseDown(evt);
			},false);
		
			this.canvas.addEventListener('mouseup', function(evt){
				mouseUp(evt);
			},false);
		}
		else if(thumiao.thisEnv == 1){
			this.canvas.addEventListener('touchmove', function(evt){
			    mouseMove(evt);
			}, false);
			
			this.canvas.addEventListener('touchstart', function(evt){
				mouseDown(evt);
			},false);
		
			this.canvas.addEventListener('touchend', function(evt){
				mouseUp(evt);
			},false);
		}
		
	}
	function getMousePos(canvas, evt){
	    // get canvas position
	    var obj = canvas;
	    var top = 0;
	    var left = 0;
	    while (obj && obj.tagName != 'BODY') {
	        top += obj.offsetTop;
	        left += obj.offsetLeft;
	        obj = obj.offsetParent;
	    }
	    // return relative mouse position
	    if(thumiao.thisEnv == 0){
	    	thumiao.canvas.mouseX = evt.clientX - left + window.pageXOffset;
	    	thumiao.canvas.mouseY = evt.clientY - top + window.pageYOffset;
	    }
	    else if(thumiao.thisEnv == 1){
	    	thumiao.canvas.mouseX = evt.touches[0].pageX - left + window.pageXOffset;
	   		thumiao.canvas.mouseY = evt.touches[0].pageY - top + window.pageYOffset;
	    }
	}
	function mouseDown(evt){
		if(thumiao.canvas.isDown) return;
		thumiao.canvas.isDown = true;
		getMousePos(thumiao.canvas.canvas, evt);
		var x = thumiao.canvas.mouseX;
		var y = thumiao.canvas.mouseY;
		var context = thumiao.canvas.canvas.getContext("2d");
		context.lineWidth = thumiao.canvas.width;
    	context.strokeStyle = thumiao.canvas.color;
		context.beginPath();
		context.moveTo(x,y);
		//
		thumiao.canvas.tempArray = new Array();
		var temp = thumiao.canvas.tempArray;
		temp[0] = 0;
		temp[1] = context.lineWidth;
		temp[2] = "'"+context.strokeStyle+"'";
		temp[3] = new Array();
		temp[3].push([x,y]);
	}
	function mouseMove(evt){
		if(thumiao.canvas.isDown == true){
    		getMousePos(thumiao.canvas.canvas, evt);
    		var x = thumiao.canvas.mouseX;
			var y = thumiao.canvas.mouseY;
			var context = thumiao.canvas.canvas.getContext("2d");
    		context.lineTo(x,y);
    		context.stroke();
    		//
    		thumiao.canvas.tempArray[3].push([x,y]);
    	}
	}
	function mouseUp(evt){
		thumiao.canvas.isDown = false;
		var context = thumiao.canvas.canvas.getContext("2d");
		context.closePath();
		//
		thumiao.canvas.array.push(thumiao.canvas.tempArray);
	}
	this.clear = function(){
		if(this.canvas == null) return;
		var context=this.canvas.getContext("2d");
		context.fillStyle = '#AAAAAA';
		context.fillRect(0, 0, this.cwidth, this.cheight);
	}
	this.draw = function(array){
		if(this.canvas == null || this.array == null) return;
		var context=this.canvas.getContext("2d");
		//type,width,color,parameters
		$.each(array,function(id,data){
			if(data[0] == 0){//line
				context.lineWidth = data[1];
		    	var temp = data[2]+"";
		    	if(temp.length == 7)
		    		context.strokeStyle = temp;
		    	else
		    		context.strokeStyle = eval(temp);
		    	context.beginPath();
		    	context.moveTo(data[3][0][0],data[3][0][1]);
		    	var max = data[3].length;
		    	for(var i=1;i<max;i++){
		    		context.lineTo(data[3][i][0],data[3][i][1]);
		    	}
		    	context.stroke();
		    	context.closePath();
			}
		});
	}
	this.arrayToStr = function(array){
		if(array == null) return;
		return aTs(array);
	}
	function aTs(array){
		var max = array.length;
		for(var i=0;i<max;i++){
			if(array[i].constructor == Array){
				array[i] = aTs(array[i]);
			}
		}
		return '['+array.join()+']';
	}
}
ThuMiao.prototype.user = new function(){
	this.focus = function(id,rrid,func){
		var getStr = thumiao.setGetStr('user/focus');
		getStr+='id='+id+'&rrid='+rrid;
		$.get(getStr,function(result){
			if(func!=null) func(result);
		});
	}
	this.focuses = function(func){
		var getStr = thumiao.setGetStr('user/focuses');
		$.getJSON(getStr,function(result){
			if(func!=null) func(result);
		});
	}
	this.info = function(id,func){
		var getStr = thumiao.setGetStr('user/info');
		getStr+='id='+id;
		$.getJSON(getStr,function(result){
			if(func!=null) func(result);
		});
	}
	this.set = function(id,data,func){
		var getStr = thumiao.setGetStr('user/set');
		getStr+='id='+id+'&intro='+data['intro'];
		$.getJSON(getStr,function(result){
			if(func!=null) func(result);
		});
	}
	this.all = function(func){
		var getStr = thumiao.setGetStr('user/all');
		$.getJSON(getStr,function(result){
			if(func!=null) func(result);
		});
	}
	//get one
	this.msgCall = null;
	this.msg = function(id){
		var getStr = thumiao.setGetStr('user/msg');
		getStr+='id='+id;
		$.getJSON(getStr,function(result){
			if(thumiao.user.msgCall!=null){
				thumiao.user.msgCall(result);
			}
		});
	}
	//send
	this.messageCall = null;
	this.message = function(id,content){
		var getStr = thumiao.setGetStr('user/message');
		getStr+='target='+id+"&content="+content;
		$.getJSON(getStr,function(result){
			if(thumiao.user.messageCall!=null){
				thumiao.user.messageCall(id,result);
			}
		});
	}
	//get sone
	this.messagesCall = null;
	this.messages = function(userid,id){
		var getStr = thumiao.setGetStr('user/messages');
		getStr+='target='+userid+"&id="+id;
		$.getJSON(getStr,function(result){
			if(thumiao.user.messagesCall!=null){
				thumiao.user.messagesCall(userid,result);
			}
		});
	}
}
ThuMiao.prototype.notice = new function(){
	this.all = function(call){
		var getStr = thumiao.setGetStr('notice/all');
		getStr += "_t=" + new Date().getTime();//in case of cache
		$.getJSON(getStr,function(result){
			if(call!=null) call(result);	
		});
	}
}
ThuMiao.prototype.vote = new function(){
	this.newFUIcall = null;//bool for success or not
	this.replyUIcall = null;//id & bool for success or not
	this.replysAdd = null;//id & html as input
	this.voteFcall = null;//call after voting
	this.addFcall = null;//call after adding choice
	this.getFcall = null;//call after get choices
	//need to be set before xxx
	this.val = null;
	this.title = null;
	this.endtime = null;
	this.type = -1;
	this.replyId = -1;
	this.replyToId = -1;
	this.newF = function(){
		//for easy use
		this.type = 3;
		this.endtime = "";
		thumiao.cat.catSelect = -1;
		// if(thumiao.cat.catSelect == -1 || this.type == -1){
		// 	return;
		// }
		if(this.title == null || this.title == "" || this.endtime == null){
			return;
		}
		var getStr = thumiao.setGetStr('vote/new');
		var x = this.val;//$('#NewsContent').val();
		getStr+='content='+x;
		getStr+='&title='+this.title;
		getStr+='&endtime='+this.endtime;
		getStr+='&type='+this.type;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		x = thumiao.cat.catSelect;
		getStr+='&cat='+x;
		$.get(getStr,function(result){
			newFCall(result);
		});
	}
	function newFCall(result){
		if(result!='Error'){
			if(thumiao.vote.newFUIcall != null){
				thumiao.vote.newFUIcall(true,result);
			}
			thumiao.vote.reset();
			//all right?
			//thumiao.news.all0();
		}
		else{
			thumiao.vote.newFUIcall(false,result);
		}
		
	}
	this.reply = function(){
		if(this.val == null || this.replyId == -1){
			return;
		}
		var getStr = thumiao.setGetStr('vote/reply');
		getStr+="vote="+this.replyId+"&content="+this.val;
		getStr+="&targetid="+this.replyToId;
		var tempid = this.replyId;
		$.get(getStr,function(result){
			replyCall(result,tempid);
		});
	}
	function replyCall(result,id){
		if(result != "Error"){
			thumiao.vote.reset();
			if(thumiao.vote.replyUIcall != null){
				thumiao.vote.replyUIcall(id,true);
			}
		}
		else{
			thumiao.vote.replyUIcall(false);
		}
	}	
	this.replys = function(id){
		var getStr = thumiao.setGetStr('vote/replys');
		getStr+="num=0"+"&type=0"+"&vote="+id;
		var type = 0;
		if(type == 0){
			$.getJSON(getStr,function(result){
				replysCall(result,0,id);
			});
		}
		else{
			$.getJSON(getStr,function(result){
				replysCall(result,1,id);
			});
		}
	}
	function replysCall(result,type,id){
		if(result == 'Error'){			
		}
		else{
			if(type == 0){
				$.each(result,function(i,data){
					if(thumiao.vote.replysAdd != null){
						thumiao.vote.replysAdd(id,thumiao.dress.dress('votereply',data));
					}
				});
			}
		}
	}
	this.reset = function(){
		thumiao.vote.val = null;
		thumiao.vote.title = null;
		thumiao.vote.endtime = null;
		thumiao.vote.type = -1;
		thumiao.vote.replyId = -1;
		thumiao.vote.replyToId = -1;
		thumiao.cat.catSelect = -1;
	}
	//
	this.get = function(id){
		var getStr = thumiao.setGetStr('vote/get');
		getStr+='vote='+id;
		getStr+="&_t=" + new Date().getTime();//in case of cache
		$.getJSON(getStr,function(result){
			if(result!='Error!'){
				if(thumiao.vote.getFcall!=null){
					thumiao.vote.getFcall(true,result);
				}
			}
			else{
				if(thumiao.vote.getFcall!=null){
					thumiao.vote.getFcall(false,result);
				}
			}
		});
	}
	this.vote = function(id){
		var getStr = thumiao.setGetStr('vote/vote');
		getStr+='vote='+id;
		$.get(getStr,function(result){
			if(thumiao.vote.voteFcall!=null){
				thumiao.vote.voteFcall(result);
			}
		});
	}
	this.add = function(id){
		if(this.val == null || this.val == ""){
			return;
		}
		var getStr = thumiao.setGetStr('vote/add');
		getStr+='vote='+id;
		getStr+='&content='+this.val;
		$.get(getStr,function(result){
			if(result!='Error!'){
				if(thumiao.vote.addFcall!=null){
					thumiao.vote.addFcall(true,result);
				}
			}
			else{
				if(thumiao.vote.addFcall!=null){
					thumiao.vote.addFcall(false,result);
				}
			}
		});
	}
	this.all = function(call){
		var getStr = thumiao.setGetStr('vote/all');
		getStr += "_t=" + new Date().getTime();//in case of cache
		$.getJSON(getStr,function(result){
			if(call!=null){
				call(result);
			}
		});
	}
}
var thumiao = new ThuMiao();
$(document).ready(function(){
	thumiao.init();
});