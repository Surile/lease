/** @format */

export interface Config {
    debug: Boolean
    // name: String
    jwt: {
        tokenSecret: string
        expiresIn: string | number
    }
    smtpConfig: {
        host: String
        port: String
        secure: Boolean
        auth: {
            user: String
            pass: String
        }
    }
    // defaultAvatar: String
    // host: String
    // // 端口 [必填]
    // port: Number
    // // 网站的域名 [必填]
    // domain: String
}
