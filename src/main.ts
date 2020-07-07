/** @format */
import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import {ApolloServer, AuthenticationError, ApolloError} from 'apollo-server-express';
import {createConnection, Any} from 'typeorm';
import {typeDefs, resolvers} from './models';
import router from './router';
import auth from './utils/auth';
import config from './config';
import log4 from './utils/log4';

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        debug: false,
        context: async ({req}: any) => {
            return {isAuth: req.isAuth};
        },
        formatError(err: any) {
            // 自定义一些错误
            if (err.message == 'Context creation failed: invalid token') {
                return {message: 'invalid token', code: 401};
            } else if (err.message == 'Context creation failed: blocked') {
                return {message: '您的账号被禁止使用', blocked: true};
            }
            return err;
        },
    });

    await createConnection();

    const app = express();

    log4(app);

    if (config.debug) app.use(logger('dev'));

    app.use(helmet());

    app.use(auth);

    app.use(cors());

    app.use(bodyParser.json({limit: '20mb'}));

    app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

    app.use(function (req: any, res: any, next: any) {
        // 计算页面生成总的花费时间
        const start_at = Date.now();
        const _send = res.send;
        res.send = function () {
            // 发送Header
            res.set('X-Execution-Time', String(Date.now() - start_at) + ' ms');

            // 调用原始处理函数
            return _send.apply(res, arguments);
        };

        next();
    });

    app.use('/', router());

    server.applyMiddleware({
        app,
        cors: {
            origin: '*',
            credentials: true,
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
        },
    });

    app.listen({port: 4000}, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
};

startServer();
