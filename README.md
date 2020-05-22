# Air quality sensor
## Device
- ESP32 board : https://ebay.to/39Jhv0x
## Air quality sensor
- PMS7003 : https://download.kamami.com/p564008-p564008-PMS7003%20series%20data%20manua_English_V2.5.pdf
## Temperature/Humidity sensor
- DHT22 : https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf
## Pinout
| ESP32         | DHT22         | PMS7003     |
| ------------- |:-------------:| -----------:|
|VIN		    |               |             |
|GND		    |               |             |
|RST            |               |RST          |
|IO17		    |               |RX           |
|IO16		    |               |TX           |
|3V3	        |VCC            |VCC          |
|GND	        |GND            |GND          |	
|IO4            |DATA           |             |	

## Libraries
- Micro Web Server : https://github.com/jczic/MicroWebSrv
- pms7003+AQI : https://github.com/pkucmus/micropython-pms7003

## firmware
- Download latest version of micropython for ESP32 : http://micropython.org/download#esp32
- Flash using instructions from micropython firmware download website using esptool : https://github.com/espressif/esptool . Esptool requires python module "pyserial" (pip install pyserial)
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
rshell -p COM3 cp -r device/* /pyboard
```
Copy single file at a time (windows)
```console
rshell -p COM3 cp main.py /pyboard
```

## serial
You can monitor what is going on with the device by connecting with a client like Putty.  
Set port (COMX or /dev/ttyUSBX) and speed to 115200. Press reset button (EN) on ESP32.

# TODO
- ~~sync time with ntp server~~
- add DHT22 logic
- improve logic if pms7003 returns AQI of 0
- improve UI
  - add gauges
  - ~~add time series (1 min, 10min, 30min, 1 hour)~~
  - add current time
  - ~~add flash space~~
  - use progressbar for flash space
  - automatically refresh UI every minute
  - improve page's css so graph is responsive, using flex