#-*- coding: UTF-8 -*-
from django.http import *
from django.template.loader import get_template
from django.template import Context
from datetime import *
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from nekonekotrace.logic.Check import *
from nekonekotrace.views.news import *
from nekonekotrace.models import *
#json generator import

#--------------catdata below---------------
# it is amusing that jsonXX does not json it
# i am too lazy to modify them again X n
def jsonCatDataByTargetID(status, newsid = -1, newstype = -1):
    userinfo = status.UserID
    ret = {}
    ret['newsid'] = newsid
    ret['newstype'] = newstype
    ret['userid'] = userinfo.id
    cat = status.CatID
    ret['name'] = cat.Name
    ret['headurl'] = cat.cat_image
    ret['renname'] = userinfo.Name
    ret['weight'] = status.Weight
    ret['length'] = status.Length
    ret['health'] = status.Health
    ret['tnum'] = status.Transmit_num
    ret['cnum'] = status.Comment_num
    #ret['tnum'] = status.Transmit_num
    ret['id'] = status.id
    #ret['cnum'] = status.Comment_num
    ret['time'] = status.Time.strftime('%Y-%m-%d %H:%M:%S')#
    lo = status.Location
    ret['location'] = lo.id
    return ret

def catdata_new(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    #user = int(request.GET['user'])
    user = int(request.user.first_name)
    length = int(request.GET['length'])
    weight = int(request.GET['weight'])
    health = request.GET['health']
    checkContent(health)
    location = request.GET['location']
    cat = int(request.GET['cat'])
    addCatData(user,length,weight,health,location,cat)
    return HttpResponse('Succeed')

def addCatData(user,length,weight,health,location,cat):
    userinfo = UserInfo.objects.get(id = user)
    catinfo = CatInfo.objects.get(id = cat)
    loinfo = Location.objects.get(id = location)
    status = CatData(Weight=weight,Length=length,Health=health,Location=loinfo,UserID=userinfo,CatID=catinfo,Deleted=0,Time=datetime.now(),Comment_num=0,Transmit_num=0)
    status.save()
    nid = addNews(4 , status.id)
    #---cat tag part---
    if True:
        cattag = CatTag(NewsID=nid,TargetID=status.id,CatID=catinfo,Deleted=0,Type=4,UserID=userinfo,Time=status.Time)
        cattag.save()
    locationtag = LocationTag(Location=loinfo,Type=4,TargetID=status.id)
    locationtag.save()
    return status.id

def catdata_cat(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    cat = int(request.GET['cat'])
    news = CatData.objects.filter(CatID=cat).order_by("-id")
    news = list(news)
    result = []
    for item in news:
        if item.Deleted == 0:
            result.append(jsonCatDataByTargetID(item))
    result = json.dumps(result)
    return HttpResponse(result)

#-----------catdata comment below--------------

def catdata_reply(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    checkContent(content)
    status = int(request.GET['catdata'])
    targetid = int(request.GET['targetid'])
    ret = addCatDataComment(status,user,content,targetid)
    return HttpResponse('Succeed')

def catdata_replys(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    num = request.GET['num']
    status = int(request.GET['catdata'])
    type = request.GET['type']
    # improve here
    commentlist = list(CatDataComment.objects.filter(CatDataID = status).order_by('-id'))
    ret = jsonCatDataCommentList(commentlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def jsonCatDataCommentList(commentlist):
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
def addCatDataComment(status,user,content,targetid):
    userid = UserInfo.objects.get(id = user)
    statusid = CatData.objects.get(id = status)
    target = None
    try:
        target = CatDataComment.objects.get(id = targetid)
    except:
        pass
    statusc=CatDataComment(UserID=userid,Time=datetime.now(),CatDataID=statusid,Deleted=0,Content=content,TargetID=target)
    statusc.save()
    statusid.Comment_num += 1
    statusid.save()
    return statusc

#---------- delete function below-------------

def catdata_delete(request):
    user = request.GET['user']
    status = request.GET['catdata']
    type = request.GET['type']
    if type == 0:
        delCatData(status,user)
    elif type == 1:
        delCatDataComment(status,user)
    return HttpResponse('Succeed')

def delCatData(statusid,user):
    status = CatData.objects.get(id = statusid)
    status.Deleted = 1
    status.save()
    
def delCatDataComment(statusid,user):
    return 0