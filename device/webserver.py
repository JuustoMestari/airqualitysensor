"""webserver.py"""
import time
import ujson

#libraries
from microWebSrv import MicroWebSrv
#sensors
import sensors

@MicroWebSrv.route('/sensors')
def _httpHandlerTimeGet(httpClient, httpResponse):
    """_httpHandlerTimeGet"""
    try:
        data = ujson.dumps(sensors.get_sensors())
    except:
        data = 'Attempting to get sensors...'
        
    httpResponse.WriteResponseOk(
        headers=({'Cache-Control': 'no-cache'}),
        contentType='text/event-stream',
        contentCharset='UTF-8',
        content='data: {0}\n\n'.format(data))

@MicroWebSrv.route('/stats')
def _httpHandlerTimeGet(httpClient, httpResponse):
    """_httpHandlerTimeGet"""
    try:
        data = ujson.dumps(sensors.get_stats())
    except:
        data = {}
        
    httpResponse.WriteResponseOk(
        headers=({'Cache-Control': 'no-cache'}),
        contentType='text/event-stream',
        contentCharset='UTF-8',
        content='data: {0}\n\n'.format(data))

def start_webserver():
    """start_webserver"""
    srv = MicroWebSrv(webPath='www/')
    srv.MaxWebSocketRecvLen = 256
    srv.WebSocketThreaded = False
    srv.Start()
