from machine import Pin,UART

u1=UART(2,baudrate=9600,rx=16,tx=17,bits=8, parity=None, stop=1,timeout=1000)
def get_CO2():
    #See https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19b-co2-ver1_0.pdf
    #Page 7
    u1.write(bytearray([0xff, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79]))
    n=u1.read()
    f=n[2]*256+n[3]
    return f

def set_ABC(isOn):
    #ABC info : https://github.com/letscontrolit/ESPEasy/issues/466
    if isOn:
        #based on https://github.com/UedaTakeyuki/mh-z19/blob/master/pypi/mh_z19/__init__.py#L107
        u1.write(bytearray([0xff, 0x01, 0x79, 0xa0, 0x00, 0x00, 0x00, 0xe6]))
    else:
        #based on https://github.com/UedaTakeyuki/mh-z19/blob/master/pypi/mh_z19/__init__.py#L114
        u1.write(bytearray([0xff, 0x01, 0x79, 0x00, 0x00, 0x00, 0x00, 0x86]))
    return
