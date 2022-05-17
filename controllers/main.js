const Chart  = require('../models/chart');
const Main = require('../models/product');

exports.cronJob = (req, res, next) => {
  Main.fetchAll(data => {
    Chart.saveChartPoints(data);
  });
};

exports.getIndex = (req, res, next) => {
  let statuses = [];
  let chartLabels = [];
  let chartData = [];

  Main.fetchAll(data => {
    Object.keys(data).forEach(key => {
      statuses.push(data[key].status);
    });
    Chart.addChartPoint(statuses, chart => {
      Chart.getLabels(chart, chartCB => {
        chartLabels.push(...chartCB.labels);
        chartData.push(...chartCB.data);
        res.render('main/index', {
          chartLabels: chartLabels,
          chartData: chartData,
          pageTitle: 'Chart',
          path: '/'
        });
      })
    });
  });
};

exports.getChart = (req, res, next) => {  
  Chart.getLineChartArchive (chartData => {
    res.render('main/chart', {
      path: '/chart',
      chartData: chartData,
      pageTitle: 'Archive Chart'
    });
  })
};