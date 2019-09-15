const jwt = require('jsonwebtoken');
//私钥
const screct = 'adffdfdsfdsfsdfsdfsdf';

function createToken(payload) {
    //产生token
    payload.ctime = new Date();
    return jwt.sign(payload,screct);
}

function checkToken(token) {
    return new Promise((resolve,reject) => {
        jwt.verify(token,screct,(err, data) => {
            if(err) {reject('token 验证失败')}
            resolve(data);
        })
    })
}

module.exports = {
    createToken,
    checkToken
}
