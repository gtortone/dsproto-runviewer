const e = require("express");
const express = require("express");
const mysql = require("mysql");
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

// get total number of channels 
const getChannelsNum = (bd) => {
  let num = 0
  bd.modules.map((mod) => {
    num += mod.channels.length
  });
  return num
} 

// Route to get all runs summary from a setup
runapp.get("/api/:setup/summary", (req, res) => {
  const setup = parseInt(req.params.setup);

  db.query(
    "SELECT * FROM params WHERE setup = ? ORDER BY run DESC",
    setup,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      let summary = [];
      let status = "";
      let eventsSent = "-";
      let channelsNum = 0;
      result.map((obj, index) => {
        let doc = {};
        if (obj["jsonstop"] === null) {
          // run not finished yet or aborted
          doc = JSON.parse(obj["jsonstart"]);
          if (index === 0) status = "in progress";
          else status = "aborted";
        } else {
          doc = JSON.parse(obj["jsonstop"]);
          try {
            eventsSent = parseInt(doc["BD"]["eventsSent"])
          } catch {
            eventsSent = "-";
          }
          status = "finished";
        }
        // set total number of channels
        let doc2 = JSON.parse(obj["jsonstart"]);
        doc2["BD"] && (channelsNum = getChannelsNum(doc2["BD"]))
        let summaryItem = {
          id: index,
          status,
          eventsSent,
          channelsNum,
          ...doc["RI"],
          ...doc["SQ"],
          ...doc["SI"],
          ...doc["LI"],
        };
        summary.push(summaryItem);
      });

      res.send(summary);
    }
  );
});

// Route to get one run from a setup
runapp.get("/api/:setup/:run", (req, res) => {
  const run = req.params.run;
  const setup = req.params.setup;
  let lastRunNumber = undefined;

  // get last run number for this setup
  db.query(
    "SELECT * FROM params WHERE setup = ? ORDER BY run DESC LIMIT 1",
    [setup],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      lastRunNumber = result[0].run;
    }
  );

  // get run by setup and run number
  db.query(
    "SELECT * FROM params WHERE setup = ? AND run = ?",
    [setup, run],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      let runItem = [];
      let runDoc = {};
      let runStatus = undefined;
      if (result.length === 0) res.send(runItem);
      else {
        let runStart = JSON.parse(result[0]["jsonstart"]);
        let runStop = JSON.parse(result[0]["jsonstop"]);
        let runInfo = {};

        if (runStop != null) {
          runStatus = "finished";
        } else {
          if (runStart.RI.runNumber === lastRunNumber) {
            runStatus = "in progress";
          } else runStatus = "aborted";
        }

        // for finished run use runStop info
        if (runStatus === "finished") {
          runInfo = {
            ...runStop["RI"],
            ...runStop["SQ"],
            ...runStop["SI"],
            ...runStop["LI"],
            status: runStatus,
          };
          delete runStart["RI"];
          delete runStart["SQ"];
          delete runStart["SI"];
          delete runStart["LI"];
          delete runStop["RI"];
          delete runStop["SQ"];
          delete runStop["SI"];
          delete runStop["LI"];
        } else {
          // for in-progress or aborted run use runStart info
          runInfo = {
            ...runStart["RI"],
            ...runStart["SQ"],
            ...runStart["SI"],
            ...runStart["LI"],
            status: runStatus,
          };
          delete runStart["RI"];
          delete runStart["SQ"];
          delete runStart["SI"];
          delete runStart["LI"];
        }

        // compose response
        runDoc["info"] = runInfo;
        runDoc["start"] = runStart;
        runDoc["stop"] = runStop;
        runItem.push(runDoc);
        res.send(runItem);
      }
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
