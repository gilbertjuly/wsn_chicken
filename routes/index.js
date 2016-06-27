var express = require('express');
var mongoose = require('mongoose');
var Chicken = require('./../models/chicken.js');
var Sensor = require('./../models/sensor.js');
var Log = require('./../models/log.js');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'JUMA' });
});

router.get("/about", function(req, res){
    //res.sendFile(path + "about.html");
    res.render('index', { title: 'JUMA' });
});

/************************* Log ***************************/

router.get("/save_log", function(req, res){
    var log= new Log({ log: req.query.log});
    log.save(function(err){
        if(err){
            console.log(err);
            res.json({"status":"ERROR", "msg": err});
        }
        else{
            console.log('GET creating new log: ' + log);
            res.json({"status":"OK"});
        }
    });
});

router.get("/read_logs", function(req, res){
    Sensor.find().exec(function(err, logs){
        if(err){
            console.log(err);
            res.send("There was a problem getting the information from the database.");
        }
        else{
            //console.log('GET getting chickens');
            //res.json(chickens);
            //sensors.reverse();
            res.render('chickens/log', { logs : logs});
        }
    });
});

/************************* Log ***************************/

/************************* Chicken ***************************/
// save Chicken data from GET request
router.get("/save_chicken", function(req, res){
    var did = req.query.did;
    var steps = req.query.steps;
    var volt = req.query.volt;

    var chicken= new Chicken({ did: did,
        steps: steps,
        volt: volt});
    chicken.save(function(err){
        if(err){
            console.log(err);
            res.json({"status":"ERROR"});
        }
        else{
            console.log('GET creating new chicken: ' + chicken);
            //res.render("sensor/result");
            res.json({"status":"OK"});
        }
    });
});

// save Chicken data from POST request
router.post("/save_chicken", function(req, res){
    var did = req.body.did;
    var steps = req.body.steps;
    var volt = req.body.volt;

    var chicken= new Chicken({ did: did,
        steps: steps,
        volt: volt});
    chicken.save(function(err){
        if(err){
            console.log(err);
            res.json({"status":"ERROR"});
        }
        else{
            console.log('GET creating new chicken: ' + chicken);
            //res.render("sensor/result");
            res.json({"status":"OK"});
        }
    });
});

// return html
router.get("/chickens", function(req, res){
    console.log("GET chickens html");
    res.render('chickens/chickens/index.html');
});

// return Chicken data in a range
router.get("/chickens_page", function(req, res){
    console.log("GET chickens in some page");
    var count= req.query.count;
    var offset= req.query.offset;
    console.log(req.query);

    var chickensCallback = function(err, chickens){
        if(err){
            console.log("error: " + err);
            res.send("There was a problem getting the information from the database." + err);
        }
        else{
            res.header('Content-type','application/json');
            res.header('Charset','utf8');
            res.header('Access-Control-Allow-Origin', '*');
            res.send(JSON.stringify(chickens));
            console.log("GET chickens in some page:" + req.query.callback);
            console.log("GET chickens in some page:" + JSON.stringify(chickens));
        }
    };

    //if ( typeof count === 'undefined' || count === null ){
    if ( count == null )
        count = 10;
    else
        count = Number(count);

    if ( offset == null )
        offset = 0;
    else
        offset = Number(offset);

    console.log("offset = " + offset + ", count = " + count);

    Chicken.find()
        .limit(count).skip(offset)
        .exec(chickensCallback);
});
/************************* Chicken ***************************/

/*
 * SENSOR Related
 */
/* Sensor data posting */
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
            //res.render("sensor/result");
            res.json({"status":"OK"});
        }
    });
});

/* Export Sensor data by JSONP, solving Cross-Domain issue. */
router.get("/sensors", function(req, res){
    console.log("GET senosrs");
    var id = req.query.id;
    var type = req.query.type;
    var count= req.query.count;
    var offset= req.query.offset;

    var sensorsCallback = function(err, sensors){
        if(err){
            console.log(err);
            res.send("There was a problem getting the information from the database.");
        }
        else{
            res.header('Content-type','application/json');
            res.header('Charset','utf8');
            res.send(JSON.stringify(sensors));
            console.log("GET sensors:" + req.query.callback);
            console.log("GET sensors:" + JSON.stringify(sensors));
        } 
    }; 

    //if ( typeof count === 'undefined' || count === null ){
    if ( count == null )
        count = 10;
    else
        count = Number(count);

    if ( offset == null )
        offset = 0;
    else
        offset = Number(offset);

    console.log("offset = " + offset + ", count = " + count);

    if( (typeof id !== 'undefined' && id ) && 
        (typeof type !== 'undefined' && type)){
        Sensor
        .find()
        .where('ID').equals(id)
        .where('TYPE').equals(type)
        .sort({CREATED_AT:-1})
        .limit(count).skip(offset)
        .exec(sensorsCallback);
    }
    else if(typeof id !== 'undefined' && id ){
        Sensor
        .find()
        .where('ID').equals(id)
        .sort({CREATED_AT:-1})
        .limit(count).skip(offset)
        .exec(sensorsCallback);
    }
    else if(typeof type !== 'undefined' && type){
        //type = decodeHtmlEntit(type); 
        Sensor
        .find()
        .where('TYPE').equals(type)
        .sort({CREATED_AT:-1})
        .limit(count).skip(offset)
        .exec(sensorsCallback);
    }
    else{
        Sensor
        .find()
        .sort({CREATED_AT:-1})
        .limit(count).skip(offset)
        .exec(sensorsCallback);
    }

});

/* A example of Sensor data generating */
router.get("/sensor_generator", function(req, res){
    res.render('sensor_generator/index');
});

/* Display 10 most recent Sensor data */
router.get('/sensors_ten', function(req, res) {
    Sensor.find().sort({CREATED_AT:-1}).limit(10).exec(function(err, sensors){
      if(err){
            console.log(err);
            res.send("There was a problem getting the information from the database.");
        }
        else{
            //console.log('GET getting chickens');
            //res.json(chickens);
            //sensors.reverse();
            res.render('sensors_ten/index', { sensors : sensors});
        }   
    });
});




module.exports = router;
