'''
Created on 2012-3-17

@author: DELL
'''
import json
from django.http import *
from datetime import datetime
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from nekonekotrace.models import *
#json generator import

def location_new(request):
    x = request.GET['x']
    y = request.GET['y']
    content = request.GET['name']
    if request.user.is_authenticated():
        addLocation(x,y,content,int(request.user.first_name))
    else:
        raise Exception('Error')
    return HttpResponse("Succeed")

def addLocation(x,y,content,user):
    userid = UserInfo.objects.get(id = user)
    location = Location(Name=content,x=x,y=y,Deleted=0,UserID=userid,Time=datetime.now(),Visits=0)
    location.save()

def location_all(request):
    id = int(request.GET['id'])
    #type = request.GET['type']
    ret = getLocationListByID(id)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def getLocationListByID(id):
    items = Location.objects.filter(id__gt = id)
    ret = []
    for item in items:
        ret2 = {}
        ret2['id'] = item.id
        ret2['name'] = item.Name
        ret2['x'] = item.x
        ret2['y'] = item.y
        ret.append(ret2)
    return ret

# switch for at least two types

def location_delete(request):
    try:
        id = request.GET['id']
    except:
        return HttpResponse('Error')
    delLocation(id)
    return HttpResponse('Succeed')

def delLocation(id):
    lo = Location.objects.get(id = id)
    lo.Deleted = 1
    lo.save()