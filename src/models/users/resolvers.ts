/** @format */

import {ApolloError} from 'apollo-server-express'
import {User} from '../../entity/User'
import {hash, compare} from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {isAuth} from '../../utils/isAuth'

const fetchUsers = async (_: any, {offset = 0, limit = 10}, context: any) => {
    isAuth(context)
    if (offset < 0 || limit < 0) {
        new ApolloError('参数范围错误', '404', {
            offset: offset,
            limit: limit,
        })
    }
    return await User.find()
}

const Register = async (_: any, args: any, context: any) => {
    const {name, email, password, avatar, age} = args

    const user = User.findOne({
        where: {
            email,
        },
    })

    if (user) throw new ApolloError('用户已存在', '200')

    const hashedPassword = await hash(password, 13)
    try {
        await User.insert({
            name,
            email,
            password: hashedPassword,
            avatar,
            age,
        })
        return true
    } catch (error) {
        return false
    }
}

const Login = async (_: any, args: any, context: any) => {
    const {email, password} = args
    const user = await User.findOne({
        where: {
            email,
        },
    })

    if (!user) {
        throw new Error('未找该用户~')
    }

    const verify = compare(password, user.password)

    if (!verify) {
        throw new Error('密码错误~')
    }

    return {
        accessToken: jwt.sign({user: {...user}}, 'mySecretKey', {
            expiresIn: '1d',
        }),
    }
}

const getUser = async (_: any, args: any, {req}: any) => {
    const {id} = args
    return await User.findOne({where: {id: id}})
}

export const Query = {
    getUser,
    fetchUsers,
}

export const Mutation = {
    Register,
    Login,
}
