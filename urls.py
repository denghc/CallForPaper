from django.conf.urls.defaults import patterns, include, url
from django.conf import settings
# Uncomment the next two lines to enable the admin:

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from nekonekotrace.views.photo import *
from nekonekotrace.views.ask import *
from nekonekotrace.views.location import *
from nekonekotrace.views.news import *
from nekonekotrace.views.status import *
from nekonekotrace.views.notice import *
from nekonekotrace.views.cat import *
from nekonekotrace.views.dress import *
from nekonekotrace.views.user import *
from nekonekotrace.views.vote import *
from nekonekotrace.views.views import *
from nekonekotrace.views.catdata import *
from nekonekotrace.views.tag import *
from django.contrib import admin
admin.autodiscover()
from dajaxice.core import dajaxice_autodiscover
dajaxice_autodiscover()

urlpatterns = patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/', include(admin.site.urls)),
    # index
    url(r'^phone/home/$',phone_home),
    url(r'^web/home/$',web_home),
    url(r'^renrenapp/welcome/$',renrenapp_welcome),
    url(r'^renrenapp/home/$',renrenapp_home),
    # news
    url(r'^news/all/$', news_all),
    url(r'^news/get/$', news_get),
    url(r'^news/cat/$',news_cat),
    url(r'^news/location/$',news_location),
    url(r'^news/user/$',news_user),
    url(r'^news/update/$',news_update),
    # location
    url(r'^location/new/$',location_new),
    url(r'^location/all/$',location_all),
    #url(r'^location/delete/$',location_delete),
    # tag
    url(r'^tag/new/$',tag_new),
    url(r'^tag/all/$',tag_all),
    url(r'^tag/tag/$',tag_tag),
    url(r'^tag/focus/$',tag_focus),
    url(r'^tag/focuses/$',tag_focuses),
    # status
    url(r'^status/reply/$',status_reply),
    url(r'^status/replys/$',status_replys),
    url(r'^status/new/$',status_new),
    #url(r'^status/delete/$',status_delete),
    # cat data
    url(r'^data/reply/$',catdata_reply),
    url(r'^data/replys/$',catdata_replys),
    url(r'^data/new/$',catdata_new),
    #url(r'^data/delete/$',catdata_delete),
    url(r'^data/cat/$',catdata_cat),
    # notice
    #url(r'^notice/reply/$',notice_reply),
    #url(r'^notice/replys/$',notice_replys),
    #url(r'^notice/new/$',notice_new),
    #url(r'^notice/delete/$',notice_delete),
    url(r'^notice/all/$',notice_all),
    # ask
    url(r'^ask/reply/$',ask_reply),
    url(r'^ask/replys/$',ask_replys),
    url(r'^ask/new/$',ask_new),
    url(r'^ask/asks/$',ask_asks),
    url(r'^ask/score/$',ask_score),
    #url(r'^ask/delete/$',ask_delete),
    # photo
    url(r'^photo/reply/$',photo_reply),
    url(r'^photo/replys/$',photo_replys),
    url(r'^photo/new/$',photo_new),
    url(r'^photo/single/$',photo_single),
    #url(r'^photo/delete/$',photo_delete),
    url(r'^photo/transfer/$',photo_transfer),
    # cat
    url(r'^cat/all/$',cat_all),
    url(r'^cat/get/$',cat_get),
    url(r'^cat/new/$',cat_new),
    url(r'^cat/focus/$',cat_focus),
    url(r'^cat/focuses/$',cat_focuses),
    url(r'^cat/imp/$',cat_imp),
    url(r'^cat/imps/$',cat_imps),
    # dress
    url(r'^dress/get/$',dress_get),
    # user
    url(r'^user/focus/$',user_focus),
    url(r'^user/focuses/$',user_focuses),
    url(r'^user/all/$',user_all),
    url(r'^user/info/$',user_info),
    url(r'^user/set/$',user_set),
    url(r'^user/msg/$',user_msg),
    url(r'^user/message/$',user_message),
    url(r'^user/messages/$',user_messages),
    # vote
    url(r'^vote/add/$',vote_add),
    url(r'^vote/new/$',vote_new),
    #url(r'^vote/delete/$',vote_delete),
    #url(r'^vote/reply/$',vote_reply),
    #url(r'^vote/replys/$',vote_replys),
    url(r'^vote/get/$',vote_get),
    url(r'^vote/vote/$',vote_vote),
    url(r'^vote/all/$',vote_all),
)
