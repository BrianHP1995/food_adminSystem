const express = require('express');
const multer = require('multer');

var router = express.Router();

var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function(req, file, cb) {
        cb(null, './static/images')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function(req, file, cb) {
        var exts = (file.originalname).split(".");
        var ext = exts[exts.length-1];
        var timename = new Date().getTime()+ parseInt(Math.random()*9999);
        //给图片加上时间戳格式防止重名名
        cb(null, `${timename}.${ext}`);
    }
});
var upload = multer({
    storage: storage
});

router.post('/upload',upload.single('hehe'), (req, res) => {
    /**
     *  限制图片大小 类型
     *
     * */
    let {size,mimetype,filename} = req.file;
    let types = ['jpg','png','jpeg','gif'];
    let tmptype = mimetype.split('/')[1];
    if(size>500000) {
        return res.send({err: -1,msg: '图片文件太大'})
    }else if(types.indexOf(tmptype)==-1) {
        return res.send({err: -1,msg: '媒体类型错误'})
    }else {
        let url = `http://localhost:3000/images/${filename}`;
        res.send({err:0,msg:'上传成功',img: url})
    }

})

module.exports = router;
