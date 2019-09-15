const express = require('express');
const Food = require('../db/model/foodModel');
var router = express.Router(); //获取路由实例

/**
 * @api {post} /food/add 添加食品
 * @apiName 添加食品
 * @apiGroup Food
 * @apiParam {String} name 食品名
 * @apiParam {String} price 食品价格
 * @apiParam {String} desc 食品描述
 * @apiParam {String} img 食品图片
 * @apiParam {String} typeName 类名
 * @apiParam {Number} typeID 类ID
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/add', (req, res) => {
    let {name,price,desc,img,typeName,typeID} = req.body;
    let ctime = new Date().getTime();
    Food.insertMany({name,price,desc,img,typeName,typeID,ctime})
        .then(() => {
            res.send({err: 0,msg: '添加成功'})
        })
        .catch(() => {
            res.send({err: 0,msg: '添加失败'})
        })
})

/**
 * @api {get} /food/getInfoByType 分类查询
 * @apiName getInfoByType
 * @apiGroup Food
 * @apiParam {Number} typeID 分类id
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/getInfoByType',(req, res) => {
    let{typeID} = req.query;
    Food.find({typeID}).sort({ctime: -1})
        .then((data) => {
            console.log(data);
            res.send({err: 0,msg: '查询成功',data: data})
        })
        .catch((err) => {
            res.send({err: -1,msg: '查询失败'})
        })
})

/**
 * @api {get} /food/getInfoBykw 关键字查询
 * @apiName getInfoBykw
 * @apiGroup Food
 * @apiParam {String} kw 关键字
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/getInfoByKw', (req,res) => {
    let {kw} = req.query;

    let reg = new RegExp(kw); //创建正则表达式，匹配关键字

    Food.find({$or:[{name: {$regex: reg}},{desc: {$regex: reg}}]}).sort({ctime: -1})
        .then((data) => {

            res.send({err: 0,msg: '查询成功',data: data})
        })
        .catch(err => {
            res.send({err: -1,msg: '查询失败'})
        })
})

/**
 * @api {get} /food/del 删除菜品
 * @apiName del
 * @apiGroup Food
 * @apiParam {String} _id id
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/del',(req, res) => {

    let {_id } = req.query;

    Food.deleteOne({_id})
        .then(() => {
            res.send({err:0,msg: '删除成功'});
        })
        .catch((err) => {
            res.send({err:-1,msg: '删除失败'});
        })
})


/**
 * @api {get} /food/update 修改菜品
 * @apiName update
 * @apiGroup Food
 * @apiParam {String} _id id
 * @apiParam {String} name 食品名
 * @apiParam {String} price 食品价格
 * @apiParam {String} desc 食品描述
 * @apiParam {String} img 食品图片
 * @apiParam {String} typeName 类名
 * @apiParam {Number} typeID 类ID
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/update', (req, res) => {
    let{_id,name,price,desc,img,typeName,typeID} = req.query;
    Food.updateOne({_id: _id},{name,price,desc,img,typeName,typeID})
        .then((err, data) => {
            console.log(data);
            res.send({err:0,msg: '修改成功'});
        })
        .catch(err => {
            res.send({err:-1,msg: '修改失败'});
        })
})

/**
 * @api {get} /food/getInfoByPage  分页查询
 * @apiName getInfoByPage
 * @apiGroup Food
 * @apiParam {Number} pageSize 每页数据条数
 * @apiParam {Number} page 页码
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/getInfoByPage', (req, res) => {
    let pageSize = req.query.pageSize || 5;
    let page = req.query.page || 1;
    let count = 0; //总条数
    Food.find()
        .then(list => {
            count = list.length;
            return Food.find().sort({ctime: -1}) .limit(Number(pageSize)).skip(Number((page-1)*pageSize))
        })
        .then((data) => {
            let allPage = count/pageSize;
            res.send({err: 0,msg: '查询成功', data: {list: data,count,allPage}});
        })
        .catch(err => {
            res.send({err: -1,msg: '查询失败'});
        })
})

module.exports = router;
