# -*- coding: utf-8 -*-
# Create your views here.
# functions that render tuples start with 'dress'
import md5
from django.conf import *
from django.contrib import auth
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.simple import direct_to_template
from django.contrib.auth.models import User
from nekonekotrace.models import *
from nekonekotrace.views.news import *
from nekonekotrace.views.status import *
from nekonekotrace.views.photo import *
from nekonekotrace.views.user import *
from nekonekotrace.logic import RenrenAPI

# env: 1 for android phone, 0 for renren app
def returnFunction(page,request,env,session):
    maxNewsID = News.objects.count()
    userinfo = int(request.user.first_name)
    userinfo = UserInfo.objects.get(id=userinfo)
    userinfo.LastLoginTime = datetime.now()
    userinfo.Session = session
    userinfo.Token = md5.new(session).hexdigest()
    userinfo.save()
    usertype = 0
    if request.user.is_superuser:
        usertype = 1
    return render_to_response(page, {'maxNewsID':maxNewsID ,  'thisEnv': env,
        'user_time': userinfo.Token, 'user_id': userinfo.id, 'user_img': userinfo.URL,'user_type':usertype,'user_name':userinfo.Name
    }, context_instance=RequestContext(request))


#------------------------phone home-------------------

def phone_home(request):
    #return HttpResponse('Error');
    userid = int(request.GET['user'])
    token = request.GET['token']
    RenRenid = userid
    response = None
    #---------------RR part------------------
    params = {"method": "users.getInfo", "fields": "uid, name, headurl"} 
    apiClient = RenrenAPI.RenRenAPIClient(token)
    response = apiClient.request(params)
    RenRenid = response[0]["uid"]
    #---------------RR end-------------------
    if userid == RenRenid:
        # in the DB
        if len(UserInfo.objects.filter(RRID = userid)) > 0:
            pass
        else:
            newName = str(userid)
            headurl = "../../static/rrapp/cat.png"
            #-----------RR part--------------
            newName = response[0]["name"]
            headurl = response[0]["headurl"]
            #-----------RR part--------------
            CreateUserInfoByID(userid, newName, headurl)
        user = auth.authenticate(username=userid, password=userid)
        if user is None:
            raise Exception("Error")
        auth.login(request, user)      
    else:
        # deal with token error, maybe 404
        raise Exception("Error")
    
    return returnFunction('phone/index.html',request,1,token)
    
#---------------------web home-----------------------
# test usage now
def web_home(request):
    #return HttpResponse('Error');
    userid = int(request.GET['user'])
    token = request.GET['token']
    RenRenid = userid
    response = None
    #---------------RR part------------------
    #params = {"method": "users.getInfo", "fields": "uid, name, headurl"} 
    #apiClient = RenrenAPI.RenRenAPIClient(token)
    #response = apiClient.request(params)
    #RenRenid = response[0]["uid"]
    #---------------RR end-------------------
    if userid == RenRenid:
        # in the DB
        if len(UserInfo.objects.filter(RRID = userid)) > 0:
            pass
        else:
            newName = str(userid)
            headurl = "../../static/rrapp/cat.png"
            #-----------RR part--------------
            #newName = response[0]["name"]
            #headurl = response[0]["headurl"]
            #-----------RR end---------------
            CreateUserInfoByID(userid, newName, headurl)
        user = auth.authenticate(username=userid, password=userid)
        if user is None:
            raise Exception("Error")
        auth.login(request, user)      
    else:
        # deal with token error, maybe 404
        raise Exception("Error")
    
    return returnFunction('phone/index.html',request,1,token)

#--------------------renren app-------------------------
# use it to authorize
def renrenapp_welcome(request):   
    return render_to_response('renrenapp/welcome.html', {
    }, context_instance=RequestContext(request))

def renrenapp_home(request):
    params = {"method": "users.getInfo", "fields": "name,headurl,tinyurl"}
    apiClient = RenrenAPI.RenRenAPIClient(request.GET['xn_sig_session_key'])
    response = apiClient.request(params)
    userid = response[0]['uid']
    # in the DB
    if len(UserInfo.objects.filter(RRID = userid)) > 0:
        pass
    else:
        newName = str(userid)
        headurl = "../../static/rrapp/cat.png"
        #-----------RR part--------------
        newName = response[0]["name"]
        headurl = response[0]["headurl"]
        CreateUserInfoByID(userid, newName, headurl)
    user = auth.authenticate(username=userid, password=userid)
    if user is None:
        raise Exception("Error")
    auth.login(request, user)
    
    return returnFunction('renrenapp/home.html',request,0,request.GET['xn_sig_session_key'])
    