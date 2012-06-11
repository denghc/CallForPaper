import json
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt
from django.template import Context
from django.http import HttpResponse
from settings import *
#
from nekonekotrace.models import *
from nekonekotrace.views.location import *
from nekonekotrace.logic.Core import *
'''
Created on 2012-3-17

@author: DELL
'''
#-------------get cat one or list--------------
# same as user
def getCatInfoByID(catInfo, type, userinfo, isID = True):
    if isID == True:
        catInfo = CatInfo.objects.get(id=catInfo)
    ret = {}
    ret['id'] = catInfo.id
    ret['name'] = catInfo.Name
    ret['sex'] = catInfo.Sex# 1 for male 0 female 2 unknown
    ret['headurl'] = catInfo.cat_image
    ret['intro'] = catInfo.Content
    if type == 1:
        ret['visits'] = catInfo.Visits
        ret['father'] = catInfo.Father
        ret['mother'] = catInfo.Mother
        ret['birthday'] = catInfo.Birthday
        
        ret['focus'] = 1
        focus = list(CatFocus.objects.filter(CatID=catInfo,UserID=userinfo))
        if len(focus) == 0:
            ret['focus'] = 0
        else:
            if focus[0].Deleted != 0:
                ret['focus'] = 0
    return ret

def cat_get(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = user)
    idin = int(request.GET['id'])
    ret = getCatInfoByID(idin,1,userinfo)
    #ret = dressCatList(catlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def cat_all(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    catlist = list(CatInfo.objects.all())
    ret = jsonCatList(catlist)
    #ret = dressCatList(catlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def jsonCatList(catlist):
    ret = []
    for item in catlist:
        r = {}
        r['name'] = item.Name
        r['id'] = item.id
        r['headurl'] = item.cat_image
        r['content'] = item.Content
        ret.append(r)
    return ret

#-----------new cat---------------

#need to be resolved
@csrf_exempt
def cat_new(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    userin = int(request.user.first_name)
    name = request.GET['name']
    intro = request.GET['intro']
    sex = int(request.GET['sex'])
    typein = request.GET['type']
    #
    data = request.raw_post_data
    fname = request.user.first_name + '_'
    fname += str(datetime.now()).replace(":","_")
    #
    if len(request.FILES) == 0:
        data = request.raw_post_data
        fname = saveImage(fname,typein,'\catimage\\',data)
    else:
        f = request.FILES['file']
        fname = saveImageFile(fname,typein,'\catimage\\',f)
        name = request.POST['name']
        intro = request.POST['intro']
    #test = os.path.abspath(name)
    img = '../../static/catimage/' + fname
    addCatInfo(userin,name,intro,img,sex)
    return HttpResponse('Good')
    
def addCatInfo(user,name,intro,img,sex):
    userinfo = UserInfo.objects.get(id = user)
    catinfo = CatInfo(Name = name,Sex = sex,cat_image=img,Visits=0,UserID=userinfo,Time=datetime.now(),Content=intro)
    catinfo.save()
    return catinfo

#-------------focus----------------

def cat_focus(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = user)
    target = int(request.GET['id'])
    target = CatInfo.objects.get(id = target)
    focus = list(CatFocus.objects.filter(UserID=userinfo,CatID=target))
    if len(focus) == 0:
        focus = CatFocus(UserID=userinfo,CatID=target,Deleted=0)
        focus.save()
        return HttpResponse("Succeed")
    else:
        if focus[0].Deleted == 1:
            focus[0].Deleted = 0
        else:
            focus[0].Deleted = 1
        focus[0].save()
        return HttpResponse("Succeed")
    
def cat_focuses(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.GET['id'])
    userinfo = UserInfo.objects.get(id = user)
    lists = CatFocus.objects.filter(UserID=userinfo)
    lists = list(lists)
    ret = []
    for item in lists:
        if item.Deleted == 0:
            ret.append(getCatInfoByID(item.CatID,0,None,False))
    ret = json.dumps(ret)
    return HttpResponse(ret)

#---------------cat imps-----------------------
def cat_imp(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = user)
    target = int(request.GET['id'])
    target = CatInfo.objects.get(id = target)
    content = request.GET['content']
    imp = CatImp(CatID=target,UserID=userinfo,Deleted=0,Time=datetime.now(),Content=content)
    imp.save()
    return HttpResponse("Succeed")

def getCatImpByID(item):
    ret = {}
    ret['content'] = item.Content
    ret['time'] = item.Time.strftime('%Y-%m-%d %H:%M:%S')
    return ret

def cat_imps(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    target = int(request.GET['id'])
    target = CatInfo.objects.get(id = target)
    lists = list(CatImp.objects.filter(CatID=target))
    ret = []
    for item in lists:
        if item.Deleted == 0:
            ret.append(getCatImpByID(item))
    ret = json.dumps(ret)
    return HttpResponse(ret)