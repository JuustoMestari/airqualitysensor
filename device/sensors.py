"""sensors.py"""
import machine
from machine import Pin, I2C
import ubinascii

#libraries
import CCS811
import si7021
from bmp280 import BMP280
import mhz19b

#I2C setup
i2c = I2C(0,scl=Pin(5), sda=Pin(4))
print('I2C devices found : {} '.format(i2c.scan()))
co2_sensor = CCS811.CCS811(i2c=i2c, addr=90)
temp_sensor = si7021.Si7021(i2c)
pressure_sensor = BMP280(i2c)

def get_sensors():
    sensors= {}
    uniqueID=ubinascii.hexlify(machine.unique_id()).decode('utf-8')
    sensors["device"]=uniqueID
    sensors["temp1"]=temp_sensor.temperature
    sensors["temp2"]=pressure_sensor.temperature
    sensors["humidity"]=temp_sensor.relative_humidity
    sensors["pressure"]=pressure_sensor.pressure
    if co2_sensor.data_ready():
        sensors["eco2"]=co2_sensor.eCO2
        sensors["tvoc"]=co2_sensor.tVOC
    sensors["mhz19b"]=mhz19b.get_CO2()
    return sensors