import datetime
from flask import Flask,request,jsonify
from influxdb import InfluxDBClient

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route('/sensors', methods=['POST'])
def sensors():
    data = request.json
    client = InfluxDBClient(host='host', port=443, username='user', password='PASSWORD', database='DB',ssl=True, verify_ssl=True)
    datapoint = {}
    tags={}
    fields={}
    tags["device"]=data["device"]
    fields["temp1"]=data["temp1"]
    fields["temp2"]=data["temp2"]
    fields["humidity"]=data["humidity"]
    fields["pressure"]=data["pressure"]
    fields["eco2"]=data["eco2"]
    fields["mhz19b"]=data["mhz19b"]
    fields["tvoc"]=data["tvoc"]
    datapoint["time"]=datetime.datetime.utcnow()
    datapoint["measurement"]="airquality"
    datapoint["tags"]=tags
    datapoint["fields"]=fields
    client.write_points([datapoint])
    return jsonify([datapoint])

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)
