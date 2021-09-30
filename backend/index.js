const express = require('express');
const db = require('./config/db')
const cors = require('cors')
const moment = require('moment')

const app = express();
const port = 3002;

app.use(cors());
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
    db.query("SELECT *,`Run number` AS id FROM `Runlog-cdaq` ORDER BY `Run number` DESC", (err,result) => {
        if(err) {
            console.log(err)
        } 
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

app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server is running on ${port}`)
});
