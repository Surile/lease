/** @format */

import {Config} from '../types'

let config: Config = {
    debug: false,
    // 验证规则
    jwt: {
        // Recommended: 63 random alpha-numeric characters
        // Generate using: https://www.grc.com/passwords.htm
        tokenSecret: '6CHXpJZ5v5ZtzabhDxDWzcWXUQMdQem86LEDO5dlbHzqZmlZq0hmG28TbA8pRbt',
        expiresIn: '1d', // 时间
    },
    // 邮箱配置
    smtpConfig: {
        host: '',
        port: '',
        secure: true,
        auth: {
            user: '',
            pass: '',
        },
    },
}

if (process.env.NODE_ENV == 'development') {
    config.debug = true
    // config.mongodbDebug = true;
}

export default config
