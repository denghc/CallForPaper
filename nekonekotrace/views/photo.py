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

#------------photo get & new-------------------

def addPhoto(typein, url, cat, user, title, location,remark):
    locationinfo = Location.objects.get(id = location)
    userinfo = UserInfo.objects.get(id = user)
    if(typein == 0):
        catinfo = CatInfo.objects.get(id = cat)
        photo = Photo(Type =typein ,URL = url,CatID = catinfo,Time = datetime.now(), UserID = userinfo, Title = title, Location = locationinfo,
            Deleted = 0,Remark = remark, Visits = 0, Comment_num = 0,Transmit_num = 0)
    else:
        photo = Photo(Type =typein ,URL = url,Time = datetime.now(), UserID = userinfo, Title = title, Location = locationinfo,
            Deleted = 0,Remark = remark, Visits = 0, Comment_num = 0,Transmit_num = 0)
    photo.save()
    #addNews(0 , id)
    new = News(Type = 0,TargetID = photo.id)
    nid = new.save()
    #---cat tag part---
    if typein == 0:
        cattag = CatTag(NewsID=nid,TargetID=photo.id,CatID=catinfo,Deleted=0,Type=0,UserID=userinfo,Time=photo.Time)
        cattag.save()
    locationtag = LocationTag(Location=locationinfo,Type=0,TargetID=photo.id)
    locationtag.save()
    return photo.id

def jsonPhotoByTargetID(photo,newsid=-1,newstype=-1):
    userinfo = photo.UserID
    result = {}
    result['newsid'] = newsid
    result['newstype'] = newstype
    result['userid'] = userinfo.id
    if photo.Type == 1:
        result['headurl'] = userinfo.URL
        result['name'] = userinfo.Name
    else:
        cat = photo.CatID
        result['name'] = cat.Name
        result['headurl'] = cat.cat_image
    result['remark'] = photo.Remark
    result['tnum'] = photo.Transmit_num
    result['cnum'] = photo.Comment_num
    result['time'] = photo.Time.strftime('%Y-%m-%d %H:%M:%S')
    result['location'] = photo.Location.id
    result['id'] = photo.id
    result['imageurl'] = photo.URL
    result['title'] = photo.Title
    return result

#need to be resolved
@csrf_exempt
def photo_single(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    typei = int(request.GET['type'])
    content = request.GET['content']
    cat = int(request.GET['cat'])
    location_id = int(request.GET['location'])
    title = request.GET['title']
    typein = request.GET['typeimg']
    #
    fname = request.user.first_name + '_'
    fname += str(datetime.now()).replace(":","_")
    if len(request.FILES) == 0:
        data = request.raw_post_data
        fname = saveImage(fname,typein,'\upimage\\',data)
    else:
        f = request.FILES['file']
        fname = saveImageFile(fname,typein,'\upimage\\',f)
        content = request.POST['content']
    #   
    img = '../../static/upimage/' + fname
    idp = addPhoto(typei, img, cat, user, title, location_id,content)
    return HttpResponse('Succeed')


def photo_new(request):
    raise Exception('Error')

#-----------photo comment below--------------

# replied which means the user replied is deprecated
def addPhotoComment(photo,user,content,targetid):
    userid = UserInfo.objects.get(id = user)
    photoid = Photo.objects.get(id = photo)
    target = None
    if targetid != -1:
        target = PhotoComment.objects.get(id = targetid)
    photocomment = PhotoComment(UserID=userid,Time=datetime.now(),PhotoID=photoid,Deleted=0,Content=content,TargetID=target)
    photocomment.save()
    photoid.Comment_num += 1
    photoid.save()
    return photocomment

# json stands for list it anyhow
def jsonPhotoCommentList(commentlist):
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

def photo_reply(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    checkContent(content)
    photo = int(request.GET['photo'])
    targetid = int(request.GET['targetid'])
    ret = addPhotoComment(photo,user,content,targetid)
    return HttpResponse('Succeed')

def photo_replys(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    num = request.GET['num']
    photo = int(request.GET['photo'])
    type = request.GET['type']
    # improve here
    commentlist = list(PhotoComment.objects.filter(PhotoID = photo).order_by('-id'))
    ret = jsonPhotoCommentList(commentlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

#---------------del--------------------

def photo_delete(request):
    user = request.GET['user']
    photo = request.GET['photo']
    type = request.GET['type']
    if type == 0:
        delPhoto(photo,user)
    elif type == 1:
        delPhotoComment(photo,user)
    return HttpResponse('Succeed')

def delPhoto(photoid,user):
    photo = Photo.objects.get(id = photoid)
    photo.Deleted = 0
    photo.save()

def delPhotoComment(photocomid, user):
    photocomment = PhotoComment.objects(id  = photocomid)
    photocomment.Deleted = 0
    return 0

#--------------other--------------------

def photo_transfer(request):
    return HttpResponse('Error');
    user = int(request.GET['user'])
    photoid = int(request.GET['photo'])
    workerinfo  = UserInfo.objects.get(id = user)
    photo= Photo.objects.get(id = photoid)
    newphoto = addPhoto(photo.Type, photo.URL, photo.CatID, photo.UserID, photo.Title, photo.Location, u'转自:' + workerinfo.Name + u': '+photo.Remark )
    addNews(0,newphoto.id)
    photo.Transmit_num += 1
    photo.save()
    ret = jsonPhotoByTargetID(newphoto.id)
    return HttpResponse(ret)