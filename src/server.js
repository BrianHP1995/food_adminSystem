const express = require('express');
const db = require('./db/connect');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
var userRouter = require('./router/userRouter'); //引入路由
var foodRouter = require('./router/foodRouter'); //引入路由
var fileRouter = require('./router/fileRouter');

var JWT = require('./utils/jwt');

var session = require('express-session');
app.use(express.static(path.join(__dirname, './static')));

//解析表单数据，x-www-form-urlencoded
app.use(bodyparser.urlencoded({extended: false}));
//解析json数据
app.use(bodyparser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false, //无论有没有session cookie，每次请求都设置session cookie
    cookie: { maxAge: 60*1000 * 60 }
}))

//路由接口 作为中间件使用
app.use('/user', userRouter);
//session验证
// app.use('/food', (req,res,next) => {
//     if(req.session.login) {
//         next();
//     }else {
//         res.send({err: -99,msg:'请先登录'});
//     }
//     // console.log(req.session);
//
// },foodRouter);
//token验证
app.use('/food', (req,res,next) => {
   let {token} = req.query;
    if(token) {
        JWT.checkToken(token)
            .then((res) => {
                next();
            })
            .catch(err => {
                res.send({err: -2,msg: 'token 验证失败'})
            })

    }else {
        res.send({err: -99,msg:'请先登录'});
    }
    // console.log(req.session);

},foodRouter);
app.use('/file', fileRouter);
//启动服务
app.listen(3000, () => {
    console.log('server start');
});
