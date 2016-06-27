/**
 * Created by wanganjun on 16/6/27.
 */

var mongoose = require('mongoose');
var logSchema = new mongoose.Schema({
    log: { type: String, required: true }
});

module.exports = mongoose.model('Log', logSchema, 'logs');
