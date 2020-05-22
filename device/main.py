from machine import Pin, Timer
import network
import ntptime 
import time
import ujson
import gc
import urequests as requests

#libraries
import webserver
import aggregate

#sensors
import sensors

#Info LED
INFO_LED = Pin(2, Pin.OUT)
ENDPOINT = '[http://your.endpoint.com/sensors]'
#Access Point data
SSID = '[SSID]'
PASSWORD = '[PASSWORD]'

#aggregate
aggcounter=0

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
        sensordata=sensors.get_sensors()
       
        #resp = requests.post(ENDPOINT, headers = {'content-type': 'application/json'},data=ujson.dumps(sensors.get_sensors()))
        #if resp.status_code != 200:
        #    print('Error : Status Code : {}. Message : {}'.format(resp.status_code,resp.text))

        #aggregate data
        if counter%60==0:
            aggregate.run(60,sensordata)
            counter=0
        if counter%30==0:
            aggregate.run(30,sensordata)
        if counter%10==0:
            aggregate.run(10,sensordata)
        aggregate.run(1,sensordata)
        counter=counter+1
        print(ujson.dumps(sensordata))
        gc.collect()     
    except Exception as e:
        print('Error: {}'.format(e))

#connect to wifi
do_connect()

#sync ntp
ntptime.settime()

print(ntptime.time())

#Clock timer
TIMR = Timer(-1)
TIMR.init(period=60000, mode=Timer.PERIODIC, callback=push_endpoint)
push_endpoint(0)
#Start WebServer
webserver.start_webserver()

