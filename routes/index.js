var express = require('express');
var mongoose = require('mongoose');
var Chicken = require('./../models/chicken.js')
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
            console.log('GET getting chickens');
            //res.json(chickens);
            res.render('chickens/index', { chickens : chickens });
        }   
    });
});



module.exports = router;
