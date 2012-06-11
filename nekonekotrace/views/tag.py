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

#------------------tag get & new-----------------

def tag_new(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    name = request.GET['name']
    user = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = user)
    tag = AskTag(Name = name,UserID = userinfo,Time = datetime.now(),Deleted = 0)
    tag.save()
    return HttpResponse("Succeed")

def tag_all(request):
    id = int(request.GET['id'])
    #type = request.GET['type']
    ret = getTagListByID(id)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def getTagListByID(id):
    items = AskTag.objects.filter(id__gt = id)
    ret = []
    for item in items:
        ret2 = {}
        ret2['id'] = item.id
        ret2['name'] = item.Name
        ret.append(ret2)
    return ret

#------------------tag & focus---------------
# not used & checked
def tag_tag(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    user = UserInfo.objects.get(id=user)
    ask = int(request.GET['ask'])
    tag = int(request.GET['tag'])
    ask = Ask.objects.get(id = ask)
    tag = AskTag.objects.get(id = tag)
    tags = AskTags.objects.get(AskID=ask,TagID=tag,UserID=user)
    if tags != None:
        tags.Deleted = 1
        tags.save()
    else:    
        tags = AskTags(AskID = ask,TagID=tag,Deleted=0,UserID=user,Time=datetime.now())
        tags.save()
    return HttpResponse('Succeed')

def tag_focus(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    user = UserInfo.objects.get(id=user)
    tag = int(request.GET['id'])
    tag = AskTag.objects.get(id=tag)
    focus = list(AskTagFocus.objects.filter(TagID=tag,UserID=user))
    if len(focus) != 0:
        if focus[0].Deleted == 1:
            focus[0].Deleted = 0
        else:
            focus[0].Deleted = 1
        focus[0].save()
    else:
        focus = AskTagFocus(TagID=tag,UserID=user,Deleted=0)
        focus.save()
    return HttpResponse('Succeed')

def tag_focuses(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = user)
    lists = AskTagFocus.objects.filter(UserID=userinfo)
    lists = list(lists)
    ret = []
    for item in lists:
        if item.Deleted == 0:
            ret.append(item.id)
    ret = json.dumps(ret)
    return HttpResponse(ret)