const express = require('express');
const User = require('../db/model/userModel');
var sendMail = require('../utils/mail');
var JWT = require('../utils/jwt');
var router = express.Router(); //获取路由实例

//存放发给邮箱的验证码
let codes = {};

/**
 * @api {post} /user/register 用户注册
 * @apiName 用户注册
 * @apiGroup User
 * @apiParam {String} us 用户名
 * @apiParam {String} ps 密码
 * @apiParam {String} mail 邮箱
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/register', (req, res) => {
    //接受数据
    let {us,ps,code} = req.body;
    console.log(code, codes[us]);
    //数据处理
    if(!us || !ps || !code)   return  res.send({err: -1,msg: '参数错误'});

    //邮箱验证码校验
    if(codes[us].code != code)   return  res.send({err: -4,msg: '验证码错误'});

    //操作数据库,先查再注册
    User.find({us})
        .then((data) => {
            if(data.length === 0) {
                //用户名不存在，可以注册
                User.insertMany({us: us,ps: ps})
                    .then(() => {
                        res.send({err: 0, msg: '注册成功'})
                    })
                    .catch((err) => {
                        res.send({err: 0, msg: err})
                    })
            }else {
                res.send({err: -2, msg: '用户名已存在'});
            }
        })
        .catch((err) => {
            res.send({err: 0, msg: err})
        })


    //返回数据
})


/**
 * @api {post} /user/login 用户登录
 * @apiName login
 * @apiGroup User
 * @apiParam {String} us 用户名
 * @apiParam {String} ps 密码
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/login',(req, res) => {
    let {us,ps} = req.body;

    if(!us || !ps) return res.send({err: -1,msg: '参数错误'});
    User.find({us,ps})
        .then((data) => {
            if(data.length > 0) {
                //产生token
                var token = JWT.createToken({login: true,name: us});
                //登录成功将相关信息存入session
                req.session.login = true;
                req.session.name = us;
                res.send({err: 0,msg: '登录成功',token});

            }else {

                res.send({err: 0,msg: '用户名或密码不正确'})

            }
        })
        .catch(err => {
            res.send({err: -1,msg: '内部错误'});
        })

})
/**
 * @api {post} /user/loginOut 退出登录
 * @apiName 退出登录
 * @apiGroup User
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/loginOut',(req,res) => {
    req.session.destroy();
    res.send({err: 0,msg: '退出成功'})
})

/**
 * @api {post} /user/getMailCode 发送邮箱验证码
 * @apiName 发送邮箱验证码
 * @apiGroup User
 * @apiParam {String} mail 邮箱
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getMailCode', (req, res) => {

    //获取邮箱参数
    let {mail} = req.body;
    //获取当前时间戳
    let timeS = new Date().getTime();
    //产生随机码
    let code = parseInt(Math.random()*10000);

    if(codes[mail] && timeS-codes[mail].timeS < 60000) {

        res.send({err: -2, msg: '验证码已经发送'});

    }else {
        sendMail.send(mail, code)
            .then(() => {
                codes[mail] = code;
                codes[mail] = {code,timeS};
                res.send({err: 0, msg: '验证码发送成功'});
            })
            .catch((err) => {
                res.send({err: -1, msg: '验证码发送失败'});
            })
    }


})


module.exports = router;
