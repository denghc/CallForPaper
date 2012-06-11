'''
Created on 2012-3-18

@author: DELL
'''
from django.contrib import admin
from nekonekotrace.models import *

admin.site.register(UserInfo)
admin.site.register(Location)
admin.site.register(CatInfo)
admin.site.register(CatTag)
admin.site.register(News)
admin.site.register(Photo)
admin.site.register(PhotoComment)
admin.site.register(Status)
admin.site.register(StatusComment)
admin.site.register(Message)
admin.site.register(UploadPhoto)
