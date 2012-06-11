var uitest = function(){ThuMiao.prototype.PhoneUIbasic = new function(){
	this.init = function(){
		//map init
		thumiao.map.init('NewsLocationMap');
		//news init
		this.buttonNews();
		thumiao.news.all1();
		thumiao.news.appendNews = appendNews;
		thumiao.news.prependNews = prependNews;
		thumiao.news.noBigger = noBigger;
		thumiao.news.noSmaller = noSmaller;
		thumiao.news.all1();
		noBigger();
		//status init
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
	//show news list
	this.buttonNews = function(){
		$('.Bar').hide();
		$('.Panel').hide();
		$('#NewsBar').show();
		$('#NewsPanel').show();
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
	//news as a cat
	this.buttonMiao = function(){
		$('.Bar').hide();
		$('.Panel').hide();
		$('#NewsCatBar').show();
		$('#NewsCatPanel').show();
		
		thumiao.cat.catSelect = -1;
		$('#NewsCatPanel').html('');
		thumiao.cat.all(buttonMiaoCall);
	}
	function buttonMiaoCall(result){
		$.each(result,function(id,data){
			$('#NewsCatPanel').append(thumiao.dress.dress('cat',data));
		});	
	}
	this.setCat = function(id){
		thumiao.cat.catSelect = id;
		this.buttonContent();
	}
	//news content
	this.buttonContent = function(){		
		$('.Bar').hide();
		$('.Panel').hide();
		$('#NewsContentBar').show();
		$('#NewsContentPanel').show();	
	}
	//news location
	this.buttonLocation = function(){
		$('.Bar').hide();
		$('.Panel').hide();
		$('#NewsLocationBar').show();
		$('#NewsLocationPanel').show();
		
		thumiao.location.all(true);
	}
	//reply
	this.setReplyTo = function(id){
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
		thumiao.status.val=$('#statuscomment_'+id).val();
		thumiao.status.replyId = id;
		thumiao.status.newF();
		$('#status_'+id).hide();
		$('#status_c'+id).html('');
	}
	function replyUIcall(id,result){
		thumiao.PhoneUIbasic.replys(id);
	}
	function replysAdd(id,data){
		$('#status_r'+id).append(data);
	}
}
thumiao.PhoneUIbasic.init();
}
