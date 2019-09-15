const mongoose = require('mongoose');

//通过mongoose新建Schema对象
var foodSchema = new mongoose.Schema({
    name: {type:String,required: true},
    price: {type:String,required: true},
    desc: {type:String,required: true},
    img: {type:String,required: true},
    typeName: {type:String,required: true},
    typeID: {type:Number,required: true},
    ctime: String
})

//将schema对象转换为数据模型
var Foods = mongoose.model('Foods', foodSchema);

module.exports = Foods;
