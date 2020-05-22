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
let selectedTimeValue="1"
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
    updateGraph(selectedTimeValue);
    
    document.getElementById("timeSelector").addEventListener("change",(e)=>{
        selectedTimeValue=e.target.value;
        updateGraph(selectedTimeValue);
    });
});


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

var setupStats = function(stats){
    document.getElementById("device").innerHTML = `${stats.device} : Available space : 
        ${humanFileSize(stats.freespace,true)}/${humanFileSize(stats.totalspace,true)}`;
}

var setupGraph = function(dataset){
    datasetList = [];
    //create datapoints
    dataset.forEach((point,i)=>{
        let ts = moment(point.timestamp*1000);
        //loop thru each metric
        for (var k in point.metrics)
        {
            //check if there is already a dataset for that key
            if (!datasetList.find(x=>x.label==k)){
                //dataset not found, create it
                let newDS = {
                    label: k,
                    backgroundColor: 'rgba(0, 0, 0,0)',
                    borderColor: randomColor(),
                    data: []
                }
                datasetList.push(newDS);
            }
            //add data to dataset
            let foundDatasetIndex = datasetList.findIndex(x=>x.label==k);
            if (foundDatasetIndex!=-1){
                datasetList[foundDatasetIndex].data.push({
                    x:ts,
                    y:point.metrics[k]
                })
            }
        }
        
    });
    var ctx = document.getElementById('sensorChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        
        // The data for our dataset
        data: {
            datasets: datasetList
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

var updateGraph = function(timeSelector){
    //add timestamp to end of query so the browser does not cache the json
    getJSON('json/sensors_'+timeSelector+'.json?t='+moment().format('X'),function(err, data) {
        if (err !== null) {
            console.error('Something went wrong: ' + err);
        } else {
            setupGraph(data);
            
        }
    });
}

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