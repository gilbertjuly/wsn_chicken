var express = require('express');
var mongoose = require('mongoose');
var Chicken = require('./../models/chicken.js');
var Sensor = require('./../models/sensor.js');
var Log = require('./../models/log.js');
var router = express.Router();


/************************* helper function ***************************/
Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Date.prototype.isSameDay = function (otherDate) {
    return this.getFullYear === otherDate.getFullYear && this.getMonth === otherDate.getMonth && this.getDate() === otherDate.getDate();
};
/************************* helper function ***************************/

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
    Log.find().exec(function(err, logs){
        if(err){
            console.log(err);
            res.send("There was a problem getting the information from the database.");
        }
        else{
            //console.log('GET getting chickens');
            //res.json(chickens);
            //sensors.reverse();
            res.render('chickens/log.ejs', { logs : logs});
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

// return html to show chicken list
router.get("/chickens", function(req, res){
    console.log("GET chickens html");
    res.render('chickens/chickens/index.html');
});

router.get("/chickens_chart", function(req, res){
    var year = +req.query.year;
    var month = +req.query.month;
    var day = +req.query.day;
    console.log("查看 " + year + '-' + month + '-' + day + " 的小鸡图表");

    var currentWeeHours = new Date(year, month - 1, day);
    var nextWeeHours = new Date(year, month - 1, day + 1);

    console.log(currentWeeHours.toISOString() + ' == ' + nextWeeHours.toISOString());

    Chicken
        .find()
        .where('time').gte(currentWeeHours).lt(nextWeeHours)
        .sort('did time')// 按 did 正序, time 正序
        .exec(function (err, chickenDatas) {

            if (err) {
                console.log(err);
                res.send("error occur: " + err);
                return;
            }

            chickenDatas = chickenDatas.map(function (item) {
                return {did: item.did, steps: item.steps, time: item.time}
            });

            // 按 did 分组, [{did : chickenData}]
            var did_data_dicts = [];
            for (var i = 0; i < chickenDatas.length; i++) {
                var data = chickenDatas[i];
                var did = data.did;
                //console.log("origin = " + JSON.stringify(data));

                var lastDict = did_data_dicts.last;
                var lastDictArray = lastDict[did];

                if (lastDictArray === undefined) {
                    var dict = {};
                    dict[did] = [data];
                    did_data_dicts.push(dict);
                } else {
                    lastDictArray.push(data);
                }
            }

            for (var i = 0; i < did_data_dicts.length; i++) {
                console.log("did dict = " + JSON.stringify(did_data_dicts[i]));
            }

            //console.log("chickens chart = " + JSON.stringify(did_data_dicts));

        })
});

// return html to all data about one chicken
router.get("/chicken", function(req, res){
    var did = req.query.did;
    console.log("GET html to show all data about one chicken " + did);

    Chicken
        .find({did : did}) // 查询数据库中所有与 query 中 did 相等的数据
        .select('did steps volt time')// 只取 Chicken 中定义的字段
        .sort({time:-1}) // 按时间倒序
        .exec(function(err, chicken_datas){
        if(err){
            console.log(err);
            res.send("There was a problem getting the information from the database.");
        }
        else {
            var millsecondsInOneHour = 1000 * 3600;
            var uint16max = 65535;

            chicken_datas.checkMissingData = function (callback) {
                var result = [ this.first() ];
                console.log("data 0 = " + JSON.stringify(this.first()));

                for (var i = 1; i < this.length; i++) {
                    var previousData = this[i - 1];
                    var currentData = this[i];

                    // 检查时间间隔, 向下取整
                    var hourDelta = Math.floor((previousData.time.getTime() - currentData.time.getTime()) / millsecondsInOneHour);

                    if (hourDelta > 1) {
                        var stepsDelta = previousData.steps - currentData.steps;
                        var insertedDatas = callback(previousData, stepsDelta, hourDelta);

                        for (var x = 0; x < insertedDatas.length; x++) {
                            result.push(insertedDatas[x]);
                            console.log("inserting " + JSON.stringify(result.last()));
                        }
                    }

                    console.log("data " + i + " = " + JSON.stringify(currentData) + ", hour delta = " + hourDelta);
                    result.push(currentData);
                }

                return result;
            };

            chicken_datas.insertAndEven = function () {
                if (this.length < 2) return this;

                return this.checkMissingData(function (previousData, stepsDelta, hourDelta) {
                    var stepsDeltaInOneHour = 0;
                    var insertedDatas = [];

                    if (stepsDelta > 0) {
                        stepsDeltaInOneHour = stepsDelta / hourDelta;
                    } else if (stepsDelta < 0) {
                        stepsDeltaInOneHour = (stepsDelta + 1 + uint16max) / hourDelta;
                    }

                    stepsDeltaInOneHour = Math.floor(stepsDeltaInOneHour);

                    // 应该插入 hourDelta - 1 个数据
                    for (var j = 1; j < hourDelta; j++) {
                        var insertedDate = new Date(previousData.time.getTime() - j * millsecondsInOneHour);

                        var insertedSteps = previousData.steps - j * stepsDeltaInOneHour;
                        if (insertedSteps < 0) {
                            insertedSteps += (uint16max + 1);
                        }

                        var insertedData = {
                            did: previousData.did,
                            steps: insertedSteps,
                            volt: previousData.volt,
                            time: insertedDate
                        };

                        insertedDatas.push(insertedData);
                    }

                    return insertedDatas;
                });
            }

            // 插入数据
            chicken_datas = chicken_datas.insertAndEven();

            chicken_datas.splitByDay = function () {
                if (this.length === 0) return [];

                var days = [[ this.first() ]];
                var previousData = days.first().first();

                for (var i = 1; i < this.length; i++) {
                    var currentData = this[i];

                    if (currentData.time.isSameDay(previousData.time)) {
                        days.last().push(currentData);
                    } else {
                        days.push([currentData]);
                    }

                    previousData = currentData;
                }

                return days;
            };

            // 按天分组, 结构 [[Chicken]]
            var chicken_data_by_day = chicken_datas.splitByDay();

            // 在某一天内部按正序排序
            for (i = 0; i < chicken_data_by_day.length; i++) {
                chicken_data_by_day[i].reverse();
                //console.log(JSON.stringify(chicken_data_by_day[i]));
            }

            console.log("按天分组的个数 = " + chicken_data_by_day.length);
            
            //  按天对步数分组
            var chicken_steps_by_day = [];
            for (var i = 0; i < chicken_data_by_day.length; i++) {
                var data_in_current_day = chicken_data_by_day[i];
                var first_data_current_day = data_in_current_day[0];
                console.log("current = " + JSON.stringify(first_data_current_day));

                var data_in_previous_day = chicken_data_by_day[i+1];
                if (i + 1 === chicken_data_by_day.length) {
                    data_in_previous_day = [{steps: first_data_current_day.steps}];
                }
                var last_data_previous_day = data_in_previous_day[data_in_previous_day.length - 1];
                console.log("previous = " + JSON.stringify(last_data_previous_day));

                var stepDeltas = [first_data_current_day.steps - last_data_previous_day.steps];
                for (var j = 1; j < data_in_current_day.length; j++) {
                    var delta = data_in_current_day[j].steps - data_in_current_day[j-1].steps;
                    if (delta < 0) {
                        delta += (uint16max + 1);
                    }
                    stepDeltas.push(delta);
                }

                var date = first_data_current_day.time;
                var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

                var chicken_in_current_day = { dateString: dateString, stepValues: stepDeltas };
                chicken_steps_by_day.push(chicken_in_current_day);
            }

            //var chicken_steps_by_day = chicken_data_by_day.map(function (data_in_day) {
            //    var date = data_in_day[0].time;
            //    var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            //
            //    var stepDeltas = [data_in_day[0].steps - chicken_data_by_day[day+1].last()];
            //    for (var i = 1; i < data_in_day.length; i++) {
            //        var delta = data_in_day[i].steps - data_in_day[i-1].steps;
            //        stepDeltas.push(delta);
            //    }
            //
            //    return { dateString: dateString, stepValues: stepDeltas };
            //});

            chicken_steps_by_day.forEach(function (item) {
                console.log(item.dateString + ", " + item.stepValues.length + " 个步数值, " + item.stepValues);
            });

            res.render('chickens/chicken.ejs', { did : did, chicken_datas : chicken_datas, div_count: chicken_steps_by_day.length, chicken_steps_by_day: JSON.stringify(chicken_steps_by_day)});
        }
    });
});

// return all Chicken data at a certain hour
router.get("/chickens_at_hour", function(req, res){
    // 从 query 中得到的 year 等是 string 类型, 在 string 前使用 +, 会把 string 变成数字
    var year = +req.query.year;
    var month = +req.query.month;
    var day = +req.query.day;
    var hour = +req.query.hour;

    var currentHour = new Date(year, month, day, hour,     0, 0);
    var nextHour    = new Date(year, month, day, hour + 1, 0, 0);
    console.log("GET chickens from " + currentHour + " to " + nextHour);

    Chicken
        .find()
        .where('time').gte(currentHour).lt(nextHour)
        .exec(function(err, chickens){
            if(err){
                console.log("error: " + err);
                res.send("There was a problem getting the information from the database." + err);
            }
            else{
                res.header('Content-type','application/json');
                res.header('Charset','utf8');
                res.header('Access-Control-Allow-Origin', '*');
                res.send(JSON.stringify(chickens));
                //console.log("GET chickens in some page:" + req.query.callback);
                console.log("GET " + chickens.length + " chickens");
                //console.log(JSON.stringify(chickens));
            }
        });
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
