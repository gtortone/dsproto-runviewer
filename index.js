const express = require("express");
const mysql = require("mysql");
const moment = require("moment");
const path = require("path");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
});

const app = express();
const port = 4000;

app.use(express.json());

const runapp = express.Router();

function addMonData(run) {
  json = {};
  startTime = run["Start time"];
  stopTime = run["Stop time"];
  json["starttime"] = moment(startTime).format("DD/MM/YYYY HH:mm:ss");
  json["stoptime"] = moment(stopTime).format("DD/MM/YYYY HH:mm:ss");
  json["duration"] = moment.utc(stopTime - startTime).format("HH:mm:ss");
  return { ...run, ...json };
}

// Route to get all runs
runapp.get("/api/runset", (req, res) => {
  db.query(
    "SELECT *,`Run number` AS runid FROM `Runlog-cdaq` ORDER BY `Run number` DESC",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      var id = 0;
      result.map((obj) => {
        obj["id"] = id++;
        return obj;
      });
      res.send(result.map(addMonData));
    }
  );
});

// Route to get all runs from a setup
runapp.get("/api/:setup/runset", (req, res) => {
  const setup = req.params.setup;
  var table = "";

  if (setup === "setup-1") table = "Runlog-cdaq";
  else if (setup === "setup-2") table = "Runlog-daq";

  db.query(
    "SELECT *,`Run number` AS runid FROM `" +
      table +
      "` ORDER BY `Run number` DESC",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      var id = 0;
      result.map((obj) => {
        obj["id"] = id++;
        return obj;
      });
      res.send(result.map(addMonData));
    }
  );
});

// Route to get one run from a setup
runapp.get("/api/:setup/runset/:id", (req, res) => {
  const id = req.params.id;
  const setup = req.params.setup;

  if (setup === "setup-1") table = "Runlog-cdaq";
  else if (setup === "setup-2") table = "Runlog-daq";

  db.query(
    "SELECT *,`Run number` AS id FROM `" + table + "` WHERE `Run number` = ?",
    id,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.map(addMonData));
    }
  );
});

runapp.use(express.static(path.join(__dirname, ".", "build")));
runapp.use(express.static("public"));
runapp.use((req, res, next) => {
  res.sendFile(path.join(__dirname, ".", "build", "index.html"));
});

app.use(process.env.REACT_APP_BASEURL, runapp);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on ${port}`);
});
