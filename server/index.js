const express = require('express');
const db = require('./config/db')
const moment = require('moment')
const path = require("path");

const app = express();
const port = 4000;

app.use(express.json())

function addMonData(run) {
   json= {}
   startTime = run['Start time']
   stopTime = run['Stop time']
   json['starttime'] = moment(startTime).format("DD/MM/YYYY HH:mm:ss")
   json['stoptime'] = moment(stopTime).format("DD/MM/YYYY HH:mm:ss")
   json['duration'] = (moment.utc(stopTime - startTime).format('HH:mm:ss'))
   return { ...run, ...json}
}

// Route to get all runs
app.get("/api/runset", (req,res)=>{
    db.query("SELECT *,`Run number` AS runid FROM `Runlog-cdaq` ORDER BY `Run number` DESC", (err,result) => {
        if(err) {
            console.log(err)
        }
        var id = 0; 
        result.map( (obj) => {
            obj['id'] = id++;
            return obj;
        })
        res.send(result.map(addMonData))
    });
});

// Route to get one run
app.get("/api/runset/:id", (req,res)=>{
    const id = req.params.id;
    db.query("SELECT *,`Run number` AS id FROM `Runlog-cdaq` WHERE `Run number` = ?", id, (err,result) => {
        if(err) {
            console.log(err)
        } 
        res.send(result.map(addMonData))
    });
});

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });

app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server is running on ${port}`)
});
