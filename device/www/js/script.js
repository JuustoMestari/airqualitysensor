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
    //test
    //setupStats({});
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
            updateGauges(data);
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

var updateGauges = function(dataset){
    //https://bernii.github.io/gauge.js/
    //Air Quality Index Gauge
    var optsAQI = {
        angle: -0.2, // The span of the gauge arc
        lineWidth: 0.2, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        limitMax: false,     // If false, max value increases automatically if value > maxValue
        limitMin: false,     // If true, the min value of the gauge will be fixed
        strokeColor: '#E0E0E0',  // to see which ones work best for you
        staticZones: [
            {strokeStyle: "#92d050", min: 0, max: 50}, 
            {strokeStyle: "#ff0", min: 51, max: 100}, 
            {strokeStyle: "#ffc000", min: 101, max: 150}, 
            {strokeStyle: "#f00", min: 151, max: 200},
            {strokeStyle: "#7030a0", min: 201, max: 300},
            {strokeStyle: "#852737", min: 301, max: 500}
         ],
         staticLabels: {
            font: "15px sans-serif",  // Specifies font
            labels: [0,50,100,150,200,300,500],  // Print labels at these values
            color: "#000000",  // Optional: Label text color
            fractionDigits: 0  // Optional: Numerical precision. 0=round off.
          },
    };
    var canvasAQI = document.getElementById('gaugeAQI');
    var currentAQI=Math.ceil(dataset[dataset.length-1].metrics.aqi);
    var gaugeAQI = new Gauge(canvasAQI).setOptions(optsAQI); // create sexy gauge!
    gaugeAQI.maxValue = 500; // set max gauge value
    gaugeAQI.setMinValue(0);  // Prefer setter over gauge.minValue = 0
    gaugeAQI.animationSpeed = 1; // set animation speed (32 is default value)
    gaugeAQI.set(currentAQI); // set actual value
    document.getElementById('gAQIValue').innerHTML=currentAQI;
    
    //Temperature Gauge
    var optsTemp = {
        angle: -0.2, // The span of the gauge arc
        lineWidth: 0.2, // The line thickness
        radiusScale: 1, // Relative radius
        colorStart: 'blue',   // Colors
        colorStop: 'red',
        generateGradient: true,
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        strokeColor: '#E0E0E0',  // to see which ones work best for you
    };
    var canvasTemp = document.getElementById('gaugeTemp');
    var currentTemp=Math.round(dataset[dataset.length-1].metrics.temperature*10)/10;
    var gaugeTemp = new Gauge(canvasTemp).setOptions(optsTemp); // create sexy gauge!
    gaugeTemp.maxValue = 50; // set max gauge value
    gaugeTemp.setMinValue(0);  // Prefer setter over gauge.minValue = 0
    gaugeTemp.animationSpeed = 1; // set animation speed (32 is default value)
    gaugeTemp.set(currentTemp); // set actual value
    document.getElementById('gTempValue').innerHTML=currentTemp+"C";
    
    //Humidity Gauge
    var optsHum = {
        angle: -0.2, // The span of the gauge arc
        lineWidth: 0.2, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        strokeColor: '#E0E0E0',  // to see which ones work best for you
    };
    var canvasHum = document.getElementById('gaugeHum');
    var currentHum=Math.ceil(dataset[dataset.length-1].metrics.humidity);
    var gaugeHum = new Gauge(canvasHum).setOptions(optsHum); // create sexy gauge!
    gaugeHum.maxValue = 100; // set max gauge value
    gaugeHum.setMinValue(0);  // Prefer setter over gauge.minValue = 0
    gaugeHum.animationSpeed = 1; // set animation speed (32 is default value)
    gaugeHum.set(currentHum); // set actual value
    document.getElementById('gHumValue').innerHTML=currentHum+" %";

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