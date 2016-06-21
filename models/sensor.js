var mongoose = require('mongoose');  
var sensorSchema = new mongoose.Schema({  
    ID: { type: String, required: true },
    TYPE: { type: String },
    LOCATION: {type: String },
    VALUE: {type: String},
    TIME: {type: String},
    CREATED_AT: { type: Date, required: true, default: Date.now }    
});


module.exports = mongoose.model('Sensor', sensorSchema, 'sensors');




