var mongoose = require('mongoose');
var chickenSchema = new mongoose.Schema({
    did: { type: String, required: true }, // 设备 id
    steps: { type: Number, required: true }, // 步数
    volt: { type: Number, required: true }, // 设备电压
    time: { type: Date, required: true, default: Date.now } // 接收到这一数据的时间
});

module.exports = mongoose.model('Chicken', chickenSchema, 'chickens');
// 'Chicken' is the Model name
// 'chickens' is the collection name in mongoDB



