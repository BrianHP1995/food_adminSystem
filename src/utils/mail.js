/**
 *  nodemailer 模块
 * */

"use strict";  //使用严格模式
const nodemailer = require("nodemailer");


//创建发送邮件的对象




function send(mail, content) {
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",  //发送方邮箱
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: '1761328195@qq.com', // 发送方邮箱地址
            pass: 'zmzbefytujfxbbba' // smtp 验证码
        }
    });
    // 邮件信息
    let info = {
        from: '"发件人" <1761328195@qq.com>', // sender address
        to: mail, // list of receivers 2811007250
        subject: "", // Subject line
        text: `您的验证码是${content},有效期五分钟 `
        //html: "<div><p>哈哈哈</p></div>" // html body
    }
    return new Promise((resolve, reject) => {
        //发送邮件
        transporter.sendMail(info, (err,data) => {
            if(err) {
                reject();
            }else {
                resolve();
            }
        });
    })

}
module.exports = { send }
