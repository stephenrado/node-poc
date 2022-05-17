const path = require("path");

const express = require("express");
const cron = require("node-cron");
const controller = require("../controllers/main");
const Chart = require("../models/chart");
const Main = require("../models/product");

const router = express.Router();

cron.schedule("1 * * * * *", function () {
  console.log("cron job run");
  let statuses = [];

  Main.fetchAll(data => {
    Object.keys(data).forEach(key => {
      statuses.push(data[key].status);
    });
    Chart.addChartPoint(statuses, chart => {
        console.log(chart);
        Chart.saveChartPoints(chart);
    });
  });
});

router.get("/", controller.getIndex);

router.get("/chart", controller.getChart);

module.exports = router;
