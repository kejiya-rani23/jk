var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password : {type:String},
    mobile: {type: Number},
    description: {type: String},
    createAt: {type: Date},
    updatedAt: {type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);