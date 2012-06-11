#-*- coding: UTF-8 -*-
import uuid
import dajax
import hashlib
from settings import *
from django.template.loader import get_template
from django.template import Context
from django.http import *
from datetime import datetime
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from nekonekotrace.models import *
from dajax.core import Dajax
from dajaxice.decorators import dajaxice_register
from settings import USERPHOTO_ABS_PATH
from django.views.decorators.csrf import csrf_exempt
from nekonekotrace.views.news import *
from nekonekotrace.logic.Check import *
from nekonekotrace.logic.Core import *
from django import forms

#------------ask get & new-------------------
# lazy to replace below
# or time is limited :D

def addAsk(url,user, title, location, remark):
    userinfo = UserInfo.objects.get(id = user)
    if location == -1:
        photo = Ask(URL = url,Time = datetime.now(), UserID = userinfo, Title = title,
            Deleted = 0,Remark = remark, Visits = 0, Comment_num = 0,Transmit_num = 0)
        photo.save()
    else:
        locationinfo = Location.objects.get(id = location)
        photo = Ask(URL = url,Time = datetime.now(), UserID = userinfo, Title = title, Location = locationinfo,
            Deleted = 0,Remark = remark, Visits = 0, Comment_num = 0,Transmit_num = 0)
        photo.save()
        locationtag = LocationTag(Location=locationinfo,Type=5,TargetID=photo.id)
        locationtag.save();
    return photo

def jsonAskList(newslist):
    result = []
    for item in newslist:
        if item.Deleted == 0:
            result.append(jsonAskByTargetID(item))
    return result

#actually not id
def jsonAskByTargetID(photo,newsid=-1,newstype=-1):
    userinfo = photo.UserID
    result = {}
    result['newsid'] = newsid
    result['newstype'] = newstype
    result['userid'] = userinfo.id
    result['headurl'] = userinfo.URL
    result['name'] = userinfo.Name
    result['remark'] = photo.Remark
    result['tnum'] = photo.Transmit_num
    result['cnum'] = photo.Comment_num
    result['time'] = photo.Time.strftime('%Y-%m-%d %H:%M:%S')
    if photo.Location == None:
        result['location'] = -1
    else:
        result['location'] = photo.Location.id
    result['id'] = photo.id
    result['imageurl'] = photo.URL
    result['title'] = photo.Title
    
    tagj = []
    tags = list(AskTags.objects.filter(AskID=photo))
    for item in tags:
        if item.Deleted == 0:
            tagj.append(item.TagID.id)
    tags = json.dumps(tagj)
    result['tags']=tags
    return result

def getAskListByID(newsid , upordown, num):
    # upordown  0 id++ , 1 id--
    if upordown == 1:
        num = newsid - num
        news = Ask.objects.filter(id__lte = newsid ,id__gt = num ).order_by("-id")
    elif upordown == 0:
        num += newsid
        news = Ask.objects.filter(id__gte = newsid ,id__lt = num).order_by("id")
    else:
        raise 'Error'
    return list(news)

def ask_asks(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.GET['id'])
    typein = int(request.GET['type'])
    num = int(request.GET['num'])
    newslist = getAskListByID(idin,typein,num)
    content = jsonAskList(newslist)
    content = json.dumps(content)
    return HttpResponse(content)

#need to be resolved
@csrf_exempt
def ask_new(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    location_id = int(request.GET['location'])
    title = request.GET['title']
    typein = request.GET['typeimg']
    tags = request.GET['tags']
    #
    data = request.raw_post_data
    img = " "
    if data != "":
        fname = request.user.first_name + '_'
        fname += str(datetime.now()).replace(":","_")
        fname = saveImage(fname,typein,'\\askimage\\',data)
    
        img = '../../static/askimage/' + fname
    idp = addAsk(img, user, title, location_id,content)
    #addNews(0 , id)
    new = News(Type = 5,TargetID = idp.id)
    new.save()
    #add tags
    tags = tags.split()
    user = UserInfo.objects.get(id = user)
    for item in tags:
        tag = AskTag.objects.get(id = int(item))
        temp = AskTags(AskID=idp,TagID=tag,Deleted=0,UserID=user,Time=datetime.now())
        temp.save()
    #get ask json
    idp = jsonAskByTargetID(idp)
    idp = json.dumps(idp)
    return HttpResponse(idp)

#-----------ask comment below--------------

# replied which means the user replied is deprecated
def addAskComment(photo,user,content,targetid,canvas):
    userid = UserInfo.objects.get(id = user)
    photoid = Ask.objects.get(id = photo)
    target = None
    if targetid != -1:
        target = AskComment.objects.get(id = targetid)
    photocomment = AskComment(UserID=userid,Time=datetime.now(),AskID=photoid,Deleted=0,Content=content,TargetID=target,Canvas=canvas,Score=0)
    photocomment.save()
    photoid.Comment_num += 1
    photoid.save()
    return photocomment

# json stands for list it anyhow
def jsonAskCommentList(commentlist):
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
            ret['askid'] = item.AskID.id
            ret['canvas'] = item.Canvas
            ret['canvasimg'] = item.CanvasImg
            ret['score'] = item.Score
            ret['userid'] = item.UserID.id
            ret['id'] = item.id
            result.append(ret)
    return result

#need to be resolved
@csrf_exempt
def ask_reply(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    canvas = request.raw_post_data
    checkContent(content)
    photo = int(request.GET['ask'])
    targetid = int(request.GET['targetid'])
    ret = addAskComment(photo,user,content,targetid,canvas)
    ret = list([ret])
    ret = jsonAskCommentList(ret)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def ask_replys(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    user = UserInfo.objects.get(id = user)
    #num = request.GET['num']
    photo = int(request.GET['ask'])
    photo = Ask.objects.get(id = photo)
    #type = request.GET['type']
    photoid = int(request.GET['replyid'])
    # improve here not type now
    commentlist = None
    if photoid != -1:
        commentlist = list(AskComment.objects.filter(AskID = photo,id__gt = photoid).order_by('id'))
    else:
        commentlist = list(AskComment.objects.filter(AskID = photo).order_by('id'))
    ret = jsonAskCommentList(commentlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def ask_score(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    comment = int(request.GET['comment'])
    score = int(request.GET['score'])
    if score < 0 or score > 5:
        raise Exception('Error')
    comment = AskComment.objects.get(id=comment)
    user = UserInfo.objects.get(id=user)
    if comment.AskID.UserID != user:
        raise Exception('Error')
    comment.Score = score
    comment.save()
    return HttpResponse("Succeed")

#---------------del--------------------

def ask_delete(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    photo = request.GET['ask']
    typein = request.GET['type']
    if typein == 0 or typein == -1 or typein == -2:
        delAsk(photo,user,type)
    elif typein == 1:
        delAskComment(photo,user)
    else:
        raise Exception("Error")
    return HttpResponse('Succeed')

def delAsk(photoid,user,typein):
    photo = Ask.objects.get(id = photoid)
    user = UserInfo.objects.get(id = user)
    if photo.UserID == user:       
        photo.Deleted = typein
        photo.save()
    else:
        raise Exception("Error")

def delAskComment(photocomid, user):
    photocomment = AskComment.objects(id  = photocomid)
    photocomment.Deleted = 0
    photocomment.save()
    return 0