"""sensors.py"""
import machine
from machine import Pin, I2C
import ubinascii

#libraries
from pms7003 import Pms7003
from aqi import AQI

pms = Pms7003(uart=2)

def get_sensors():
    sensors= {}
    uniqueID=ubinascii.hexlify(machine.unique_id()).decode('utf-8')
    pms_data=pms.read()
    sensors["device"]=uniqueID
    sensors["pms"]=pms_data
    sensors["aqi"]=AQI.aqi(pms_data['PM2_5_ATM'], pms_data['PM10_0_ATM'])
    return sensors