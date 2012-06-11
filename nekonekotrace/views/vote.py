#-*- coding: UTF-8 -*-
from django.http import *
from django.template.loader import get_template
from django.template import Context
from datetime import *
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from nekonekotrace.views.news import *
from nekonekotrace.models import *
#json generator import

#--------------vote below---------------
# it is amusing that jsonXX does not json it
# i am continuing to be lazy...
def jsonVoteByTargetID(status, newsid = -1, newstype = -1):
    userinfo = status.UserID
    ret = {}
    ret['newsid'] = newsid
    ret['newstype'] = newstype
    cat = status.CatID
    if cat != None:
        ret['name'] = cat.Name
        ret['headurl'] = cat.cat_image
    ret['title'] = status.Title
    ret['type'] = status.Type
    ret['content'] = status.Content
    ret['tnum'] = status.Transmit_num
    ret['id'] = status.id
    ret['cnum'] = status.Comment_num
    ret['time'] = status.Time.strftime('%Y-%m-%d %H:%M:%S')#
    #ret['endtime'] = str(status.EndTime)
    # get choices
    ret['votes'] = VoteChoices.objects.filter(VoteID = status).count()
    return ret

def vote_all(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    lists = list(Vote.objects.all())
    ret = []
    for item in lists:
        if item.Deleted == 0:
            ret.append(jsonVoteByTargetID(item))
    ret = json.dumps(ret)
    return HttpResponse(ret) 

def vote_new(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    cat = int(request.GET['cat'])
    title = request.GET['title']
    # to be modified
    endtime = request.GET['endtime']
    typein = request.GET['type']
    idv = addVote(user,title,content,cat,typein,endtime)
    addNews(3 , idv)
    return HttpResponse(str(idv))

def addVote(user,title,content,cat,typein,endtime):
    userinfo = UserInfo.objects.get(id = user)
    catinfo = None
    if cat != -1:
        catinfo = CatInfo.objects.get(id = cat)
    if endtime == "":
        endtime = None
    status = Vote(Title=title,Type=typein,EndTime=endtime,Content=content,UserID=userinfo,CatID=catinfo,Deleted=0,Time=datetime.now(),Comment_num=0,Transmit_num=0)
    status.save()
    return status.id

#get vote choices and counts
def vote_get(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    idin = int(request.GET['vote'])
    vote = Vote.objects.get(id = idin)
    vote = VoteChoice.objects.filter(VoteID = vote)
    vote = list(vote)
    ret = []
    for item in vote:
        if item.Deleted == 0:
            ret.append(jsonVoteChoice(item))
    ret = json.dumps(ret)
    return HttpResponse(ret)

def jsonVoteChoice(choice):
    ret = {}
    ret['content'] = choice.Content
    ret['count'] = choice.Choices
    ret['time'] = choice.Time.strftime('%Y-%m-%d %H:%M:%S')#
    ret['id'] = choice.id
    userinfo = choice.UserID
    ret['name'] = userinfo.Name
    return ret

#-----------vote choice below---------------

def vote_add(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    idin = int(request.GET['vote'])
    addChoice(user,content,idin)
    return HttpResponse(str(idin))

def addChoice(user,content,vote):
    userinfo = UserInfo.objects.get(id = user)
    voteinfo = Vote.objects.get(id = vote)
    # not allowed to add except creator
    if voteinfo.Type%2 == 1:
        if userinfo != voteinfo.UserID:
            raise Exception('Error')
    choice = VoteChoice(Content=content,UserID=userinfo,Time=datetime.now(),VoteID=voteinfo,Deleted=0,Choices=0)
    choice.save()

def vote_vote(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    idin = int(request.GET['vote'])
    return addChoices(user,idin)

def addChoices(user,idin):
    userinfo = UserInfo.objects.get(id = user)
    choiceinfo = VoteChoice.objects.get(id = idin)
    voteinfo = choiceinfo.VoteID
    # test if multiple vote
    ret = VoteChoices.objects.filter(UserID=userinfo,ChoiceID=choiceinfo).count()
    if ret >= 1:
        return HttpResponse('Error')
    # test if multiple in a single one
    if voteinfo.Type >= 2 and voteinfo.Type <= 3:
        ret = VoteChoices.objects.filter(UserID=userinfo,VoteID=voteinfo).count()
        if ret >= 1:
            return HttpResponse('Error')
    # test finish
    choices = VoteChoices(UserID=userinfo,Time=datetime.now(),VoteID=voteinfo,ChoiceID=choiceinfo)
    choices.save()
    choiceinfo.Choices += 1
    choiceinfo.save()
    return HttpResponse('Succeed')

#-----------vote comment below--------------

def vote_reply(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    user = int(request.user.first_name)
    content = request.GET['content']
    status = int(request.GET['vote'])
    targetid = int(request.GET['targetid'])
    ret = addVoteComment(status,user,content,targetid)
    return HttpResponse('Succeed')

def vote_replys(request):
    if not request.user.is_authenticated():
        raise Exception('Error')
    num = request.GET['num']
    status = int(request.GET['vote'])
    type = request.GET['type']
    # improve here
    commentlist = list(VoteComment.objects.filter(VoteID = status).order_by('-id'))
    ret = jsonVoteCommentList(commentlist)
    ret = json.dumps(ret)
    return HttpResponse(ret)

def jsonVoteCommentList(commentlist):
    result = []
    for item in commentlist:
        if(item.Deleted == 0):
            ret = {}
            ret['headurl'] = item.UserID.URL
            ret['name'] = item.UserID.Name
            ret['content'] = item.Content
            ret['time'] = item.Time.strftime('%Y-%m-%d %H:%M:%S')#
            ret['replytoid'] = item.TargetID.id
            ret['comment'] = item.id
            result.append(ret)
    return result

# replied which means the user replied is deprecated
def addVoteComment(status,user,content,targetid):
    userid = UserInfo.objects.get(id = user)
    statusid = Vote.objects.get(id = status)
    target = None
    try:
        target = VoteComment.objects.get(id = targetid)
    except:
        pass
    statusc=VoteComment(UserID=userid,Time=datetime.now(),VoteID=statusid,Deleted=0,Content=content,TargetID=target)
    statusc.save()
    statusid.Comment_num += 1
    statusid.save()
    return statusc

#---------- delete function below-------------

def vote_delete(request):
    user = request.GET['user']
    status = request.GET['vote']
    type = request.GET['type']
    if type == 0:
        delVote(status,user)
    elif type == 1:
        delVoteComment(status,user)
    return HttpResponse('Succeed')

def delVote(statusid,user):
    status = Vote.objects.get(id = statusid)
    status.Deleted = 1
    status.save()
    
def delVoteComment(statusid,user):
    return 0