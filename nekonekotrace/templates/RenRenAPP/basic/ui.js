function(){
ThuMiao.prototype.RRAppUIBasic = new function(){
	this.Map1;
	this.Map2;
	//init functions
	this.init = function(){
		//map init
		this.Map1 = thumiao.map.init('NewsLocationMap',map1click);
		this.Map2 = thumiao.map.init('ListMapNews',map2click);			
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
		//upload photo init
        var temp =  '/uploadify_script-' + thumiao.userID + '/';
		$('#file_upload').uploadify({
            'uploader'  : '/static/plugin/uploadify_214/uploadify.swf',
            'script'    : temp,
            'cancelImg' : '/static/plugin/uploadify_214/cancel.png',
            'folder'    : '/uploadphoto/',
            'auto'      : false,//
            'multi': true, //设置可以上传多个文件
            'queueSizeLimit':20, //设置可以同时20个文件
            'removeCompleted':false,//
            'sizeLimit':10240000, //设置上传文件大小单位kb
            'fileExt':'*.jpg;*.gif;*.png',//设置上传文件类型为常用图片格式
            'fileDesc':'Image Files',
            'onInit': function () {},
            'onError' : function (event,ID,fileObj,errorObj) {
                $('#id_span_msg').html("上传失败，错误码:"+errorObj.type+" "+errorObj.info);
            },
            'onSelect': function (e, queueId, fileObj) {
                $('#id_span_msg').html("");
                $('#uploadbutton').show();
            },
            'onAllComplete': function (event, data) {
                if(data.filesUploaded>=1){
                    $('#id_span_msg').html("上传成功！");
                    $('#uploadbutton').hide();
                }
            }
        });
		//all done
		$('body').show();
	}
	//map functions
	function map1click(e){
		$('#NLname').val('');
		$('#NLx').val(e.point.lng);
		$('#NLy').val(e.point.lat);
	}
	function map2click(e){
		
	}
	//news functions
	function noSmaller(){
		$('#NewsN1').hide();
	}
	function noBigger(){
		$('#NewsN0').hide();
	}
	function appendNews(news){
		$('#NewsList').prepend(news);
	}
	function prependNews(news){
		$('#NewsList').append(news);
	}
	this.nnclose = function(){
		resetMiao();
		thumiao.status.reset();
	}
	//status functions
	//take care of namesapce next time!!!
	function newFUIcall(success){
		resetMiao();
		$('#NewsContent').val('');
	}
	function replyUIcall(id,success){
		if(success){
			$('#status_'+id).hide();
			$('#status_r'+id).hide();
			$('#status_r'+id).html('');
			thumiao.RRAppUIBasic.replys(id);
		}	
	}
	function replysAdd(id,data){
		$('#status_r'+id).append(data);
	}
	this.setRto = function(id){
		thumiao.status.replyToId = id;
	}
	this.replys = function(id){
		if($('#status_'+id).css('display')!='none'){
			$('#status_'+id).hide();
			$('#status_r'+id).hide();
			$('#status_r'+id).html('');
			return;
		}
		thumiao.status.replys(id);
		$('#status_'+id).show();
		$('#status_r'+id).show();
	}
	this.reply = function(id){
		thumiao.status.val = $('#status_c'+id).val();
		thumiao.status.replyId = id;
		thumiao.status.reply();
	}
	//others
	function panelsHide(){
		$('#NewNews').hide();
		$('#MapPanel').hide();
		//$('#NewsPanel').hide();
	}
	//up bar functions
	this.buttonNews = function(){
		panelsHide();
	}
	this.buttonCat = function(){
		alert('Not support!');
	}
	this.buttonUser = function(){
		alert('Not support!');
	}
	this.buttonMap = function(){
		alert('Not support!');
	}
	//down bar functions
	function resetMiao(){
		panelsHide();
		$('#NewsCatPanel').hide();
		$('#NewsContentPanel').hide();
		$('#NewsLocationPanel').hide();
		$('#NewNews').show();
	}
	this.buttonMiao = function(){
		resetMiao();
		$('#NewsCatList').html('');
		thumiao.cat.all(nnCatDress);
		$('#NewsCatPanel').show();
	}
	function nnCatDress(data){
		$.each(data,function(id,Data){
			$('#NewsCatList').append(thumiao.dress.dress('cat',Data));
		});		
	}
	this.setCat = function(id){
		thumiao.cat.catSelect= id;
		$('#NewsCatPanel').hide();
		$('#NewsContentPanel').show();
	}
	var setLocationF = true;
	this.setLocation = function(){
		$('#NewsContentPanel').hide();
		if(setLocationF){
			thumiao.location.allF(addLfunc);
			setLocationF = false;
		}
		thumiao.location.locationUIcall = addLfunc;
		thumiao.location.all(false);
		$('#NewsLocationPanel').show();
	}
	function addLfunc(data){
		var temp = thumiao.map.newLabel(data['x'],data['y'],data['name'],data['id'],Lfunc);
		thumiao.map.addLabel(thumiao.RRAppUIBasic.Map1,temp);
	}
	function Lfunc(x,y,name,content){
		$('#NLname').val(name);
		$('#NLx').val(x);
		$('#NLy').val(y);
		thumiao.location.locationSelect = parseInt(content);
	}
	this.backContent = function(){
		$('#NewsLocationPanel').hide();
		$('#NewsContentPanel').show();
	}
	this.buttonHehe = function(){
		resetMiao();
		$('#NewsContentPanel').show();
	}
	this.commit = function(){
		thumiao.status.val = $('#NewsContent').val();
		thumiao.status.newF();
	}
}
thumiao.RRAppUIBasic.init();
}
