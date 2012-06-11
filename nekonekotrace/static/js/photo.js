ThuMiao.prototype.photo = new function(){
    this.replyPhoto = -1;
    this.replyComment = -1;
    this.reply = function(id){
        var getStr = thumiao.setGetStr('photo/reply');
        getStr+="photo="+id+"&content="+$('#photocomment_'+id).val();      
        getStr+="&targetid="+thumiao.news.replyComment;
        thumiao.news.replyComment = -1;
        $.get(getStr,function(result){
            replyCall(result,id);
        });
    }
    function replyCall(result,id){
        if(result != "Error"){
            $('#photo_'+id).hide();
            thumiao.photo.replys(id);
        }
    }
    this.replys = function(id){
        if($('#photo_'+id).css('display')!='none'){
            $('#photo_'+id).hide();
            return;
        }
        thumiao.news.replyComment = -1;
        $('#photo_'+id).html(thumiao.dress.dress('photoreply',{'id':id}));
        $('#photo_'+id).show();
        var getStr = thumiao.setGetStr('photo/replys');
        getStr+="num=0"+"&type=0"+"&photo="+id;
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
                    $('#photo_c'+id).append(thumiao.dress.dress('comment',data))
                });
            }
        }
    }

    this.transfer = function(id){
        var getStr = thumiao.setGetStr('photo/transfer');
        getStr+='photo='+id;
        $.get(getStr,function(result){
            if(result != "Error"){
            }
        });
    }

    this.uploadphoto = function(){
        var data = $('#upload_photo').serializeObject();
        Dajaxice.nekonekotrace.views.photo.photo_uploadphoto(Dajax.process, {'form':data});
    }
}

