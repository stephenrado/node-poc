const console = require('console');
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'chart.json'
);

const getChartArchive = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addChartPoint(statusCodes, cb) {
    
      let chartOb = JSON.parse(JSON.stringify({"chart":[]}));
      
      for(let i = 0; i < statusCodes.length; i++){
         // Analyze the chart => Find existing status code
        const existingChartIndex = chartOb.chart.findIndex(ch => ch.statusCode === statusCodes[i]);
        const existingProduct = chartOb.chart[existingChartIndex];
        let updatedProduct;
        // Add new status code or increase quantity
        if (existingProduct) {
          updatedProduct = { ...existingProduct };
          updatedProduct.qty = updatedProduct.qty + 1;
          chartOb.chart = [...chartOb.chart];
          chartOb.chart[existingChartIndex] = updatedProduct;
        } else {
          updatedProduct = { statusCode: statusCodes[i], qty: 1 };
          chartOb.chart = [...chartOb.chart, updatedProduct];
        }
      }
      
      cb(chartOb);
  }

  static saveChartPoints(chartPoints){

    console.log(chartPoints);
      let chartPointsDated = [];
      let date = new Date();

      chartPointsDated.push({date: date.toLocaleTimeString('en-GB'), "chartPoints": [...chartPoints.chart]});

      fs.readFile(p, function (err, data) {
        console.log(JSON.parse(data));
        
        if(!err){
            var json = JSON.parse(data)
            json.points.push(...chartPointsDated);
            console.log(json);
      
            fs.writeFile(p, JSON.stringify(json), err => {
              console.log(err);
            });
        }else{
          console.log("poo an error " + err);
        }
    })
  }

  static getLabels (obj, cb){
    let chart = {labels: [], data: []};

    for(let i = 0; i < obj.chart.length; i++){
      chart.labels.push(obj.chart[i].statusCode);
      chart.data.push(obj.chart[i].qty);
    }

    cb (chart)
  }

  static getLineChartArchive (cb){
    getChartArchive(charts => {

      let labels = []
      let datasets = []
      

      const add = (arr, newData) => {

        const found = arr.some(el => el.label === newData.label);
        if (!found) {
          arr.push(newData)
        }else {
          const index = arr.findIndex(item => item.label === newData.label);
          arr[index].data.push(...newData.data)
        }
        return arr;
      }
      
      for(let i = 0; i < charts.points.length; i++){
        labels.push(charts.points[i].date)
        let chartPointsObj = charts.points[i].chartPoints;
        
        for (let i = 0; i < chartPointsObj.length; i++){
          let currentDataSet = chartPointsObj[i];
          let newDataSet = {
            data: [],
            label: currentDataSet.statusCode,
            fill: false
          };
          newDataSet.data.push(currentDataSet.qty)

          datasets = add(datasets, newDataSet);
          
        }
      }

      const chart = {
        labels: [...labels],
        datasets: [...datasets]
      }
        
      cb(chart);
    });
  }
};
