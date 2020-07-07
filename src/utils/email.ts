/** @format */

import config from '../config/index'
import nodemailer from 'nodemailer'

const smtpTransport = nodemailer.createTransport(config.email.smtpConfig)

interface options {
    from: string
    to: string
    subject?: string
    text?: string
    html?: string
}
4
// 发送邮件
export const send = (mailOptions: options) => {
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(info)
            }
        })
    })
}
