/** @format */

export interface Config {
    name: string;
    debug: boolean;
    jwt: {
        tokenSecret: string;
        expiresIn: string | number;
    };
    email: {
        // 内置邮件系统
        smtpConfig?: {
            service?: string;
            host?: string;
            port?: number;
            secure?: boolean;
            auth?: {
                user: string;
                pass: string;
            };
        };
        // 第三方邮件系统
        sendCloud?: {
            from: string;
            apiUser: string;
            apiKey: string;
        };
    };

    // defaultAvatar: String
    // host: String
    // // 端口 [必填]
    // port: Number
    // // 网站的域名 [必填]
    // domain: String
}

export interface UserTypes {
    name: string;
    email: string;
    password: string;
    avatar: string;
    age: number;
}
