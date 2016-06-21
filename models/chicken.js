var mongoose = require('mongoose');  
var chickenSchema = new mongoose.Schema({  
    //name: String,
    id: { type: Number, required: true },
    motion: { type: Number, required: true },
    created_at: { type: Date, required: true, default: Date.now }    
});


module.exports = mongoose.model('Chicken', chickenSchema, 'chickens');
// 'Chicken' is the Model name
// 'chickens' is the collection name in mongoDB



