from machine import Pin,UART

u1=UART(2,baudrate=9600,rx=16,tx=17,bits=8, parity=None, stop=1,timeout=1000)
def get_CO2():
    #See https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19b-co2-ver1_0.pdf
    #Page 7
    b=bytearray([0xff, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79])
    u1.write(b)
    n=u1.read()
    f=n[2]*256+n[3]
    return f