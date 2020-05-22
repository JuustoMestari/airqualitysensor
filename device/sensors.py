"""sensors.py"""
import machine
from machine import Pin, I2C
import ubinascii
import uos

#libraries
from pms7003 import Pms7003
from aqi import AQI

pms = Pms7003(uart=2)

def get_sensors():
    sensors= {}
    pms_data=pms.read()
    sensors["timestamp"]=1234567890
    sensors["metrics"]=pms_data
    sensors["metrics"]["aqi"]=AQI.aqi(pms_data['PM2_5_ATM'], pms_data['PM10_0_ATM'])
    #TODO : Update temp and hum to use DHT22 library
    sensors["metrics"]["temperature"]=23.2
    sensors["metrics"]["humidity"]=45.3
    return sensors

def get_stats():
    stats={}
    uniqueID=ubinascii.hexlify(machine.unique_id()).decode('utf-8')
    fs_stat = uos.statvfs('/')
    fs_size = fs_stat[0] * fs_stat[2]
    fs_free = fs_stat[0] * fs_stat[3]
    stats["device"]=uniqueID
    stats["totalspace"]=fs_size
    stats["freespace"]=fs_free
    return stats