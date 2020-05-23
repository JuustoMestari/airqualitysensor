/*if(typeof(EventSource) !== 'undefined') {
    const sourceSensors = new EventSource('http://' + window.location.hostname + '/sensors');
    sourceSensors.onmessage = function(e) {
        sensorData = JSON.parse(e.data);
        console.log(sensorData);
        document.getElementById("device").innerHTML = sensorData.device;
        document.getElementById("aqi").innerHTML = sensorData.aqi;
    };
} else {
    document.getElementById("resultTime").innerHTML = "Sorry, your browser does not support server-sent events...";
}*/
let selectedTimeValue="1";
let chart = {};
document.addEventListener("DOMContentLoaded", function(event) { 
    //retrieve device stats
    getJSON('stats',function(err, data) {
        if (err !== null) {
            console.error('Could not retrieve stats : ' + err);
        } else {
            setupStats(data);
        }
    });
    //retrieve json
    setupChart();
    getChartData(selectedTimeValue);
    
    document.getElementById("timeSelector").addEventListener("change",(e)=>{
        selectedTimeValue=e.target.value;
        getChartData(selectedTimeValue);
    });
    document.getElementById("chartUpdate").addEventListener("click",(e)=>{
        getChartData(selectedTimeValue);
    });
});


var setupStats = function(stats){
    //test data
    //stats = {"signalstrength": -55, "network": ["192.168.39.85", "255.255.255.0", "192.168.39.1", "192.168.10.50"], "mac": "24:0a:c4:c6:7d:30", "device": "240ac4c67d30", "freespace": 1560576, "totalspace": 2097152, "version": "1.12.0", "time": 1590211817, "essid": "NeonHA"};
    
    //Setup device name and version
    document.getElementById("deviceSerial").innerHTML = `${stats.device}`
    document.getElementById("deviceVersion").innerHTML = `version : ${stats.version}`

    //Setup storage
    let usedspace = stats.totalspace-stats.freespace;
    let storagebarLabel = `${humanFileSize(usedspace,true)}/${humanFileSize(stats.totalspace,true)}`;
    let storagebarPercent = (usedspace/stats.totalspace)*100;
    let storagebarClass = (storagebarPercent>75)?"error":"success";
    let DOMstoragebar = document.getElementById("storagebar");
    DOMstoragebar.classList.add(storagebarClass);
    DOMstoragebar.querySelector('.label').innerHTML=storagebarLabel;
    DOMstoragebar.querySelector('.bar').style.width=`${storagebarPercent}%`;

    //Setup network
    document.getElementById("networkIP").innerHTML = `${stats.network[0]}`
    document.getElementById("networkMAC").innerHTML = `${stats.mac}`
    document.getElementById("networkAP").innerHTML = `${stats.essid}`
    document.getElementById("networkRSSI").innerHTML = `strength : ${stats.signalstrength} dB`

    //Setup time
    document.getElementById("deviceTime").innerHTML = `${moment(stats.time*1000).format('DD.MM.YY HH:mm')}`
        
}

var setupChart = function(){
    var ctx = document.getElementById('sensorChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        
        // The data for our dataset
        data: {
            datasets: []
        },
        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                }]
            }
        }
    });
}

var getChartData = function(timeSelector){
    //add timestamp to end of query so the browser does not cache the json
    getJSON('json/sensors_'+timeSelector+'.json?t='+moment().format('X'),function(err, data) {
        if (err !== null) {
            console.error('Something went wrong: ' + err);
        } else {
            updateChart(data);
        }
    });
}

var updateChart = function(dataset){

    //clear all datasets data
    chart.data.datasets.forEach(ds=>{
        ds.data=[];
    })
    //loop thru json datapoints
    dataset.forEach((point,i)=>{
        let ts = moment(point.timestamp*1000);
        //loop thru each metric
        for (var k in point.metrics)
        {
            let foundDataset = chart.data.datasets.find(x=>x.label==k)
            
            //check if there is already a dataset for that key
            if (!foundDataset){
                //dataset not found, create it
                foundDataset = {
                    label: k,
                    hidden: true,
                    backgroundColor: 'rgba(0, 0, 0,0)',
                    borderColor: randomColor(),
                    data: []
                }
                //push dataset to chart
                chart.data.datasets.push(foundDataset);
            }
            //add data to dataset
            chart.data.datasets.find(x=>x.label==k).data.push({
                x:ts,
                y:point.metrics[k]
            });
        }
    });
    chart.update();
}


//tools
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

var randomColor = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}

var humanFileSize = function(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }