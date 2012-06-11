# -*- coding: utf-8 -*-
import json
from nekonekotrace.models import *
from nekonekotrace.logic import RenrenAPI
from django.http import HttpResponse
from django.http import Http404
from datetime import datetime
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
#json generator import
from nekonekotrace.views.status import *
from nekonekotrace.views.photo import *
from nekonekotrace.views.catdata import *
from nekonekotrace.views.ask import *
from nekonekotrace.views.vote import *
from nekonekotrace.views.notice import *

def getNewsListByID(newsid , upordown, num):
    # upordown  0 id++ , 1 id--
    if upordown == 1:
        num = newsid - num
        news = News.objects.filter(id__lte = newsid ,id__gt = num ).order_by("-id")
    elif upordown == 0:
        num += newsid
        news = News.objects.filter(id__gte = newsid ,id__lt = num).order_by("id")
    else:
        raise 'Error'
    return list(news)

def jsonNewsList(newslist,isCat = False):
    result = []
    for item in newslist:
        idc = item.id
        if isCat == True:
            idc = item.NewsID
        if item.Type == 0:
            photo = Photo.objects.get(id = item.TargetID)
            if photo.Deleted == 0:
                result.append(jsonPhotoByTargetID(photo, idc, item.Type))
        elif item.Type == 1:
            status = Status.objects.get(id = item.TargetID)
            if status.Deleted == 0:
                result.append(jsonStatusByTargetID(status, idc, item.Type))
        elif item.Type == 2:
            photo = Notice.objects.get(id = item.TargetID)
            if photo.Deleted == 0:
                result.append(jsonNoticeByTargetID(photo, idc, item.Type))
        elif item.Type == 3:
            data = Vote.objects.get(id = item.TargetID)
            if data.Deleted == 0:
                result.append(jsonVoteByTargetID(data, idc, item.Type))
        elif item.Type == 4:
            data = CatData.objects.get(id = item.TargetID)
            if data.Deleted == 0:
                result.append(jsonCatDataByTargetID(data, idc, item.Type))  
        elif item.Type == 5:
            data = Ask.objects.get(id = item.TargetID)
            if data.Deleted == 0:
                result.append(jsonAskByTargetID(data, idc, item.Type))          
    return result

def news_all(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.GET['id'])
    typein = int(request.GET['type'])
    num = int(request.GET['num'])
    newslist = getNewsListByID(idin,typein,num)
    content = jsonNewsList(newslist)
    content = json.dumps(content)
    return HttpResponse(content)

def news_get(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.GET['id'])
    newslist = list(News.objects.filter(id = idin))
    content = jsonNewsList(newslist)
    content = json.dumps(content)
    return HttpResponse(content)

#-----------news cat----------------

def news_cat(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.GET['id'])
    catid = int(request.GET['cat'])
    typein = int(request.GET['type'])
    num = int(request.GET['num'])
    newslist = getNewsListByCatID(catid,idin,typein,num)
    content = jsonNewsList(newslist,True)
    content = json.dumps(content)
    return HttpResponse(content)

def getNewsListByCatID(catid, newsid, upordown, num):
    idc = CatInfo.objects.get(id=catid)
    # upordown  0 id++ , 1 id-- 2 from max
    if upordown == 2:
        news = CatTag.objects.filter(CatID=idc).order_by("-id")[:num]
    elif upordown == 1:
        news = CatTag.objects.filter(id__lte = newsid ,CatID=idc).order_by("-id")[:num]
    elif upordown == 0:
        news = CatTag.objects.filter(id__gte = newsid ,CatID=idc).order_by("id")[:num]
    else:
        raise 'Error'
    return list(news)

#-------------new location--------------
def news_location(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.GET['id'])
    catid = int(request.GET['location'])
    typein = int(request.GET['type'])
    num = int(request.GET['num'])
    newslist = getNewsListByLocationID(catid,idin,typein,num)
    content = jsonNewsList(newslist)
    content = json.dumps(content)
    return HttpResponse(content)

def getNewsListByLocationID(catid, newsid, upordown, num):
    idc = Location.objects.get(id=catid)
    # upordown  0 id++ , 1 id-- 2 from max
    if upordown == 2:
        news = LocationTag.objects.filter(Location=idc).order_by("-id")[:num]
    elif upordown == 1:
        news = LocationTag.objects.filter(id__lte = newsid ,Location=idc).order_by("-id")[:num]
    elif upordown == 0:
        news = LocationTag.objects.filter(id__gte = newsid ,Location=idc).order_by("id")[:num]
    else:
        raise 'Error'
    return list(news)

#----------wait--------------
def addNews(typein, newsid):
    new = News(Type = typein,TargetID = newsid)
    new.save()
    return new.id

def news_user(request):
    return Http404()

def news_update(request):
    return 0

# reset at the same time
def getNewsSingalByID(idin):
    signal = NewsSignal.objects.get(id = idin)
    ret = {}
    ret['news'] = signal.News
    ret['message'] = signal.Message
    ret['reply'] = signal.Reply
    
    signal.Message = False
    signal.News = False
    signal.Reply = False
    signal.save()  
    return ret