# Air quality sensor
## Device
- ESP32 board : https://ebay.to/39Jhv0x
## Sensors board
- Sensor board : https://ebay.to/36HKQqx

### BMP280
- Temperature and Pressure sensor
- I2C Address : 118
- https://www.bosch-sensortec.com/products/environmental-sensors/pressure-sensors/pressure-sensors-bmp280-1.html

### CCS811
- eCO2 and TVOC sensor
- I2C Address : 90
- https://ams.com/ccs811

### SI7021
- Temperature and Humidity sensor
- I2C Address : 64
- https://www.silabs.com/documents/public/data-sheets/Si7021-A20.pdf

## Libraries
- Micro Web Server : https://github.com/jczic/MicroWebSrv
- bmp280 : https://github.com/dafvid/micropython-bmp280
- CCS811 : https://github.com/Notthemarsian/CCS811
- si7021 : https://github.com/chrisbalmer/micropython-si7021
- urequests : https://github.com/micropython/micropython-lib/tree/master/urequests

## rshell
Install with 
```console
sudo pip3 install rshell
```
Clear files on device
```console
rshell -p /dev/ttyUSB0 rm -r /pyboard/
```
Copy files to device
```console
rshell -p /dev/ttyUSB0 cp -r device/* /pyboard
```