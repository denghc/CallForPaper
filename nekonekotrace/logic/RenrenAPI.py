import time
import hashlib
import urllib


RENREN_APP_API_KEY = "232d76165d6049a6a77d7b7cca89e2d6"
RENREN_APP_SECRET_KEY = "a97633de7650431baace73e8d37788b1"

RENREN_AUTHORIZATION_URI = "http://graph.renren.com/oauth/authorize"
RENREN_ACCESS_TOKEN_URI = "http://graph.renren.com/oauth/token"
RENREN_SESSION_KEY_URI = "http://graph.renren.com/renren_api/session_key"
RENREN_API_SERVER = "http://api.renren.com/restserver.do"

apiClient = None

try:
    import json
    _parse_json = lambda s: json.loads(s)
except ImportError:
    try:
        import simplejson
        _parse_json = lambda s: simplejson.loads(s)
    except ImportError:
        # For Google AppEngine
        from django.utils import simplejson
        _parse_json = lambda s: simplejson.loads(s)

"""
    To Send API Request To RenRen Rest API Server
"""
class RenRenAPIClient(object):
    def __init__(self, session_key=None):
        self.session_key = session_key
        self.api_key = RENREN_APP_API_KEY
        self.secret_key = RENREN_APP_SECRET_KEY

    def setSessionKey(self, session_key):
        self.session_key = session_key
    
    def request(self, params=None):
        """Fetches the given method's response returning from RenRen API.

        Send a POST request to the given method with the given params.
        """
        params["api_key"] = self.api_key
        params["call_id"] = str(int(time.time() * 1000))
        params["format"] = "json"
        params["session_key"] = self.session_key
        params["v"] = '1.0'
        sig = self.hash_params(params);       
        params["sig"] = sig
        
        post_data = None if params is None else urllib.urlencode(params)
        
        #logging.info("request params are: " + str(post_data))
        
        rfile = urllib.urlopen(RENREN_API_SERVER, post_data)
        
        try:
            s = rfile.read()
            
            response = _parse_json(s)
        finally:
            rfile.close()
        if type(response) is not list and response["error_code"]:
            raise RenRenAPIError(response["error_code"], response["error_msg"])
        return response
    def hash_params(self, params=None):
        sigstr = "".join(["%s=%s" % (x, params[x]) for x in sorted(params.keys())])
        hasher = hashlib.md5(sigstr)
        hasher.update(self.secret_key)
        return hasher.hexdigest()
    def unicode_encode(self, tstr):
        """
        Detect if a string is unicode and encode as utf-8 if necessary
        """
        return isinstance(tstr, unicode) and tstr.encode('utf-8') or str
    
class RenRenAPIError(Exception):
    def __init__(self, code, message):
        Exception.__init__(self, message)
        self.code = code