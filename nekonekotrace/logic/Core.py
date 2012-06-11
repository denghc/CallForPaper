from settings import *

def saveImage(fname,typein,path,data):
    if typein == 'image/png':
        fname += '.png'
    elif typein == 'image/jpg':
        fname += '.jpg'
    elif typein == 'image/jpeg':
        fname += '.jpg'
    elif typein == 'image/bmp':
        fname += '.jpg'
    elif typein == 'image/gif':
        fname += '.gif'
    else:
        raise Exception('Error!')
    pathin = MEDIA_ROOT + path + fname
    destination = open(pathin, 'wb+')
    destination.write(data)
    destination.close()
    #test = os.path.abspath(name)
    return fname
    
def saveImageFile(fname,typein,path,data):
    if typein == 'image/png':
        fname += '.png'
    elif typein == 'image/jpg':
        fname += '.jpg'
    elif typein == 'image/jpeg':
        fname += '.jpg'
    elif typein == 'image/bmp':
        fname += '.jpg'
    elif typein == 'image/gif':
        fname += '.gif'
    else:
        raise Exception('Error!')
    pathin = MEDIA_ROOT + path + fname
    destination = open(pathin, 'wb+')
    for chunk in data.chunks():
        destination.write(chunk)
    destination.close()
    #test = os.path.abspath(name)
    return fname