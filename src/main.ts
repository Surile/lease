/** @format */
import 'reflect-metadata'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import {ApolloServer, AuthenticationError, ApolloError} from 'apollo-server-express'
import {createConnection} from 'typeorm'
import {typeDefs, resolvers} from './models'
import router from './router'
import auth from './utils/auth'

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        debug: false,
        context: async ({req}: any) => {
            return {isAuth: req.isAuth}
        },
    })

    await createConnection()

    const app = express()

    app.use(helmet())

    app.use(auth)

    app.use(cors())

    app.use(bodyParser.json({limit: '20mb'}))

    app.use(bodyParser.urlencoded({limit: '20mb', extended: true}))

    app.use(function (req: any, res: any, next: any) {
        // 计算页面生成总的花费时间
        const start_at = Date.now()
        const _send = res.send
        res.send = function () {
            // 发送Header
            res.set('X-Execution-Time', String(Date.now() - start_at) + ' ms')

            // 调用原始处理函数
            return _send.apply(res, arguments)
        }

        next()
    })

    app.use('/', router())

    server.applyMiddleware({
        app,
        cors: {
            origin: '*',
            credentials: true,
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
        },
    })

    app.listen({port: 4000}, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))
}

startServer()
