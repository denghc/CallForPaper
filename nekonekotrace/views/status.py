#-*- coding: UTF-8 -*-
import json
from django.http import *
from django.template.loader import get_template
from django.template import Context
from datetime import *
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
#from nekonekotrace.views.news import *
from nekonekotrace.models import *
from nekonekotrace.logic.Check import *

def addNews(typein, newsid):
    new = News(Type = typein,TargetID = newsid)
    new.save()
    return new.id

#--------------status below---------------
# it is amusing that jsonXX does not json it
def jsonStatusByTargetID(status, newsid = -1, newstype = -1):
    userinfo = status.UserID
    location = status.Location
    ret = {}
    ret['newsid'] = newsid
    ret['newstype'] = newstype
    ret['userid'] = userinfo.id
    if status.Type == 1:
        ret['headurl'] = userinfo.URL
        ret['name'] = userinfo.Name
    else:
        cat = status.CatID
        ret['name'] = cat.Name
        ret['headurl'] = cat.cat_image
    ret['content'] = status.Content
    ret['tnum'] = status.Transmit_num
    ret['cnum'] = status.Comment_num
    ret['time'] = status.Time.strftime('%Y-%m-%d %H:%M:%S')
    ret['location'] = location.id
    ret['id'] = status.id
    return ret

def status_new(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    #user = int(request.GET['user'])
    user = int(request.user.first_name)
    typein = int(request.GET['type'])
    content = request.GET['content']
    checkContent(content)
    cat = int(request.GET['cat'])
    location = int(request.GET['location'])
    addStatus(user,typein,content,cat,location)
    return HttpResponse('Succeed')

def addStatus(user,typein,content,cat,location):
    userinfo = UserInfo.objects.get(id = user)
    locationinfo = Location.objects.get(id = location)
    catinfo = None
    if typein == 0:
        catinfo = CatInfo.objects.get(id = cat)
        status = Status(Type=typein,Content=content,UserID=userinfo,CatID=catinfo,Deleted=0,Time=datetime.now(),Location=locationinfo,Comment_num=0,Transmit_num=0)
    elif typein == 1:
        status = Status(Type=typein,Content=content,UserID=userinfo,Deleted=0,Time=datetime.now(),Location=locationinfo,Comment_num=0,Transmit_num=0)
    else:
        raise Exception('Error')
    status.save()
    nid = addNews(1 , status.id)
    #---cat tag part---
    if typein == 0:
        cattag = CatTag(NewsID = nid,TargetID=status.id,CatID=catinfo,Deleted=0,Type=1,UserID=userinfo,Time=status.Time)
        cattag.save()
    locationtag = LocationTag(Location=locationinfo,Type=1,TargetID=status.id)
    locationtag.save()
    return status.id

#-----------status comment below--------------

def status_reply(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    checkContent(content)
    status = int(request.GET['status'])
    targetid = int(request.GET['targetid'])
    ret = addStatusComment(status,user,content,targetid)
    return HttpResponse('Succeed')

def status_replys(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    num = request.GET['num']
    status = int(request.GET['status'])
    type = request.GET['type']
    # improve here
    commentlist = list(StatusComment.objects.filter(StatusID = status).order_by('-id'))
    ret = jsonStatusCommentList(commentlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def jsonStatusCommentList(commentlist):
    result = []
    for item in commentlist:
        if(item.Deleted == 0):
            ret = {}
            ret['headurl'] = item.UserID.URL
            ret['name'] = item.UserID.Name
            ret['content'] = item.Content
            ret['time'] = item.Time.strftime('%Y-%m-%d %H:%M:%S')
            if item.TargetID == None:
                ret['replytoid'] = -1
            else:
                ret['replytoid'] = item.TargetID.id
            ret['comment'] = item.id
            result.append(ret)
    return result

# replied which means the user replied is deprecated
def addStatusComment(status,user,content,targetid):
    userid = UserInfo.objects.get(id = user)
    statusid = Status.objects.get(id = status)
    target = None
    try:
        target = StatusComment.objects.get(id = targetid)
    except:
        pass
    statusc=StatusComment(UserID=userid,Time=datetime.now(),StatusID=statusid,Deleted=0,Content=content,TargetID=target)
    statusc.save()
    statusid.Comment_num += 1
    statusid.save()
    return statusc

#---------- delete function below-------------

def status_delete(request):
    user = request.GET['user']
    status = request.GET['status']
    type = request.GET['type']
    if type == 0:
        delStatus(status,user)
    elif type == 1:
        delStatusComment(status,user)
    return HttpResponse('Succeed')

def delStatus(statusid,user):
    status = Status.objects.get(id = statusid)
    status.Deleted = 1
    status.save()
    
def delStatusComment(statusid,user):
    return 0


    