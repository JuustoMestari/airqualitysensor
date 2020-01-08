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

## firmware
- Download latest version of micropython for ESP32 : http://micropython.org/download#esp32
- Flash using instructions from micropython firmware download website using esptool : https://github.com/espressif/esptool
```console
python esptool.py --chip esp32 --port COM3 erase_flash
```
```console
python esptool.py --chip esp32 --port COM3 --baud 460800 write_flash -z 0x1000 esp32-20190125-v1.xxxxx.bin
```

## rshell
Install with 
```console
sudo pip3 install rshell
```
```console
pip install rshell
```
List files on device
```console
rshell -p COM3 ls /pyboard
```
Clear files on device
```console
rshell -p COM3 rm -r /pyboard/
```
Copy all files to device (doesn't seem to work on windows)
```console
rshell -p COM3 cp -r ./device/* /pyboard
```
Copy single file at a time (windows)
```console
rshell -p COM3 cp main.py /pyboard
```

## serial
You can monitor what is going on with the device by connecting with a client like Putty.

Set port (COMX or /dev/ttyUSBX) and speed to 115200. Press reset button (EN) on ESP32.