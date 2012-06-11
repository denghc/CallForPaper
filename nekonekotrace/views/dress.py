from django.template import RequestContext
from django.shortcuts import render_to_response, get_object_or_404

def dress_get(request):
    style = request.GET['style']
    intype = request.GET['type']
    env = int(request.GET['env'])
    path = None
    if env == 1:
        path = 'phone/'+style+'/'
    elif env == 0:
        path = 'RenRenAPP/'+style+'/'
    else:
        raise Exception('Error')
    # use switch here??
    # nao can here.......
    if intype == 'status':
        path += 'status.html'
    elif intype == 'statusreply':
        path += 'statusreply.html'
    elif intype == 'main':
        path += 'main.html'
    elif intype == 'cat':
        path += 'cat.html'
    elif intype == 'photo':
        path += 'photo.html'
    elif intype == 'photoreply':
        path += 'photoreply.html'
    elif intype == 'ask':
        path += 'ask.html'
    elif intype == 'askreply':
        path += 'askreply.html'
    elif intype == 'data':
        path += 'data.html'
    elif intype == 'datareply':
        path += 'datareply.html'
    elif intype == 'js':
        path += 'ui.js'
    elif intype == 'smalldiv':
        path += 'smalldiv.html'
    else:
        raise Exception('Error')
    return render_to_response(path,{}, context_instance=RequestContext(request))
