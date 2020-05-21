from machine import Pin, Timer
import network
import time
import ujson
import gc
import urequests as requests

#libraries
import webserver

#sensors
import sensors

#Info LED
INFO_LED = Pin(2, Pin.OUT)
ENDPOINT = '[http://your.endpoint.com/sensors]'
#Access Point data
SSID = '[SSID]'
PASSWORD = '[PASSWORD]'

def do_connect():
    """do_connect connects to the specified Access Point and Password"""
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('connecting to network...')
        sta_if.active(True)
        sta_if.connect(SSID, PASSWORD)
        while not sta_if.isconnected():
            pass
    print('network config:', sta_if.ifconfig())
    INFO_LED.on()

def push_endpoint(timer):
    try:
        print(ujson.dumps(sensors.get_sensors()))
        #resp = requests.post(ENDPOINT, headers = {'content-type': 'application/json'},data=ujson.dumps(sensors.get_sensors()))
        #if resp.status_code != 200:
        #    print('Error : Status Code : {}. Message : {}'.format(resp.status_code,resp.text))
        gc.collect()     
    except Exception as e:
        print('Error: {}'.format(e))

#connect to wifi
do_connect()

#Clock timer
TIMR = Timer(-1)
TIMR.init(period=60000, mode=Timer.PERIODIC, callback=push_endpoint)
push_endpoint(0)
#Start WebServer
webserver.start_webserver()

