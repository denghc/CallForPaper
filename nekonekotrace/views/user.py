import json
from nekonekotrace.models import *
from datetime import datetime
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.db.models import Q
'''
Created on 2012-3-17

@author: DELL
@change: add CreateUserInfoByID function
'''

# with message function here
#---------------------user info------------------------

def getUserInfoByID(userId, typein, userinfo, useid = True):
    if useid == True:
        userId = UserInfo.objects.get(id=userId)
    ud = {}
    ud['name'] = userId.Name
    ud['RRID'] = userId.RRID;
    ud['URL'] = userId.URL;#head image
    ud['id'] = userId.id;
    ud['lasttime'] = userId.LastLoginTime.strftime('%Y-%m-%d %H:%M:%S')
    if typein == 1:
        ud['Intro'] = userId.Intro
        ud['RegTime'] = userId.RegTime.strftime('%Y-%m-%d %H:%M:%S')
        ud['PageUrl'] = userId.PageUrl
        ud['focus'] = 1
        focus = list(Focus.objects.filter(TargetID=userId,UserID=userinfo))
        if len(focus) == 0:
            ud['focus'] = 0
        else:
            if focus[0].Deleted != 0:
                ud['focus'] = 0
    #TODO
    # photo send count
        #ud['photonum'] = Photo.objects.filter(Author = userId).count()   
    # favorite num
    #ud['favoritecat'] = Favorite.objects.filter(UserID = userId).count()  
    # treat times
    #ud['treat'] = Treat.objects.filter(Author = userId).count()
    return ud

def CreateUserInfoByID(userid, username, headurl):
    # password wait to be discussed
    newuser = User.objects.create_user(username = userid, email = "", password = userid)
    newuser.is_staff = True
    newuser.save()
    url = "www.renren.com" + str(userid)
    newUser = UserInfo(user = newuser, Name = username, Intro = "", RegTime = datetime.now(), LastLoginTime = datetime.now(), RRID = userid, Deleted = 0, URL = headurl, Session = "", PageUrl = url)
    newUser.save()
    # used for searching
    newuser.first_name = str(newUser.id)
    newuser.save()

def user_set(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = idin)
    intro = request.GET['intro']
    userinfo.Intro = intro
    userinfo.save()
    userinfo = getUserInfoByID(userinfo,1,userinfo,False)
    userinfo = json.dumps(userinfo)
    return HttpResponse(userinfo)

def user_info(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = idin)
    idin = int(request.GET['id'])
    ret = getUserInfoByID(idin,1,userinfo)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def user_all(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    lists = list(UserInfo.objects.all())
    ret = []
    for item in lists:
        ret.append(getUserInfoByID(item,0,None,False))
    ret = json.dumps(ret)
    return HttpResponse(ret)

#-------------messages below---------------
#send a message
def user_message(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    target= int(request.GET['target'])
    result = addMessage(user,content,target)
    result = jsonMessage(result)
    result = json.dumps(result)
    return HttpResponse(result)

#get a message by id
def user_msg(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    user = UserInfo.objects.get(id=user)
    idin = int(request.GET['id'])
    idin = Message.objects.get(id = idin)
    if idin.TargetID == user or idin.UserID == user:
        ret = jsonMessage(idin)
        ret = json.dumps(ret)
        return HttpResponse(ret)
    else:
        raise Exception('Error')
    
def addMessage(user,content,target):
    userinfo = UserInfo.objects.get(id = user)
    targetinfo = UserInfo.objects.get(id = target)
    message = Message(UserID=userinfo,Time=datetime.now(),TargetID=targetinfo,Content=content,Deleted=0,HasRead=0)
    message.save()
    return message

#not right
def user_messages(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    user = UserInfo.objects.get(id = user)
    target = int(request.GET['target'])
    target = UserInfo.objects.get(id = target)
    if user == target:
        raise Exception('Error')
    idin = int(request.GET['id'])
    if idin == -1:
        idin = 99999
    mlist = list(Message.objects.filter((Q(UserID=user,TargetID=target) | Q(UserID=target,TargetID=user)), Q(id__lt = idin)).order_by('-id')[:3])
    ret = jsonMessageList(mlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def jsonMessageList(mlist):
    result = []
    for item in mlist:
        if(item.Deleted == 0):
            ret = jsonMessage(item)
            result.append(ret)
    return result

#to be resolved
def jsonMessage(item):
    ret = {}
    #ret['headurl'] = item.UserID.URL
    ret['name'] = item.UserID.Name
    ret['fromid'] = item.UserID.id
    ret['toid'] = item.TargetID.id
    ret['content'] = item.Content
    ret['time'] = item.Time.strftime('%Y-%m-%d %H:%M:%S')
    ret['id'] = item.id
    return ret

#--------------------focus-------------------

def user_focus(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = user)
    target = int(request.GET['id'])
    if target == -1:
        target = request.GET['rrid']
        target = UserInfo.objects.get(RRID = target)
    else:
        target = UserInfo.objects.get(id = target)
    if target == userinfo:
        raise Exception("Error")
    focus = list(Focus.objects.filter(UserID=userinfo,TargetID=target))
    if len(focus) == 0:
        focus = Focus(UserID=userinfo,TargetID=target,Deleted=0)
        focus.save()
        return HttpResponse("Succeed")
    else:
        if focus[0].Deleted == 1:
            focus[0].Deleted = 0
        else:
            focus[0].Deleted = 1
        focus[0].save()
        return HttpResponse("Succeed")
    
def user_focuses(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id = user)
    lists = Focus.objects.filter(UserID=userinfo)
    lists = list(lists)
    ret = []
    for item in lists:
        if item.Deleted == 0:
            ret.append(getUserInfoByID(item.TargetID,0,None,False))
    ret = json.dumps(ret)
    return HttpResponse(ret)