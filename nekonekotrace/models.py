#-*- coding: UTF-8 -*-
from django.db import models

# Create your models here.
# Restrict the length

from django.contrib.auth.models import User

#-----------------user----------------------

class UserInfo(models.Model):
    user = models.ForeignKey(User, unique=True )
    Name = models.CharField(max_length=50)
    Intro = models.TextField()
    RegTime = models.DateTimeField()
    RRID = models.CharField(max_length=255) #renrenID
    Deleted = models.IntegerField()
    URL = models.CharField(max_length=255) # head url
    Session = models.CharField(max_length=255)
    PageUrl = models.CharField(max_length=255)
    LastLoginTime = models.DateTimeField()
    Token = models.TextField(null = True)

class Message(models.Model):
    Time = models.DateTimeField()
    UserID = models.ForeignKey(UserInfo, related_name='+')
    TargetID = models.ForeignKey(UserInfo, related_name='+',  null = True, blank = True)
    Content = models.TextField()
    Deleted = models.IntegerField()
    HasRead =  models.IntegerField() #0 for not 1 for yes
    
class Focus(models.Model):
    UserID = models.ForeignKey(UserInfo, related_name='+')
    TargetID = models.ForeignKey(UserInfo, related_name='+')
    Deleted = models.IntegerField()

#-------------------location------------------------

class Location(models.Model):
    Name = models.CharField(max_length=50)
    x = models.TextField()
    y = models.TextField()
    Deleted = models.IntegerField()
    UserID = models.ForeignKey(UserInfo)
    Time = models.DateTimeField()
    Visits = models.IntegerField()#the total number of the Location  visit
    
class LocationTag(models.Model):
    Location = models.ForeignKey(Location , related_name='+')    
    Type = models.IntegerField() #0 for Photo  1 for Status
    TargetID = models.IntegerField()
    
#-------------------cat-------------------------------

class CatInfo(models.Model):
    Name = models.CharField(max_length=50)
    Sex = models.IntegerField() #0 for female 1 for male 2 for unkonwn
    cat_image = models.CharField(max_length=255) #image url lower case is a tragedy
    lastLocation = models.ForeignKey(Location,  null = True , blank = True)
    Father = models.ForeignKey('self', related_name='+', null = True, blank = True)
    Mother = models.ForeignKey('self', related_name='+', null = True, blank = True)
    Deathday = models.DateField(null = True)
    Visits = models.IntegerField()#the total number of the cat page visits
    Birthday = models.DateField(null = True)
    UserID = models.ForeignKey(UserInfo, related_name='+')
    Time = models.DateTimeField()
    Content = models.TextField()

class CatTag(models.Model):
    TargetID = models.IntegerField()
    CatID = models.ForeignKey(CatInfo , related_name='+')
    x = models.IntegerField(null = True)
    y = models.IntegerField(null = True)
    w = models.IntegerField(null = True)
    h = models.IntegerField(null = True)
    Deleted = models.IntegerField() #0 for normal 1 for deleated by user 2 for deleated by manager
    Type = models.IntegerField() #0 for Photo  1 for Status
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Time = models.DateTimeField()
    Content = models.TextField(null = True)
    NewsID = models.IntegerField()

class CatFocus(models.Model):
    CatID = models.ForeignKey(CatInfo , related_name='+')
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Deleted = models.IntegerField() #0 for normal 1 for deleted by user 2 for deleted by manager

class CatImp(models.Model):
    CatID = models.ForeignKey(CatInfo , related_name='+')
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Deleted = models.IntegerField() #0 for normal 1 for deleted by user 2 for deleted by manager
    Time = models.DateTimeField()
    Content = models.TextField()

class CatData(models.Model):
    CatID = models.ForeignKey(CatInfo , related_name='+')
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Time = models.DateTimeField()
    Location = models.ForeignKey(Location , related_name='+')
    Deleted = models.IntegerField()
    Weight = models.IntegerField(null = True)
    Length = models.IntegerField(null = True)
    Health = models.TextField(null = True)
    Comment_num = models.IntegerField()
    Transmit_num = models.IntegerField()

class CatDataComment(models.Model):
    UserID = models.ForeignKey(UserInfo , related_name='+')
    CatDataID = models.ForeignKey(CatData , related_name='+')
    Time = models.DateTimeField()
    Content = models.TextField()
    Deleted = models.IntegerField()
    TargetID = models.ForeignKey('self',related_name='+', null = True, blank = True)

#----------------------asks--------------------------

class Ask(models.Model):
    URL = models.CharField(max_length=255)# image
    Time = models.DateTimeField()
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Title = models.CharField(max_length=255 , null = True, blank = True)
    Location = models.ForeignKey(Location , related_name='+', null = True)
    #0  normal 1  delete by myself 2 delete by manager
    #-1 solved -2 closed(unsolved)
    Deleted = models.IntegerField() 
    Remark = models.CharField(max_length=255 , null = True, blank = True)
    Visits = models.IntegerField()#the total number of the Photo page visits
    Comment_num = models.IntegerField()
    Transmit_num = models.IntegerField()

class AskComment(models.Model):
    UserID = models.ForeignKey(UserInfo , related_name='+')
    AskID = models.ForeignKey(Ask , related_name='+')
    Time = models.DateTimeField()
    Content = models.TextField()
    Deleted = models.IntegerField()
    TargetID = models.ForeignKey('self',related_name='+', null = True, blank = True)
    Canvas = models.TextField(null = True)
    CanvasImg = models.TextField(null = True)
    Score = models.IntegerField()

class AskTag(models.Model):
    Name = models.CharField(max_length=50)
    UserID = models.ForeignKey(UserInfo, related_name='+')
    Time = models.DateTimeField()
    Deleted = models.IntegerField() #0 for normal 1 for deleted by user 2 for deleted by manager

class AskTags(models.Model):
    AskID = models.ForeignKey(Ask , related_name='+')
    TagID = models.ForeignKey(AskTag , related_name='+')
    Deleted = models.IntegerField() #0 for normal 1 for deleted by user 2 for deleted by manager
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Time = models.DateTimeField()

class AskTagFocus(models.Model):
    TagID = models.ForeignKey(AskTag , related_name='+')
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Deleted = models.IntegerField() #0 for normal 1 for deleted by user 2 for deleted by manager

#-------------------------news---------------------------

class News(models.Model):
    Type = models.IntegerField() # 0 for photo  1 for Status
    TargetID = models.IntegerField()

class NewsSignal(models.Model):
    UserID = models.ForeignKey(UserInfo, related_name='+')
    News = models.BooleanField()
    Message = models.BooleanField()
    Reply = models.BooleanField()

#---------------photo----------------------

class Photo(models.Model):
    Type = models.IntegerField() # 0 for cat  1 for User
    URL = models.CharField(max_length=255)
    CatID = models.ForeignKey(CatInfo , related_name='+', null = True, blank = True)
    Time = models.DateTimeField()
    UserID = models.ForeignKey(UserInfo , related_name='+')
    Title = models.CharField(max_length=255 , null = True, blank = True)
    Location = models.ForeignKey(Location , related_name='+')
    Deleted = models.IntegerField() #0  normal 1  delete by myself 2 delete by manager
    Remark = models.CharField(max_length=255 , null = True, blank = True)
    Visits = models.IntegerField()#the total number of the Photo page visits
    Comment_num = models.IntegerField()
    Transmit_num = models.IntegerField()

class PhotoComment(models.Model):
    UserID = models.ForeignKey(UserInfo , related_name='+')
    PhotoID = models.ForeignKey(Photo , related_name='+')
    Time = models.DateTimeField()
    Content = models.TextField()
    Deleted = models.IntegerField()
    TargetID = models.ForeignKey('self',related_name='+', null = True, blank = True)
    
class UploadPhoto(models.Model):
    user = models.ForeignKey(UserInfo, unique=True )
    loading_num = models.IntegerField() #0 for none 1 2 ...for loading photo number
    images_url = models.CharField(max_length=255) # urls,url2,

#------------------status-----------------

class Status(models.Model):
    Type = models.IntegerField() # 0 for cat  1 for User
    Content = models.TextField()
    UserID = models.ForeignKey(UserInfo, related_name='+')
    CatID = models.ForeignKey(CatInfo , related_name='+',  null = True, blank = True)
    Deleted = models.IntegerField()
    Time = models.DateTimeField()
    Location = models.ForeignKey(Location , related_name='+')
    Comment_num = models.IntegerField()
    Transmit_num = models.IntegerField()
    Canvas = models.TextField(null = True)

class StatusComment(models.Model):
    UserID = models.ForeignKey(UserInfo, related_name='+')
    Time = models.DateTimeField()
    StatusID = models.ForeignKey(Status, related_name='+')
    Deleted = models.IntegerField()
    Content = models.TextField()
    TargetID = models.ForeignKey('self', related_name='+',  null = True, blank = True)
    
#----------------------notice-------------------------------

class Notice(models.Model):
    Title = models.TextField()
    Content = models.TextField()
    UserID = models.ForeignKey(UserInfo, related_name='+', null = True)
    CatID = models.ForeignKey(CatInfo , related_name='+', null = True)# admin cat needed
    Deleted = models.IntegerField()
    Time = models.DateTimeField()
    Comment_num = models.IntegerField()
    Transmit_num = models.IntegerField()

class NoticeComment(models.Model):
    UserID = models.ForeignKey(UserInfo, related_name='+')
    Time = models.DateTimeField()
    NoticeID = models.ForeignKey(Notice, related_name='+')
    Deleted = models.IntegerField()
    Content = models.TextField()
    TargetID = models.ForeignKey('self', related_name='+',  null = True, blank = True)

#-----------------------vote-----------------------------

class Vote(models.Model):
    Title = models.TextField()
    Content = models.TextField(null = True)
    UserID = models.ForeignKey(UserInfo, related_name='+')
    CatID = models.ForeignKey(CatInfo, related_name='+', null = True)# admin cat needed no name cat needed too
    Deleted = models.IntegerField()
    Type = models.IntegerField()# 0,1 for multiple allow add/not 2,3 for single allow add/not
    Time = models.DateTimeField()
    EndTime = models.DateTimeField(null = True)
    Comment_num = models.IntegerField()
    Transmit_num = models.IntegerField()

class VoteChoice(models.Model):
    Content = models.TextField()
    UserID = models.ForeignKey(UserInfo, related_name='+')
    Time = models.DateTimeField()
    VoteID = models.ForeignKey(Vote, related_name='+')
    Deleted = models.IntegerField()
    Choices = models.IntegerField()

class VoteChoices(models.Model):
    UserID = models.ForeignKey(UserInfo, related_name='+')
    Time = models.DateTimeField()
    VoteID = models.ForeignKey(Vote, related_name='+')
    ChoiceID = models.ForeignKey(VoteChoice, related_name='+')

class VoteComment(models.Model):
    UserID = models.ForeignKey(UserInfo, related_name='+')
    Time = models.DateTimeField()
    VoteID = models.ForeignKey(Vote, related_name='+')
    Deleted = models.IntegerField()
    Content = models.TextField()
    TargetID = models.ForeignKey('self', related_name='+',  null = True, blank = True)
    
#--------------------others--------------------

