var cops = require("ndarray-complex");
var freqz = require('ndarray-freqz');
var zeros = require("zeros");
var Chart = require('chart.js');


// Sample Data
var b = [ 0.00685858,  0.00424427,  0.01363637,  0.00939893,  0.01363637, 0.00424427,  0.00685858]
var a = [ 1 , -3.6133816 ,  6.29949582, -6.44744259,  4.04658649, -1.4649745 ,  0.23927553]

window.addEventListener('load', function(){

  calculateAndPlot(b,a);
  var button = document.getElementById('plotbutton');
  var inputA = document.getElementById('inputA');
  var inputB = document.getElementById('inputB');
  var error = document.getElementById('error');

  button.addEventListener('click', function(){
    error.hidden = true;
    var aStr = inputA.value;
    var bStr = inputB.value;
    var a = parseArrayString(aStr);
    var b = parseArrayString(bStr);
    calculateAndPlot(b,a);
  });

});

function parseArrayString(str){
  var array = [];
  str = str.trim();
  if (str[0] == '[' && str[str.length-1] == ']'){
    try{
      array = JSON.parse(str);
    }catch(e){
      error.hidden = false;
    }
  }else{
    try{
      array = JSON.parse('[' + str + ']');
    }catch(e){
      error.hidden = false;
    }
  }
  return array;
}

function calculateAndPlot(b,a){
  var response = calculateResponse(b,a);
  plotResponse({
    id:'magChart',
    data: response.magData,
    title: "Magnitude Response",
    yLable: 'Magnitude (dB)',
    xLable: 'Frequency (Hz)'
  });

  plotResponse({
    id:'phaseChart',
    data: response.phaseDate,
    title: "Phase Response",
    yLable: 'Phase (rad)',
    xLable: 'Frequency (Hz)'
  });
}

function calculateResponse(b, a){
  var fr = freqz(b, a);

  var magnitude = zeros([fr.H_i.data.length])
  var phase = zeros([fr.H_i.data.length])

  cops.abs(magnitude, fr.H_r, fr.H_i);
  cops.arg(phase, fr.H_r, fr.H_i);

  var magData = [];
  magnitude.data.forEach(function(thisMag, index){
    magData.push({
      'x': fr.omega.data[index]/Math.PI*44100,
      'y': 20*Math.log10(thisMag)
    });
  });

  var phaseData = [];
  phase.data.forEach(function(thisPhase, index){
    phaseData.push({
      'x': fr.omega.data[index]/Math.PI*44100,
      'y': 20*Math.log10(thisPhase)
    });
  });

  return {
    'magData': magData,
    'phaseDate': phaseData
  }
}

function plotResponse(options){

  var magCtx = document.getElementById(options.id);
  var myChart = new Chart(magCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          pointRadius: 1,
          lineTension: 0.15,
          data: options.data,
        }
      ]
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: options.title
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: options.yLable
          }
        }],
        xAxes: [{
           type: 'linear',
           position: 'bottom',
           scaleLabel: {
             display: true,
             labelString: options.xLable
           },
           ticks: {
               min: 10,
               max: 44100
           }
       }]
      },
      responsive: false,
      maintainAspectRatio: true
    }
  });
}
