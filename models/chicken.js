var mongoose = require('mongoose');  
var chickenSchema = new mongoose.Schema({  
    //name: String,
    did: { type: String, required: true },
    steps: { type: Number, required: true },
    volt: { type: Number, required: true },
    time: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Chicken', chickenSchema, 'chickens');
// 'Chicken' is the Model name
// 'chickens' is the collection name in mongoDB



