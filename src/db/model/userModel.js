
const mongoose = require('mongoose');

//通过mongoose新建Schema对象
var userSchema = new mongoose.Schema({
    us: {type:String,required: true},
    ps: {type:String,required: true},
    age: Number,
    sex: {type:Number,default: 0}
})

//将schema对象转换为数据模型
var User = mongoose.model('users', userSchema);

module.exports = User;
