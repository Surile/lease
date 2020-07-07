/** @format */

import {ApolloError} from 'apollo-server-express';
import {hash, compare} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../../entity/User';
import {isAuth} from '../../utils/isAuth';
import * as Email from '../../utils/email';
import config from '../../config';
import {UserTypes} from '../../types';

const generateEmailHTMLContent = (content: string) => {
    return (
        '<table width="100%" height="100%" bgcolor="#e0e0e0" style="min-width: 348px; font-family: \'Helvetica Neue\', \'Luxi Sans\', \'DejaVu Sans\', Tahoma, \'Hiragino Sans GB\', \'Microsoft Yahei\', sans-serif;" border="0" cellspacing="0" cellpadding="0">' +
        '<tr height="32px"></tr>' +
        '<tr align="center">' +
        '<td width="32px"></td>' +
        '<td>' +
        '<table style="max-width: 600px;" width="100%" border="0" cellspacing="0" cellpadding="0">' +
        '<tr>' +
        '<td>' +
        '<table style="border-top-left-radius: 3px; border-top-right-radius: 3px;" bgcolor="#25a716" width="100%" border="0" cellspacing="0" cellpadding="0">' +
        '<tr><td height="25px"></td></tr>' +
        '<tr>' +
        '<td width="32px"></td>' +
        '<td style="font-size:24px; color:#fff;">' +
        config.name +
        '</td>' +
        '<td width="100px" align="center">' +
        '</td>' +
        '</tr>' +
        '<tr><td height="15px"></td></tr>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<table style="border-bottom: 1px solid #eeeeee;" bgcolor="#fff"  width="100%" border="0" cellspacing="0" cellpadding="0">' +
        '<tr><td height="30px"></td></tr>' +
        '<tr>' +
        '<td width="32px"></td>' +
        '<td style="padding:0px; font-size:14px; color:#888;">' +
        content +
        '</td>' +
        '<td width="32px"></td>' +
        '</tr>' +
        '<tr><td height="30px"></td></tr>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        '<table style="border-bottom-left-radius: 3px; border-bottom-right-radius: 3px;" bgcolor="#fdfdfd" width="100%" border="0" cellspacing="0" cellpadding="0">' +
        '<tr><td height="20px"></td></tr>' +
        '<tr>' +
        '<td width="32px"></td>' +
        '<td style="font-size:12px; color:#888; line-height:22px; word-break:break-all;">' +
        '此电子邮件地址无法接收回复。要就此提醒向我们提供反馈，<a href="mailto:54sword@gmail.com?subject=问题反馈[小度鱼]" style="color:#14a0f0; text-decoration: none;" target="_blank">请点击此处。</a><br />' +
        '如需更多信息，请访问 <a href="http://www.xiaoduyu.com" style="color:#14a0f0; text-decoration: none;" target="_blank">小度鱼</a>。' +
        '</td>' +
        '<td width="32px"></td>' +
        '</tr>' +
        '<tr><td height="20px"></td></tr>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</td>' +
        '<td width="32px"></td>' +
        '</tr>' +
        '<tr height="32px"></tr>' +
        '</table>'
    );
};

const jwtOption = config.jwt;

const fetchUsers = async (_: any, {offset = 0, limit = 10}, context: any) => {
    isAuth(context);
    if (offset < 0 || limit < 0) {
        new ApolloError('参数范围错误', '404', {
            offset: offset,
            limit: limit,
        });
    }
    return await User.find();
};

const Register = async (_: any, args: any, context: any) => {
    const {name, email, password, avatar, age} = args;

    const user: UserTypes | undefined = await User.findOne({
        where: {
            email,
        },
    });

    const content =
        '<div style="font-size:18px;">尊敬的 ' +
        name +
        '，您好！</div>' +
        '<div>您正在小度鱼操作验证身份，若不是您本人操作，请忽略此邮件。</div>' +
        '如下是您的注册验证码:<br />' +
        '<span style="background:#eaffd2; padding:10px; border:1px solid #cbf59e; color:#68a424; font-size:30px; display:block; margin:10px 0 10px 0;">' +
        111 +
        '</span>' +
        '<div>请注意: 为了保障您帐号的安全性，验证码15分钟后过期，请尽快验证!</div>';

    const emailOptions = {
        from: '"魔道官方团队"<51414792@qq.com>',
        to: email,
        subject: '账号注册',
        text: content,
        html: generateEmailHTMLContent(content),
    };

    if (!user) {
        const hashedPassword = await hash(password, 13);
        const res: any = await Email.send(emailOptions);
        if (res.messageId) {
            try {
                await User.insert({
                    name,
                    email,
                    password: hashedPassword,
                    avatar,
                    age,
                });

                return true;
            } catch (error) {
                throw new ApolloError('注册失败，请稍后再试');
            }
        }
    } else {
        throw new ApolloError('邮箱已注册');
    }
};

const Login = async (_: any, args: any, context: any) => {
    const {email, password} = args;
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error('未找该用户~');
    }

    const verify = compare(password, user.password);

    if (!verify) {
        throw new Error('密码错误~');
    }

    const token = jwt.sign({user: user}, jwtOption.tokenSecret, {
        expiresIn: jwtOption.expiresIn,
    });

    return {
        accessToken: token,
    };
};

const getUser = async (_: any, args: any, {req}: any) => {
    const {id} = args;
    return await User.findOne({where: {id: id}});
};

export const Query = {
    getUser,
    fetchUsers,
};

export const Mutation = {
    Register,
    Login,
};
