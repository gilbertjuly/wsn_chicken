var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'JUMA' });
});

router.get("/about",function(req,res){
    //res.sendFile(path + "about.html");
    res.render('index', { title: 'JUMA' });
});

module.exports = router;
