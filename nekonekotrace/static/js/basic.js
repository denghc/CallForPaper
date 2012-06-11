function ThuMiao(){
	this.isPhone;
    this.userID;
	this.webBase = "../../";//"http://59.66.139.166:8000/";
	this.init = function(){
		//other init
		if(typeof(PhoneGap) == 'undefined'){
			this.isPhone = false;
		}
		else{
			this.isPhone = true;
		}
		//init parameters
		var maxNewsID = parseInt($('#Init').attr('maxNewsID'));
		this.news.maxID = maxNewsID+1;
		this.news.minID = maxNewsID;
        this.userID = parseInt($('#Init').attr('userID'));
		
		$('#Init').remove();
		//dress init
		this.dress.init();		
	}
	this.setGetStr = function(sub){
		var ret = this.webBase+sub;
		ret+='/?';
		//add renren here
		return ret;
	}
}

ThuMiao.prototype.news = new function(){
	this.maxID=-1;//to be fetched
	this.minID=999999;
	this.newsList = new Array();
	this.replyComment = -1;
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
		this.all(this.maxID,0,10);
	}
	this.all1 = function(){
		this.all(this.minID,1,10);
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
						var dressed = null;
						var newstype = parseInt(data.newstype);
						if(newstype == 1) dressed = thumiao.dress.dress('status',data);
						else if(newstype == 0) dressed = thumiao.dress.dress('photo',data);
						$('#NewsList').prepend(dressed);
						thumiao.news.newsList.unshift(data);//at the beginning
					}				
				});	
				if(result.length>0){
					var newMax = parseInt(result[result.length-1].newsid) + 1;
					thumiao.news.maxID = newMax;
				}
				$('#NewsN0').hide();		
			} 
			else{
				//in -id order
				$.each(result,function(id,data){
					if(parseInt(data.newsid) <= thumiao.news.minID){
						var dressed = null;
						var newstype = parseInt(data.newstype);
						if(newstype == 1) dressed = thumiao.dress.dress('status',data);
						else if(newstype == 0) dressed = thumiao.dress.dress('photo',data);
						$('#NewsList').append(dressed);
						thumiao.news.newsList.push(data);//at the end
					}					
				});
				if(result.length>0){
					var newMin = result[result.length-1].newsid - 1;
					thumiao.news.minID = newMin;
				}			
				if(thumiao.news.minID < 1){
					$('#NewsN1').hide();
				}
			}
		}
	}
	this.setReplyTo = function(comment){
		this.replyComment = comment;
	}
}

ThuMiao.prototype.status = new function(){
	this.newF = function(){
		if(thumiao.location.locationSelect == -1){
			return;
		}
		var getStr = thumiao.setGetStr('status/new');
		var x = $('#NewsContent').val();
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
			thumiao.PhoneUIbasic.buttonNews();
			//all right?
			thumiao.news.all0();
			$('#NewsContent').val('');
		}
	}
	this.reply = function(id){
		var getStr = thumiao.setGetStr('status/reply');
		getStr+="status="+id+"&content="+$('#statuscomment_'+id).val();
		getStr+="&targetid="+thumiao.news.replyComment;
		thumiao.news.replyComment = -1;
		$.get(getStr,function(result){
			replyCall(result,id);
		});
	}
	function replyCall(result,id){
		if(result != "Error"){
			$('#status_'+id).hide();
			thumiao.status.replys(id);
		}
	}	
	this.replys = function(id){
		if($('#status_'+id).css('display')!='none'){
			$('#status_'+id).hide();
			return;
		}
		thumiao.news.replyComment = -1;
		$('#status_'+id).html(thumiao.dress.dress('statusreply',{'id':id}));
		$('#status_'+id).show();
		var getStr = thumiao.setGetStr('status/replys');
		getStr+="num=0"+"&type=0"+"&status="+id;
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
					$('#status_c'+id).append(thumiao.dress.dress('comment',data))
				});
			}
		}
	}

}

ThuMiao.prototype.location = new function(){
	this.locationList = new Array();
	this.locationMax=0;
	this.locationSelect = -1;
	this.newF = function(map){
		var getStr = thumiao.setGetStr('location/new');
		var x = $('#'+map+'x').val();
		getStr+='x='+x;
		x = $('#'+map+'y').val();
		getStr+='&y='+x;
		x = $('#'+map+'name').val();
		getStr+='&name='+x;
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
			data[i]['maplabel'] = thumiao.map.newLabel(data[i].x,data[i].y,data[i].name,data[i].id);
			//increasing order
			thumiao.location.locationList.push(data[i]);
		}
		thumiao.location.locationMax += count;
		//
		if(updateMap){
			//thumiao.map.delAllLabels(thumiao.map.Map);
			$.each(thumiao.location.locationList,function(id,data){
				thumiao.map.delLabel(thumiao.map.Map,data['maplabel']);
			});
			thumiao.location.showMapLabels(thumiao.map.Map);
		} 
	}
	this.showMapLabels = function(map){
		$.each(thumiao.location.locationList,function(id,data){
			thumiao.map.showLabel(map,data['maplabel']);
		});
	}
}

ThuMiao.prototype.cat = new function(){
	this.catSelect = -1;
	//outside callback for multi usage
	this.all = function(callback){
		var getStr = thumiao.setGetStr('cat/all');
		$.getJSON(getStr,function(result){
			if(result != "Error"){
				callback(result);
			}
		});
	}
	this.setCat = function(id){
		this.catSelect = id;
		thumiao.buttonContent();
	}
}

ThuMiao.prototype.dress = new function(){
	this.style = 'basic';
	var templates = {};
	this.init = function(){
		$('body').hide();
		getStyle(this.style);
		$('body').show();
	}
	function getStyle(style){
		var getStr = thumiao.setGetStr('dress/get');
		getStr += 'style=' + style + '&type=';
		//
		getStyleType(getStr,style,'status');
		getStyleType(getStr,style,'comment');
		getStyleType(getStr,style,'cat');
		getStyleType(getStr,style,'photo');
		getStyleType(getStr,style,'statusreply');
		getStyleType(getStr,style,'photoreply');
		getStyleType(getStr,style,'main');
		$('#UI').html(thumiao.dress.dress('main',{}));
		getStyleType(getStr,style,'js');
		var temp = thumiao.dress.dress('js',{});
		temp = eval('('+temp+')');
		temp();
	}
	//sync here?
	function getStyleType(getStr,style,type){
		$.ajax({
			url: getStr+type,
			type: 'GET',
			success: function(result){
				getCall(result,style,type);
			},
			async: false,
  		});
	}
	function getCall(result,style,type){
		if(templates[style] == null){
			templates[style] = {};
		}
		templates[style][type] = new EJS({text: result});
	}
	this.dress = function(type,data){
		if(templates[this.style] == null){
			
		}
		else if(templates[this.style][type] == null){
			
		}
		if(type == 'status'){
			var locid = parseInt(data['location']);
			if(locid > thumiao.location.locationList.length){
				thumiao.location.all(false);
			}
			data['location'] = thumiao.location.locationList[locid-1].name;
		}
		return templates[this.style][type].render(data);
	}
}

var thumiao;
$(document).ready(function(){
	thumiao = new ThuMiao();
	thumiao.init();
});