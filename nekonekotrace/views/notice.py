#-*- coding: UTF-8 -*-
from django.http import *
from django.template.loader import get_template
from django.template import Context
from datetime import *
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
#from nekonekotrace.views.photo import *
from nekonekotrace.views.news import *
from nekonekotrace.models import *
#json generator import

#--------------notice below---------------
# it is amusing that jsonXX does not json it
# i am too lazy to modify them
def jsonNoticeByTargetID(status, newsid = -1, newstype = -1):
    #userinfo = status.UserID
    ret = {}
    #ret['newsid'] = newsid
    #ret['newstype'] = newstype
    #cat = status.CatID
    #ret['name'] = cat.Name
    #ret['headurl'] = cat.cat_image
    ret['content'] = status.Content
    ret['title'] = status.Title
    #ret['tnum'] = status.Transmit_num
    ret['id'] = status.id
    #ret['cnum'] = status.Comment_num
    ret['time'] = status.Time.strftime('%Y-%m-%d %H:%M:%S')
    return ret

def notice_all(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    lists = list(Notice.objects.all())
    ret = []
    for item in lists:
        if item.Deleted == 0:
            ret.append(jsonNoticeByTargetID(item))
    ret = json.dumps(ret)
    return HttpResponse(ret)

def notice_new(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    #user = int(request.GET['user'])
    user = int(request.user.first_name)
    content = request.GET['content']
    cat = int(request.GET['cat'])
    id = addNotice(user,content,cat)
    addNews(2 , id)
    return HttpResponse('Succeed')

def addNotice(user,content,cat):
    userinfo = UserInfo.objects.get(id = user)
    catinfo = CatInfo.objects.get(id = cat)
    status = Notice(Content=content,UserID=userinfo,CatID=catinfo,Deleted=0,Time=datetime.now(),Comment_num=0,Transmit_num=0)
    status.save()
    return status.id

#-----------notice comment below--------------

def notice_reply(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    status = int(request.GET['notice'])
    targetid = int(request.GET['targetid'])
    ret = addNoticeComment(status,user,content,targetid)
    return HttpResponse('Succeed')

def notice_replys(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    num = request.GET['num']
    status = int(request.GET['notice'])
    type = request.GET['type']
    # improve here
    commentlist = list(NoticeComment.objects.filter(NoticeID = status).order_by('-id'))
    ret = jsonNoticeCommentList(commentlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def jsonNoticeCommentList(commentlist):
    result = []
    for item in commentlist:
        if(item.Deleted == 0):
            ret = {}
            ret['headurl'] = item.UserID.URL
            ret['name'] = item.UserID.Name
            ret['content'] = item.Content
            ret['time'] = str(item.Time)
            ret['replytoid'] = item.TargetID.id
            ret['comment'] = item.id
            result.append(ret)
    return result

# replied which means the user replied is deprecated
def addNoticeComment(status,user,content,targetid):
    userid = UserInfo.objects.get(id = user)
    statusid = Notice.objects.get(id = status)
    target = None
    try:
        target = NoticeComment.objects.get(id = targetid)
    except:
        pass
    statusc=NoticeComment(UserID=userid,Time=datetime.now(),NoticeID=statusid,Deleted=0,Content=content,TargetID=target)
    statusc.save()
    statusid.Comment_num += 1
    statusid.save()
    return statusc

#---------- delete function below-------------

def notice_delete(request):
    user = request.GET['user']
    status = request.GET['notice']
    type = request.GET['type']
    if type == 0:
        delNotice(status,user)
    elif type == 1:
        delNoticeComment(status,user)
    return HttpResponse('Succeed')

def delNotice(statusid,user):
    status = Notice.objects.get(id = statusid)
    status.Deleted = 1
    status.save()
    
def delNoticeComment(statusid,user):
    return 0