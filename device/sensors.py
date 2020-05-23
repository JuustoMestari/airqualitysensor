"""sensors.py"""
import machine
import time
import utime
from machine import Pin, I2C
import ubinascii
import uos
import network

#libraries
from pms7003 import Pms7003
from aqi import AQI

pms = Pms7003(uart=2)

def get_sensors():
    sensors= {}
    pms_data=pms.read()
    #add 946684800 because micropython epoch starts 2000-01-01 00:00:00 UTC
    sensors["timestamp"]=utime.time()+946684800
    sensors["metrics"]=pms_data
    #remove unecessary data from pms
    del sensors["metrics"]["CHECKSUM"]
    del sensors["metrics"]["ERROR"]
    #del sensors["metrics"]["FRAME_LENGTH"]
    del sensors["metrics"]["VERSION"]
    sensors["metrics"]["aqi"]=AQI.aqi(pms_data['PM2_5_ATM'], pms_data['PM10_0_ATM'])
    #TODO : Update temp and hum to use DHT22 library
    sensors["metrics"]["temperature"]=23.2
    sensors["metrics"]["humidity"]=45.3
    return sensors

def get_stats():
    stats={}
    uniqueID=ubinascii.hexlify(machine.unique_id()).decode('utf-8')
    sta_if = network.WLAN(network.STA_IF)
    os_data = uos.uname()
    #os_data => (sysname='esp32', nodename='esp32', release='1.12.0', version='v1.12-464-gcae77daf0 on 2020-05-21', machine='ESP32 module with ESP32')
    fs_stat = uos.statvfs('/')
    fs_size = fs_stat[0] * fs_stat[2]
    fs_free = fs_stat[0] * fs_stat[3]
    stats["device"]=uniqueID
    stats["version"]=os_data[2]
    stats["totalspace"]=fs_size
    stats["freespace"]=fs_free
    stats["time"]=utime.time()+946684800
    stats["essid"]=sta_if.config('essid')
    stats["mac"]=ubinascii.hexlify(sta_if.config('mac'),':').decode()
    stats["signalstrength"]=sta_if.status('rssi')
    stats["network"]=sta_if.ifconfig()
    return stats
