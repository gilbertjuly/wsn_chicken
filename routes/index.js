var express = require('express');
var mongoose = require('mongoose');
var Chicken = require('./../models/chicken.js')
var Sensor = require('./../models/sensor.js')
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'JUMA' });
});

router.get("/about", function(req, res){
    //res.sendFile(path + "about.html");
    res.render('index', { title: 'JUMA' });
});

router.get("/chicken", function(req, res){
    var id = req.query.id;
    var motion = req.query.motion;

    var chicken = new Chicken({ id: id, 
                                motion: motion});
    chicken.save(function(err){
        if(err){
            console.log(err);
            res.send("There was a problem adding the information to the database.");
        }
        else{
            console.log('GET creating new chicken: ' + chicken);
            //res.json(chicken);
            res.send("OK");
        }
    });

});

router.get('/chickens', function(req, res) {
    Chicken.find().sort({created_at:-1}).limit(10).exec(function(err, chickens){
      if(err){
            console.log(err);
            res.send("There was a problem getting the information from the database.");
        }
        else{
            //console.log('GET getting chickens');
            //res.json(chickens);
            res.render('chickens/index', { chickens : chickens });
        }   
    });
});

router.get("/sensor", function(req, res){
    res.render('sensor/index');
});

router.post("/sensor", function(req, res){
    var sensorId = req.body.sensorId;
    var sensorType = req.body.sensorType;
    var sensorLocation = req.body.sensorLocation;
    var sensorValue = req.body.sensorValue;
    var sensorTime = req.body.sensorTime;

    var sensor= new Sensor({ ID: sensorId, 
                             TYPE: sensorType,
                             LOCATION: sensorLocation,
                             VALUE: sensorValue,
                             TIME: sensorTime});
    sensor.save(function(err){
        if(err){
            console.log(err);
            res.json({"status":"ERROR"});
        }
        else{
            console.log('GET creating new sensor: ' + sensor);
            //res.json(chicken);
            //res.render("sensor/result");
            res.json({"status":"OK"});
        }
    });
});

router.get('/sensors', function(req, res) {
    Sensor.find().sort({created_at:-1}).limit(10).exec(function(err, sensors){
      if(err){
            console.log(err);
            res.send("There was a problem getting the information from the database.");
        }
        else{
            //console.log('GET getting chickens');
            //res.json(chickens);
            sensors.reverse();
            res.render('sensors/index', { sensors : sensors});
        }   
    });
});




module.exports = router;
